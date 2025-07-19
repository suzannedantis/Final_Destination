import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === '') {
      return NextResponse.json({
        status: 'error',
        message: 'Search query is required'
      }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'Gemini API key is not configured'
      }, { status: 500 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a comprehensive prompt for research paper search
    const prompt = `
    You are a research expert. Search for existing research papers, academic publications, and projects related to: "${query}"

    Please provide a comprehensive list of relevant research papers and projects. For each result, include:
    1. Title
    2. Authors (array of names)
    3. Publication Year
    4. Journal/Conference (if applicable)
    5. Abstract/Description
    6. Key Research Areas/Tags
    7. Research Type (e.g., "Experimental Study", "Literature Review", "Case Study", "Technical Paper")
    8. Status ("Published", "In Review", "Preprint", "Conference Paper")
    9. Relevance Score (1-10, where 10 is most relevant to the query)
    10. Key Findings (brief summary of main results)

    Format the response as a JSON array with the following structure:
    [
      {
        "title": "Research Paper Title",
        "authors": ["Author Name 1", "Author Name 2"],
        "year": "2023",
        "journal": "Journal Name or Conference",
        "abstract": "Brief description of the research",
        "tags": ["tag1", "tag2", "tag3"],
        "type": "Research Type",
        "status": "Published",
        "relevanceScore": 8,
        "keyFindings": "Summary of main research findings and contributions"
      }
    ]

    Provide at least 5-10 relevant research papers if they exist. Focus on recent publications (2020-2024) when possible.
    If no similar research exists, return an empty array.
    Only return the JSON array, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let papers = [];
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        papers = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try to parse the entire response
        papers = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Return a fallback response with the raw text
      return NextResponse.json({
        status: 'success',
        papers: [],
        rawResponse: text,
        message: 'Search completed but response format was unexpected'
      });
    }

    return NextResponse.json({
      status: 'success',
      papers: papers,
      query: query,
      message: `Found ${papers.length} related research papers`
    });

  } catch (error) {
    console.error('Research search error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error during research search'
    }, { status: 500 });
  }
}