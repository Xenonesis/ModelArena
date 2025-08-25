import { ChatMessage } from './types';

// Puter.js type definitions
interface PuterUser {
  id: string;
  username: string;
  email?: string;
  [key: string]: unknown;
}

interface PuterModel {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  [key: string]: unknown;
}

interface PuterAuthStatus {
  isSignedIn: boolean;
  user: PuterUser | null;
  provider: string;
  error?: unknown;
}

interface PuterDiscoveryResult {
  byProvider: Record<string, string[]>;
  allModels: PuterModel[];
  providers: string[];
  authStatus: PuterAuthStatus;
  error?: unknown;
}

// Type assertion for window.puter to match official Puter.js API
interface WindowWithPuter extends Window {
  puter?: {
    ai: {
      chat: (message: string, options?: {
        model?: string;
        stream?: boolean;
        temperature?: number;
        max_tokens?: number;
      }) => Promise<unknown>;
      listModels: () => Promise<Record<string, string[]>>;
      listModelProviders: () => Promise<string[]>;
    };
    auth: {
      signIn: (options?: {
        success?: (user: PuterUser) => void;
        error?: (error: unknown) => void;
      }) => Promise<void>;
      signOut: () => Promise<void>;
      isSignedIn: () => boolean;
      getUser: () => Promise<PuterUser>;
      whoami: () => Promise<PuterUser>;
    };
    drivers: {
      call: (iface: string, service: string, method: string) => Promise<{ result?: PuterModel[] }>;
    };
    print?: (value: unknown) => void;
    ready?: Promise<void>;
    isReady?: boolean;
    version?: string;
  };
}

declare let window: WindowWithPuter;

// ============================================================================
// GEMINI API CLIENT
// ============================================================================
export async function callGemini(args: { 
  apiKey?: string; 
  model: string; 
  messages: ChatMessage[]; 
  imageDataUrl?: string; 
  signal?: AbortSignal 
}) {
  const startTime = Date.now();
  const endpoint = args.model === 'gemini-2.5-pro' ? '/api/gemini-pro' : '/api/gemini';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: args.signal,
  });
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  const result = await res.json();
  return {
    ...result,
    responseTime,
    startTime,
    endTime
  };
}

// ============================================================================
// OPENROUTER API CLIENT
// ============================================================================
export async function callOpenRouter(args: { 
  apiKey?: string; 
  model: string; 
  messages: ChatMessage[]; 
  imageDataUrl?: string; 
  signal?: AbortSignal 
}) {
  const startTime = Date.now();
  const res = await fetch('/api/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      ...args, 
      referer: typeof window !== 'undefined' ? window.location.origin : undefined, 
      title: 'AI Fiesta' 
    }),
    signal: args.signal,
  });
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  const result = await res.json();
  return {
    ...result,
    responseTime,
    startTime,
    endTime
  };
}

export type ORStreamHandlers = {
  onToken: (chunk: string) => void;
  onMeta?: (meta: { provider?: string; usedKeyType?: 'user' | 'shared' | 'none'; responseTime?: number; startTime?: number; endTime?: number }) => void;
  onError?: (err: { error?: string; code?: number; provider?: string; usedKeyType?: 'user' | 'shared' | 'none'; responseTime?: number; startTime?: number; endTime?: number }) => void;
  onDone?: (timing?: { responseTime: number; startTime: number; endTime: number }) => void;
};

