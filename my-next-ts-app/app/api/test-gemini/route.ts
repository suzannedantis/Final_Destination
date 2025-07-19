import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyB6g9OleRTdwB-vLXiFhvD7ESGarPBvqkQ') {
      return NextResponse.json({
        status: 'error',
        message: 'Gemini API key is not configured. Please add your API key to .env.local',
        apiKeyExists: false
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Test with a simple prompt
    const result = await model.generateContent('Say "Hello, Gemini API is working!"');
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      status: 'success',
      message: 'Gemini API is working correctly',
      apiKeyExists: true,
      testResponse: text
    });

  } catch (error) {
    console.error('Gemini API test error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({
        status: 'error',
        message: `Gemini API test failed: ${error.message}`,
        apiKeyExists: true,
        error: error.message
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Unknown error during Gemini API test',
      apiKeyExists: true
    });
  }
}