// Rate limiting utility for production
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: Request) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export function rateLimit(config: RateLimitConfig) {
  return async (request: Request): Promise<Response | null> => {
    const key = config.keyGenerator 
      ? config.keyGenerator(request)
      : getClientIP(request) || 'anonymous';
    
    const now = Date.now();
    
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
      return null; // Allow request
    }
    
    if (store[key].count >= config.maxRequests) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((store[key].resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, config.maxRequests - store[key].count).toString(),
            'X-RateLimit-Reset': store[key].resetTime.toString()
          }
        }
      );
    }
    
    store[key].count++;
    return null; // Allow request
  };
}

function getClientIP(request: Request): string | null {
  // Check various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }
  
  return null;
}

// Input validation utilities
export function validateChatRequest(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' };
  }
  
  const req = body as Record<string, unknown>;
  
  if (!req.messages || !Array.isArray(req.messages)) {
    return { valid: false, error: 'Messages array is required' };
  }
  
  if (req.messages.length === 0) {
    return { valid: false, error: 'At least one message is required' };
  }
  
  if (req.messages.length > 100) {
    return { valid: false, error: 'Too many messages (max 100)' };
  }
  
  // Validate each message
  for (const message of req.messages) {
    if (!message || typeof message !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    const msg = message as Record<string, unknown>;
    
    if (!msg.role || !msg.content) {
      return { valid: false, error: 'Each message must have role and content' };
    }
    
    if (!['user', 'assistant', 'system'].includes(msg.role as string)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    if (typeof msg.content !== 'string' || msg.content.length > 50000) {
      return { valid: false, error: 'Message content must be string under 50000 characters' };
    }
  }
  
  // Validate model if provided
  if (req.model && (typeof req.model !== 'string' || req.model.length > 100)) {
    return { valid: false, error: 'Invalid model parameter' };
  }
  
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 50000); // Limit length
}

// Error response helper
export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}