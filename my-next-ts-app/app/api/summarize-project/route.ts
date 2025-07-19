import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCi2GLKe8wBe9fI9tmVa4gXv4dNhi-Db5c');

export async function POST(request: NextRequest) {
  try {
    const { project } = await request.json();

    if (!project) {
      return NextResponse.json({ error: 'Project data is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
Please provide a comprehensive summary of this research project/paper in markdown format (with bold titles, bullet points if needed, and clearly structured text):

Title: ${project.title}
Category: ${project.category}
Authors: ${project.authors ? project.authors.join(', ') : 'N/A'}
Year: ${project.year || 'N/A'}
Journal: ${project.journal || 'N/A'}
Status: ${project.status}
Abstract/Description: ${project.abstract}
Tags: ${project.tags ? project.tags.join(', ') : 'N/A'}
Types: ${project.types || 'N/A'}

Please provide:
1. A concise executive summary (2-3 sentences)
2. Key research objectives and methodology
3. Main findings or expected outcomes
4. Significance and potential impact
5. Recommendations for further research or applications

Format the response using markdown: use ** for bold, bullet points, and structured sections for easy frontend rendering.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text().trim();

    // Optional: Remove leading "AI Summary" or similar heading
    summary = summary.replace(/^#+\s*AI Summary\s*/i, '').trim();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error summarizing project:', error);

    if (error.message?.includes('API key')) {
      return NextResponse.json({ error: 'Invalid API key configuration' }, { status: 401 });
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json({ error: 'API quota exceeded. Please try again later.' }, { status: 429 });
    }

    return NextResponse.json({
      error: 'Failed to generate project summary. Please try again.'
    }, { status: 500 });
  }
}
