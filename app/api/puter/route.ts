import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/lib/types';
import { rateLimit, validateChatRequest, createErrorResponse, sanitizeInput } from '@/lib/apiSecurity';

// Configure rate limiting: 50 requests per 15 minutes per IP
const rateLimiter = rateLimit({
  maxRequests: 50,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiter(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate request structure
    const validation = validateChatRequest(body);
    if (!validation.valid) {
      return createErrorResponse(validation.error!, 400);
    }

    const { messages, model: requestedModel } = body;
    
    // Sanitize inputs
    const sanitizedMessages = messages.map((msg: ChatMessage) => ({
      ...msg,
      content: sanitizeInput(msg.content)
    }));

    // Get the last user message for Puter.js chat
    const lastUserMessage = sanitizedMessages
      .filter((msg: ChatMessage) => msg.role === 'user')
      .pop();

    if (!lastUserMessage) {
      return createErrorResponse('No user message found', 400);
    }

    // Validate model parameter
    let sanitizedModel = requestedModel;
    if (requestedModel) {
      if (typeof requestedModel !== 'string' || requestedModel.length > 100) {
        return createErrorResponse('Invalid model parameter', 400);
      }
      sanitizedModel = sanitizeInput(requestedModel);
    }

    // Since Puter.js runs in the browser, we'll return a special response
    // that tells the frontend to use Puter.js directly
    return NextResponse.json({
      usePuterDirect: true,
      message: lastUserMessage.content,
      model: sanitizedModel,
      provider: 'puter',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Puter API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        provider: 'puter',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}