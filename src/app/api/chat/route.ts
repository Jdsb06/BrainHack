import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'REPLACE_WITH_YOUR_ACTUAL_GEMINI_API_KEY') {
      console.error('GEMINI_API_KEY is not set or is using the placeholder value');
      return NextResponse.json(
        { error: 'API key not configured. Please set a valid GEMINI_API_KEY in your .env.local file. Get your API key from https://makersuite.google.com/app/apikey' },
        { status: 500 }
      );
    }

    // Log the first few characters of the API key for debugging (don't log the full key for security)
    console.log('Using Gemini API key starting with:', process.env.GEMINI_API_KEY.substring(0, 5) + '...');

    const { message } = await request.json();
    console.log('Received message:', message);

    // Initialize the model - using the correct model name
    // The model name should be 'gemini-1.5-pro' or 'gemini-1.0-pro' depending on your API access
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    console.log('Model initialized');

    // Set up the chat
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{text: 'You are BrainHack AI, a helpful assistant for productivity and mental wellness. Keep your responses focused on helping users improve their productivity, manage time better, and maintain good mental health practices.'}],
        },
        {
          role: 'model',
          parts: [{text: 'I understand my role as BrainHack AI. I will focus on providing helpful advice for productivity, time management, and mental wellness. I will keep my responses practical and actionable.'}],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    console.log('Chat initialized');

    // Get the response
    console.log('Sending message to Gemini API...');
    const result = await chat.sendMessage(message);
    console.log('Received response from Gemini API');
    const response = await result.response;
    const reply = response.text();
    console.log('Extracted reply text');

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to get response from AI';
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      console.error('Detailed error:', error.stack);
      
      // Check for specific error types
      if (errorMessage.includes('API key not valid')) {
        errorMessage = 'Invalid API key. Please check your GEMINI_API_KEY in the .env.local file.';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
      } else if (errorMessage.includes('models/gemini-pro is not found')) {
        errorMessage = 'The Gemini model name is incorrect. Please update the model name in the API route.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 