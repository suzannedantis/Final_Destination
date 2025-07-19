import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({
        status: 'error',
        message: 'Message is required'
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

    // Create a natural, conversational prompt for IPR support
    const systemPrompt = `
    You're an experienced IPR consultant who helps people with intellectual property matters. You've been working in this field for years and know the ins and outs of patents, trademarks, and copyrights.

    Write like you're talking to a colleague or client - be helpful, direct, and use everyday language. Don't sound robotic or overly formal. Share practical insights and real-world advice.

    Key areas you help with:
    • Patent applications and searches
    • Trademark registration
    • Copyright protection
    • Filing procedures and costs
    • Documentation and deadlines
    • Common problems and solutions

    Keep it conversational:
    - Use "you" and "your" naturally
    - Give specific, actionable advice
    - Share practical tips from experience
    - Mention when they should get a lawyer
    - Keep it focused on IP matters
    - If they ask about other stuff, just redirect back to IP topics

    Previous conversation:
    ${chatHistory && chatHistory.length > 0 ?
      chatHistory.map((msg: any) => `${msg.role === 'user' ? 'Them' : 'You'}: ${msg.content}`).join('\n') :
      'This is the start of your conversation'
    }

    They just asked: ${message}

    Give them a helpful, natural response:
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const botResponse = response.text().trim();

    return NextResponse.json({
      status: 'success',
      response: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('IPR Chat error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error during chat processing'
    }, { status: 500 });
  }
}