export async function streamOpenRouter(
  args: { 
    apiKey?: string; 
    model: string; 
    messages: ChatMessage[]; 
    imageDataUrl?: string; 
    signal?: AbortSignal 
  }, 
  handlers: ORStreamHandlers
) {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/openrouter/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...args, 
        referer: typeof window !== 'undefined' ? window.location.origin : undefined, 
        title: 'AI Fiesta' 
      }),
      signal: args.signal,
    });
    if (!res.body) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      handlers.onError?.({ error: 'No stream body', code: res.status, provider: 'openrouter', responseTime, startTime, endTime });
      handlers.onDone?.({ responseTime, startTime, endTime });
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const pump = async (): Promise<void> => {
      const { value, done } = await reader.read();
      if (done) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        handlers.onDone?.({ responseTime, startTime, endTime });
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          handlers.onDone?.({ responseTime, startTime, endTime });
          return;
        }
        try {
          const json = JSON.parse(payload);
          if (typeof json?.delta === 'string' && json.delta) handlers.onToken(json.delta);
          if (json?.provider || json?.usedKeyType) {
            const currentTime = Date.now();
            const responseTime = currentTime - startTime;
            handlers.onMeta?.({ ...json, responseTime, startTime, endTime: currentTime });
          }
          if (json?.error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            handlers.onError?.({ error: json.error, code: json.code, provider: json.provider, usedKeyType: json.usedKeyType, responseTime, startTime, endTime });
          }
        } catch {
          // ignore individual event parse errors
        }
      }
      return pump();
    };
    await pump();
  } catch (err) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    if (err instanceof DOMException && err.name === 'AbortError') {
      handlers.onDone?.({ responseTime, startTime, endTime });
      return;
    }
    const e = err as Error | undefined;
    handlers.onError?.({ error: e?.message || 'Stream failed', provider: 'openrouter', responseTime, startTime, endTime });
    handlers.onDone?.({ responseTime, startTime, endTime });
  }
}

// ============================================================================
// PUTER.JS API CLIENT WITH AUTHENTICATION
// ============================================================================
async function waitForPuter(timeoutMs: number = 15000): Promise<WindowWithPuter['puter'] | null> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkPuter = () => {
      const puterOnWindow = window.puter;
      
      if (puterOnWindow && puterOnWindow.ai && typeof puterOnWindow.ai.chat === 'function') {
        resolve(puterOnWindow);
        return;
      }
      
      if (Date.now() - startTime > timeoutMs) {
        resolve(null);
        return;
      }
      
      setTimeout(checkPuter, 200);
    };
    
    checkPuter();
  });
}

