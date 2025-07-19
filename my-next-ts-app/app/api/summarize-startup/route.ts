import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variables (remove in production)
    console.log('Environment check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
    
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'API_KEY_PLACEHOLDER' || apiKey.trim() === 'AIzaSyCi2GLKe8wBe9fI9tmVa4gXv4dNhi-Db5c') {
      console.error('API key validation failed:', {
        exists: !!apiKey,
        isPlaceholder: apiKey === 'API_KEY_PLACEHOLDER',
        isEmpty: !apiKey || apiKey.trim() === '',
        length: apiKey?.length || 0
      });
      
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please add your API key to .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, idea_summary, stage, funding_status, website, registered_on } = body;

    // Validate required fields
    if (!name || !idea_summary) {
      return NextResponse.json(
        { error: 'Missing required fields: name and idea_summary' },
        { status: 400 }
      );
    }

    // Initialize Gemini AI with explicit API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create the prompt for Gemini
    const prompt = `
Please provide a comprehensive summary and analysis of the following startup:

**Startup Name:** ${name}
**Business Idea:** ${idea_summary}
**Current Stage:** ${stage || 'Not specified'}
**Funding Status:** ${funding_status || 'Not specified'}
**Website:** ${website || 'Not provided'}
**Registration Date:** ${registered_on ? new Date(registered_on).toLocaleDateString() : 'Not provided'}

Please analyze this startup and provide:
1. A brief executive summary of the business
2. Key strengths and potential opportunities
3. Market positioning and competitive advantages
4. Potential challenges or risks
5. Overall assessment and growth potential

Keep the summary concise but informative, around 200-300 words.
`;

    // Get the generative model - using gemini-pro as fallback if gemini-2.0-flash doesn't work
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    } catch (modelError) {
      console.log('Falling back to gemini-pro model');
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    // Generate the summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error generating startup summary:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('API_KEY') || error.message.includes('INVALID_ARGUMENT')) {
        return NextResponse.json(
          { error: 'Invalid or missing Gemini API key. Please check your API key configuration.' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('PERMISSION_DENIED')) {
        return NextResponse.json(
          { error: 'Permission denied. Please check your API key permissions.' },
          { status: 403 }
        );
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred while generating startup summary' },
      { status: 500 }
    );
  }
}