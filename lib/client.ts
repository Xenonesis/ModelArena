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
  const endpoint = args.model === 'gemini-2.5-pro' ? '/api/gemini-pro' : '/api/gemini';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: args.signal,
  });
  return res.json();
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
  return res.json();
}

export type ORStreamHandlers = {
  onToken: (chunk: string) => void;
  onMeta?: (meta: { provider?: string; usedKeyType?: 'user' | 'shared' | 'none' }) => void;
  onError?: (err: { error?: string; code?: number; provider?: string; usedKeyType?: 'user' | 'shared' | 'none' }) => void;
  onDone?: () => void;
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
      handlers.onError?.({ error: 'No stream body', code: res.status, provider: 'openrouter' });
      handlers.onDone?.();
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const pump = async (): Promise<void> => {
      const { value, done } = await reader.read();
      if (done) {
        handlers.onDone?.();
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
          handlers.onDone?.();
          return;
        }
        try {
          const json = JSON.parse(payload);
          if (typeof json?.delta === 'string' && json.delta) handlers.onToken(json.delta);
          if (json?.provider || json?.usedKeyType) handlers.onMeta?.(json);
          if (json?.error) handlers.onError?.({ error: json.error, code: json.code, provider: json.provider, usedKeyType: json.usedKeyType });
        } catch {
          // ignore individual event parse errors
        }
      }
      return pump();
    };
    await pump();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      handlers.onDone?.();
      return;
    }
    const e = err as Error | undefined;
    handlers.onError?.({ error: e?.message || 'Stream failed', provider: 'openrouter' });
    handlers.onDone?.();
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
  try {
    if (typeof window === 'undefined') {
      throw new Error('Puter.js is only available in browser environment');
    }

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 callPuter called with:', { model: args.model, messageCount: args.messages.length });
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

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Puter.js loaded successfully');
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

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Calling Puter.js AI with model: ${args.model || 'default'}`);
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
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Puter.js AI call failed:', puterError);
        
        if (puterError && typeof puterError === 'object') {
          console.log('🔍 DEBUG: Error object keys:', Object.keys(puterError));
          console.log('🔍 DEBUG: Error object JSON:', JSON.stringify(puterError, null, 2));
        }
      }
      
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
          console.log('🔄 Retrying with default model...');
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
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 DEBUG: Raw Puter.js response for model "${args.model || 'default'}":`, response);
      console.log(`🔍 DEBUG: Response type:`, typeof response);
      
      if (response && typeof response === 'object') {
        console.log(`🔍 DEBUG: Response keys:`, Object.keys(response));
        console.log(`🔍 DEBUG: Response JSON:`, JSON.stringify(response, null, 2));
      }
    }

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

    return {
      text: finalResponse,
      provider: 'puter',
      usedKeyType: 'none' as const
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Puter.js call failed';
    
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        error: 'Authentication required - Puter.js is running in anonymous mode',
        provider: 'puter',
        usedKeyType: 'none' as const
      };
    }
    
    if (errorMessage.includes('null or undefined')) {
      return {
        error: 'Puter.js API unavailable (authentication required)',
        provider: 'puter',
        usedKeyType: 'none' as const
      };
    }
    
    if (errorMessage.includes('unexpected type')) {
      return {
        error: 'Puter.js API returned invalid data format',
        provider: 'puter',
        usedKeyType: 'none' as const
      };
    }
    
    return {
      error: errorMessage,
      provider: 'puter',
      usedKeyType: 'none' as const
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

export async function testPuterModels(models: string[]): Promise<Record<string, { success: boolean; error?: string; response?: string }>> {
  console.log(`🧪 Starting systematic test of ${models.length} Puter.js models...`);
  
  const status = getPuterStatus();
  console.log('🔍 Puter.js Status:', status);
  
  if (!status.available || !status.hasAI) {
    console.error('❌ Puter.js not available or AI not accessible');
    return {};
  }
  
  const results: Record<string, { success: boolean; error?: string; response?: string }> = {};
  
  for (const model of models) {
    const modelLabel = model || 'default';
    console.log(`\n🔍 Testing model: "${model}" (${modelLabel})`);
    
    try {
      const testMessage = { role: 'user' as const, content: `Say "Hello from ${modelLabel}" and tell me what model you are.`, ts: Date.now() };
      const result = await callPuter({ model, messages: [testMessage] });
      
      if (result.text) {
        results[modelLabel] = { success: true, response: result.text.slice(0, 150) + '...' };
        console.log(`✅ ${modelLabel}: SUCCESS`);
        console.log(`   Response: ${result.text.slice(0, 100)}...`);
      } else if (result.error) {
        results[modelLabel] = { success: false, error: result.error };
        console.log(`❌ ${modelLabel}: ERROR - ${result.error}`);
      } else {
        results[modelLabel] = { success: false, error: 'Unknown response format' };
        console.log(`❌ ${modelLabel}: UNKNOWN FORMAT`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results[modelLabel] = { success: false, error: errorMsg };
      console.log(`❌ ${modelLabel}: EXCEPTION - ${errorMsg}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 Test Results Summary:');
  console.table(results);
  
  return results;
}

export async function testAllPuterModels(): Promise<{
  discovered: PuterDiscoveryResult;
  tested: Record<string, { success: boolean; error?: string; response?: string }>;
}> {
  console.log('\n🚀 Starting comprehensive Puter.js model discovery and testing...\n');
  
  const discovered = await discoverPuterModels();
  console.log('\n📊 Discovery Results:');
  console.log('Authentication Status:', discovered.authStatus);
  console.log('Models by Provider:', discovered.byProvider);
  console.log('All Models Count:', discovered.allModels.length);
  console.log('Providers:', discovered.providers);
  
  const modelsToTest = new Set<string>();
  
  Object.values(discovered.byProvider).forEach((models: string[]) => {
    if (Array.isArray(models)) {
      models.forEach((model: string) => modelsToTest.add(model));
    }
  });
  
  discovered.allModels.forEach((model: PuterModel) => {
    if (typeof model === 'string') {
      modelsToTest.add(model);
    } else if (model?.id) {
      modelsToTest.add(model.id);
    } else if (model?.name) {
      modelsToTest.add(model.name);
    }
  });
  
  const commonModels = [
    'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 
    'claude-3-haiku', 'gemini-pro', 'mixtral-8x7b', 'llama-2-70b', 'llama-3-8b',
    'default', '', 'gpt-4.1-nano', 'claude'
  ];
  
  commonModels.forEach(model => modelsToTest.add(model));
  
  const modelArray = Array.from(modelsToTest);
  console.log(`\n🧪 Testing ${modelArray.length} discovered models...`);
  console.log('Models to test:', modelArray);
  
  const tested = await testPuterModels(modelArray);
  
  return {
    discovered,
    tested
  };
}

// Enhanced test function for specific providers
export async function testSpecificProviders(): Promise<{
  working: string[];
  failed: string[];
  deepseek: string[];
  gemini: string[];
  grok: string[];
}> {
  console.log('\n🎯 Testing specific provider models: DeepSeek, Gemini, Xai/Grok...\n');
  
  const targetModels = [
    // DeepSeek models
    'deepseek', 'deepseek-r1', 'deepseek-chat', 'deepseek-coder', 'deepseek-v3', 
    'deepseek-r1-distill-llama-70b', 'deepseek-v2', 'deepseek-v2.5',
    
    // Gemini models via Puter.js
    'gemini', 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0', 
    'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-flash', 'gemini-ultra',
    
    // Xai/Grok models
    'grok', 'grok-beta', 'grok-2', 'grok-3', 'grok-mini', 'xai-grok', 
    'x-ai-grok', 'grok-1', 'grok-1.5', 'grok-vision',
    
    // Also test existing models to verify they still work
    '', 'gpt-4.1-nano', 'claude'
  ];
  
  const results = await testPuterModels(targetModels);
  
  // Categorize results
  const working = Object.entries(results)
    .filter(([, result]) => result.success)
    .map(([model]) => model);
    
  const failed = Object.entries(results)
    .filter(([, result]) => !result.success)
    .map(([model]) => model);
    
  const deepseek = working.filter(model => model.toLowerCase().includes('deepseek'));
  const gemini = working.filter(model => model.toLowerCase().includes('gemini'));
  const grok = working.filter(model => 
    model.toLowerCase().includes('grok') || 
    model.toLowerCase().includes('xai') || 
    model.toLowerCase().includes('x-ai')
  );
  
  console.log('\n🏷️ Results by Provider:');
  console.log(`🔬 DeepSeek Models (${deepseek.length}):`, deepseek);
  console.log(`💎 Gemini Models (${gemini.length}):`, gemini);
  console.log(`🤖 Grok/Xai Models (${grok.length}):`, grok);
  console.log(`✅ All Working (${working.length}):`, working);
  console.log(`❌ Failed (${failed.length}):`, failed);
  
  return {
    working,
    failed,
    deepseek,
    gemini,
    grok
  };
}

// ============================================================================
// BROWSER CONSOLE UTILITIES
// ============================================================================
if (typeof window !== 'undefined') {
  const globalWindow = window as typeof window & {
    testPuterModels: typeof testPuterModels;
    testAllPuterModels: typeof testAllPuterModels;
    testSpecificProviders: typeof testSpecificProviders;
    getPuterStatus: typeof getPuterStatus;
    puterStatus: typeof getPuterStatus;
    callPuter: typeof callPuter;
    puterAuth: typeof puterAuth;
    discoverPuterModels: typeof discoverPuterModels;
  };
  
  globalWindow.testPuterModels = testPuterModels;
  globalWindow.testAllPuterModels = testAllPuterModels;
  globalWindow.testSpecificProviders = testSpecificProviders;
  globalWindow.getPuterStatus = getPuterStatus;
  globalWindow.puterStatus = getPuterStatus;
  globalWindow.callPuter = callPuter;
  globalWindow.puterAuth = puterAuth;
  globalWindow.discoverPuterModels = discoverPuterModels;
  
  console.log('🧪 Enhanced Puter.js functions loaded:');
  console.log('   - getPuterStatus() - Check Puter.js availability and auth status');
  console.log('   - puterAuth.signIn() - Sign in with Puter.js popup');
  console.log('   - puterAuth.signOut() - Sign out from Puter.js');
  console.log('   - puterAuth.getAuthStatus() - Get current auth status');
  console.log('   - discoverPuterModels() - Discover all available models');
  console.log('   - testAllPuterModels() - Full discovery and testing');
  console.log('   - testSpecificProviders() - Test DeepSeek, Gemini, Grok models');
  console.log('   - testPuterModels([...models]) - Test specific models');
  console.log('   - callPuter({model, messages}) - Direct API call');
}