// Function to call Puter.js AI directly in the browser
export async function callPuter(args: { model: string; messages: ChatMessage[]; signal?: AbortSignal }) {
  const startTime = Date.now();
  try {
    if (typeof window === 'undefined') {
      throw new Error('Puter.js is only available in browser environment');
    }



    // Check if Puter.js script is loaded
    if (typeof window.puter === 'undefined') {
      throw new Error('Puter.js script not loaded. Please refresh the page.');
    }

    // Wait for Puter.js to be ready with shorter timeout for better UX
    const puterObj = await waitForPuter(10000);
    
    if (!puterObj) {
      throw new Error('Puter.js not ready. Please refresh the page and try again.');
    }



    const lastUserMessage = args.messages
      .filter(msg => msg.role === 'user')
      .pop();

    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    if (!puterObj.ai || typeof puterObj.ai.chat !== 'function') {
      throw new Error('Puter.js AI functionality not available. Please check your internet connection.');
    }


    
    let response;
    
    // Handle different models
    try {
      if (args.model === 'gpt-4.1-nano' || !args.model || args.model === '') {
        // Default model
        response = await puterObj.ai.chat(lastUserMessage.content);
      } else {
        // Handle models with token limitations
        const modelOptions: { model: string; stream: boolean; max_tokens?: number } = {
          model: args.model,
          stream: false
        };
        
        // Models that need reduced token limits
        if (args.model.includes('gpt-5-chat-latest') || args.model.includes('chat-latest')) {
          modelOptions.max_tokens = 8000; // Reduced from default to avoid token limit error
        }
        
        // Specific model
        response = await puterObj.ai.chat(lastUserMessage.content, modelOptions);
      }
    } catch (puterError: unknown) {
      // Handle specific Puter.js errors
      let errorMessage = 'Unknown Puter.js error';
      
      if (puterError instanceof Error) {
        errorMessage = puterError.message;
      } else if (puterError && typeof puterError === 'object') {
        const errorObj = puterError as Record<string, unknown>;
        
        // Try to extract error message from various possible structures
        if ('message' in errorObj && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        } else if ('error' in errorObj && typeof errorObj.error === 'string') {
          errorMessage = errorObj.error;
        } else if ('error' in errorObj && errorObj.error && typeof errorObj.error === 'object') {
          const nestedError = errorObj.error as Record<string, unknown>;
          if ('message' in nestedError && typeof nestedError.message === 'string') {
            errorMessage = nestedError.message;
          } else if ('type' in nestedError && typeof nestedError.type === 'string') {
            errorMessage = `Error type: ${nestedError.type}`;
          }
        } else if ('type' in errorObj && typeof errorObj.type === 'string') {
          errorMessage = `Error type: ${errorObj.type}`;
        } else if ('code' in errorObj && typeof errorObj.code === 'number') {
          errorMessage = `Error code: ${errorObj.code}`;
        } else {
          errorMessage = `Puter.js error object with keys: ${Object.keys(errorObj).join(', ')}`;
        }
      } else if (typeof puterError === 'string') {
        errorMessage = puterError;
      }
      
      // Try with default model if specific model fails
      if (args.model && args.model !== 'gpt-4.1-nano') {
        if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Retrying with default model...');
        }
        }
        try {
          response = await puterObj.ai.chat(lastUserMessage.content);
        } catch (retryError: unknown) {
          const retryMessage = retryError instanceof Error ? retryError.message : String(retryError);
          throw new Error(`Model "${args.model}" failed: ${errorMessage}. Default model also failed: ${retryMessage}`);
        }
      } else {
        throw new Error(`Puter.js AI call failed: ${errorMessage}`);
      }
    }
    
    let finalResponse: string | undefined;
    


    if (typeof response === 'string') {
      finalResponse = response;
    } else if (response && typeof response === 'object') {
      const responseObj = response as Record<string, unknown>;
      
      // First, check if this is an error response
      if ('success' in responseObj && responseObj.success === false) {
        const errorObj = responseObj.error as Record<string, unknown>;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 DEBUG: Puter.js error response:', errorObj);
        }
        
        let errorMessage = 'Unknown Puter.js error';
        if (errorObj && typeof errorObj === 'object') {
          if ('message' in errorObj && typeof errorObj.message === 'string') {
            errorMessage = errorObj.message;
          } else if ('error' in errorObj && typeof errorObj.error === 'string') {
            errorMessage = errorObj.error;
          } else if ('type' in errorObj && typeof errorObj.type === 'string') {
            errorMessage = `Error type: ${errorObj.type}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Check if the entire response is an error object (common pattern)
      if ('error' in responseObj) {
        let errorMessage = 'Puter.js returned error';
        
        if (typeof responseObj.error === 'string') {
          errorMessage = responseObj.error;
        } else if (responseObj.error && typeof responseObj.error === 'object') {
          const errorObj = responseObj.error as Record<string, unknown>;
          if ('message' in errorObj && typeof errorObj.message === 'string') {
            errorMessage = errorObj.message;
          } else if ('type' in errorObj && typeof errorObj.type === 'string') {
            errorMessage = `Error type: ${errorObj.type}`;
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 DEBUG: Error in response object:', responseObj.error);
        }
        
        throw new Error(errorMessage);
      }
      
      // Check various success response patterns
      if ('choices' in responseObj && Array.isArray(responseObj.choices)) {
        const choices = responseObj.choices as Array<{ message?: { content?: string } }>;
        if (choices.length > 0 && choices[0].message?.content) {
          finalResponse = choices[0].message.content;
        } else {
          throw new Error(`Puter.js returned choices array but no valid content`);
        }
      } else if ('message' in responseObj && typeof responseObj.message === 'object') {
        const messageObj = responseObj.message as Record<string, unknown>;
        
        if ('content' in messageObj && typeof messageObj.content === 'string') {
          finalResponse = messageObj.content;
        } else if ('content' in messageObj && Array.isArray(messageObj.content)) {
          const contentArray = messageObj.content as Array<{ text?: string; type?: string }>;
          
          const textBlocks = contentArray
            .filter(block => block.type === 'text' && typeof block.text === 'string')
            .map(block => block.text);
          
          if (textBlocks.length > 0) {
            finalResponse = textBlocks.join('');
          } else {
            throw new Error(`Claude returned content array but no text blocks. Content: ${JSON.stringify(contentArray)}`);
          }
        } else {
          if ('text' in messageObj && typeof messageObj.text === 'string') {
            finalResponse = messageObj.text;
          } else if ('data' in messageObj && typeof messageObj.data === 'string') {
            finalResponse = messageObj.data;
          } else {
            // Handle Claude models that have nested message objects
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 DEBUG: Trying to extract from message object:', messageObj);
            }
            
            // Try toString() method for objects that might have it
            if (typeof messageObj.toString === 'function') {
              const toStringResult = messageObj.toString();
              if (toStringResult && toStringResult !== '[object Object]') {
                finalResponse = toStringResult;
              }
            }
            
            if (!finalResponse) {
              throw new Error(`Puter.js returned message object but no content. Available keys: ${Object.keys(messageObj).join(', ')}`);
            }
          }
        }
      } else if ('text' in responseObj && typeof responseObj.text === 'string') {
        finalResponse = responseObj.text;
      } else if ('content' in responseObj && typeof responseObj.content === 'string') {
        finalResponse = responseObj.content;
      } else if ('result' in responseObj && typeof responseObj.result === 'string') {
        finalResponse = responseObj.result;
      } else if ('response' in responseObj && typeof responseObj.response === 'string') {
        finalResponse = responseObj.response;
      } else if ('data' in responseObj && typeof responseObj.data === 'string') {
        finalResponse = responseObj.data;
      } else {
        const objectKeys = Object.keys(responseObj);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 DEBUG: Trying to extract text from object with keys:', objectKeys);
        }
        
        // Try common response formats
        const textCandidates = [
          responseObj.text,
          responseObj.content,
          responseObj.result,
          responseObj.response,
          responseObj.answer,
          responseObj.output,
          responseObj.data
        ];
        
        for (const candidate of textCandidates) {
          if (typeof candidate === 'string' && candidate.trim().length > 0) {
            finalResponse = candidate;
            break;
          }
        }
        
        // If no text found, try any string value in the object
        if (!finalResponse) {
          for (const [key, value] of Object.entries(responseObj)) {
            if (typeof value === 'string' && value.trim().length > 0 && value.length > 10) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`🔍 DEBUG: Using value from key "${key}":`, value.slice(0, 50) + '...');
              }
              finalResponse = value;
              break;
            }
          }
        }
        
        if (!finalResponse) {
          // Log the full object for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 DEBUG: Could not extract text. Full object:', JSON.stringify(responseObj, null, 2));
          }
          throw new Error(`Puter.js returned unhandled object format with keys: ${objectKeys.join(', ')}. Enable dev console for full response.`);
        }
      }
    } else if (response === null || response === undefined) {
      throw new Error('Puter.js AI chat returned null or undefined');
    } else {
      throw new Error(`Puter.js AI chat returned unexpected type: ${typeof response}`);
    }
    
    if (!finalResponse || finalResponse.trim() === '') {
      throw new Error('Puter.js AI chat returned empty response');
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      text: finalResponse,
      provider: 'puter',
      usedKeyType: 'none' as const,
      responseTime,
      startTime,
      endTime
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Puter.js call failed';
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        error: 'Authentication required - Puter.js is running in anonymous mode',
        provider: 'puter',
        usedKeyType: 'none' as const,
        responseTime,
        startTime,
        endTime
      };
    }
    
    if (errorMessage.includes('null or undefined')) {
      return {
        error: 'Puter.js API unavailable (authentication required)',
        provider: 'puter',
        usedKeyType: 'none' as const,
        responseTime,
        startTime,
        endTime
      };
    }
    
    if (errorMessage.includes('unexpected type')) {
      return {
        error: 'Puter.js API returned invalid data format',
        provider: 'puter',
        usedKeyType: 'none' as const,
        responseTime,
        startTime,
        endTime
      };
    }
    
    return {
      error: errorMessage,
      provider: 'puter',
      usedKeyType: 'none' as const,
      responseTime,
      startTime,
      endTime
    };
  }
}

// ============================================================================
// PUTER.JS AUTHENTICATION SYSTEM
// ============================================================================
export const puterAuth = {
  isSignedIn(): boolean {
    try {
      return window.puter?.auth?.isSignedIn() || false;
    } catch (error) {
      console.error('❌ Error checking sign in status:', error);
      return false;
    }
  },

  async getCurrentUser(): Promise<PuterUser | null> {
    try {
      if (!this.isSignedIn()) {
        return null;
      }
      
      const user = await window.puter?.auth?.getUser();
      console.log('👤 Current Puter User:', user);
      return user || null;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  },

  async signIn(): Promise<PuterUser> {
    try {
      console.log('🔐 Starting Puter.js sign in...');
      
      if (!window.puter?.auth?.signIn) {
        throw new Error('Puter.js auth API not available');
      }
      
      return new Promise((resolve, reject) => {
        window.puter!.auth!.signIn({
          success: (user: PuterUser) => {
            console.log('✅ Puter.js Sign In Success:', user);
            resolve(user);
          },
          error: (error: unknown) => {
            console.error('❌ Puter.js Sign In Error:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error during sign in:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      console.log('🔓 Signing out from Puter.js...');
      
      if (!window.puter?.auth?.signOut) {
        throw new Error('Puter.js auth API not available');
      }
      
      await window.puter.auth.signOut();
      console.log('✅ Successfully signed out from Puter.js');
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      throw error;
    }
  },

  async getAuthStatus(): Promise<PuterAuthStatus> {
    try {
      const isSignedIn = this.isSignedIn();
      const user = isSignedIn ? (await this.getCurrentUser()) || null : null;
      
      return {
        isSignedIn,
        user,
        provider: 'Puter.js'
      };
    } catch (error) {
      console.error('❌ Error getting auth status:', error);
      return {
        isSignedIn: false,
        user: null,
        provider: 'Puter.js',
        error
      };
    }
  }
};

// ============================================================================
// PUTER.JS MODEL DISCOVERY AND TESTING
// ============================================================================
export const discoverPuterModels = async (): Promise<PuterDiscoveryResult> => {
  try {
    console.log('🔍 Discovering all available Puter.js models...');
    
    let modelsByProvider: Record<string, string[]> = {};
    try {
      if (window.puter?.ai?.listModels) {
        modelsByProvider = await window.puter.ai.listModels();
        console.log('📋 Models by Provider:', modelsByProvider);
      } else {
        console.log('⚠️ listModels API not available');
      }
    } catch (error) {
      console.log('⚠️ listModels failed:', error);
    }

    let allModels: PuterModel[] = [];
    try {
      if (window.puter?.drivers?.call) {
        const modelsResponse = await window.puter.drivers.call('puter-chat-completion','ai-chat','models');
        allModels = (modelsResponse?.result) || [];
        console.log('📋 All Models from Driver:', allModels);
      } else {
        console.log('⚠️ driver call API not available');
      }
    } catch (error) {
      console.log('⚠️ Driver call failed:', error);
    }

    let providers: string[] = [];
    try {
      if (window.puter?.ai?.listModelProviders) {
        providers = await window.puter.ai.listModelProviders();
        console.log('🏢 Model Providers:', providers);
      } else {
        console.log('⚠️ listModelProviders API not available');
      }
    } catch (error) {
      console.log('⚠️ listModelProviders failed:', error);
    }

    const authStatus = await puterAuth.getAuthStatus();
    
    return {
      byProvider: modelsByProvider,
      allModels,
      providers,
      authStatus
    };
  } catch (error) {
    console.error('❌ Error discovering Puter models:', error);
    const authStatus = await puterAuth.getAuthStatus();
    return {
      byProvider: {},
      allModels: [],
      providers: [],
      authStatus,
      error
    };
  }
};

export function getPuterStatus(): { available: boolean; version?: string; hasAI: boolean; error?: string; authenticated?: boolean } {
  try {
    if (typeof window === 'undefined') {
      return { available: false, hasAI: false, error: 'Not in browser environment' };
    }
    
    const puterObj = window.puter;
    
    if (!puterObj) {
      return { available: false, hasAI: false, error: 'Puter.js not loaded' };
    }
    
    const hasAI = !!(puterObj.ai && typeof puterObj.ai.chat === 'function');
    const hasAuth = !!(puterObj.auth && typeof puterObj.auth.isSignedIn === 'function');
    const isAuthenticated = hasAuth ? puterObj.auth.isSignedIn() : false;
    
    return {
      available: true,
      version: puterObj.version || 'unknown',
      hasAI,
      authenticated: isAuthenticated,
      error: hasAI ? undefined : 'AI functionality not available'
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      available: false,
      hasAI: false,
      authenticated: false,
      error: errorMsg.includes('401') ? 'Anonymous mode (normal)' : errorMsg
    };
  }
}

