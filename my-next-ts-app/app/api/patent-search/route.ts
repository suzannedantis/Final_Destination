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

    // Create a comprehensive prompt for patent search
    const prompt = `
    You are a patent search expert. Search for existing patents related to: "${query}"

    Please provide a comprehensive list of existing patents that are similar or related to this query. For each patent, include:
    1. Patent Title
    2. Patent Number (if available)
    3. Inventor(s)
    4. Filing Date (approximate if exact date not known)
    5. Brief Description
    6. Key Claims or Features
    7. Patent Status (Active, Expired, Pending)
    8. Similarity Score (1-10, where 10 is most similar to the query)

    Format the response as a JSON array with the following structure:
    [
      {
        "title": "Patent Title",
        "patentNumber": "US1234567",
        "inventors": ["Inventor Name 1", "Inventor Name 2"],
        "filingDate": "2020-01-15",
        "description": "Brief description of the patent",
        "keyClaims": ["Claim 1", "Claim 2", "Claim 3"],
        "status": "Active",
        "similarityScore": 8
      }
    ]

    Provide at least 5-10 relevant patents if they exist. If no similar patents exist, return an empty array.
    Only return the JSON array, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let patents = [];
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        patents = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try to parse the entire response
        patents = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Return a fallback response with the raw text
      return NextResponse.json({
        status: 'success',
        patents: [],
        rawResponse: text,
        message: 'Search completed but response format was unexpected'
      });
    }

    return NextResponse.json({
      status: 'success',
      patents: patents,
      query: query,
      message: `Found ${patents.length} related patents`
    });

  } catch (error) {
    console.error('Patent search error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error during patent search'
    }, { status: 500 });
  }
}