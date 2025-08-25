import { AiModel } from './types';

// Base catalog; user can toggle/select models
export const MODEL_CATALOG: AiModel[] = [
  {
    id: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    provider: 'gemini',
    model: 'gemini-2.5-pro',
    good: true,
  },
  {
    id: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'deepcoder-14b-preview',
    label: 'DeepCoder 14B Preview',
    provider: 'openrouter',
    model: 'agentica-org/deepcoder-14b-preview:free',
    free: true,
  },
  {
    id: 'deepseek-r1',
    label: 'DeepSeek R1 (free)',
    provider: 'openrouter',
    model: 'deepseek/deepseek-r1:free',
    free: true,
    good: true,
  },
  {
    id: 'deepseek-chat-v3-0324-free',
    label: 'DeepSeek Chat v3 0324 (free)',
    provider: 'openrouter',
    model: 'deepseek/deepseek-chat-v3-0324:free',
    free: true,
    good: true,
  },
  {
    id: 'llama-3.3-70b-instruct',
    label: 'Llama 3.3 70B Instruct (free)',
    provider: 'openrouter',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    free: true,
    good: true,
  },
  // Additional OpenRouter models requested
  {
    id: 'mistral-small-24b-instruct-2501',
    label: 'Mistral Small 24B Instruct 2501 (free)',
    provider: 'openrouter',
    model: 'mistralai/mistral-small-24b-instruct-2501:free',
    free: true,
  },
  {
    id: 'qwen-2.5-72b-instruct',
    label: 'Qwen 2.5 72B Instruct (free)',
    provider: 'openrouter',
    model: 'qwen/qwen-2.5-72b-instruct:free',
    free: true,
    good: true,
  },
  {
    id: 'moonshot-kimi-k2',
    label: 'Moonshot Kimi K2 (free)',
    provider: 'openrouter',
    model: 'moonshotai/kimi-k2:free',
    free: true,
  },
  {
    id: 'reka-flash-3',
    label: 'Reka Flash 3 (free)',
    provider: 'openrouter',
    model: 'reka/reka-flash-3:free',
    free: true,
  },
  {
    id: 'glm-4.5-air',
    label: 'GLM 4.5 Air (free)',
    provider: 'openrouter',
    model: 'z-ai/glm-4.5-air:free',
    free: true,
  },
  {
    id: 'glm-4.5-air-paid',
    label: 'GLM 4.5 Air (paid)',
    provider: 'openrouter',
    model: 'z-ai/glm-4.5-air',
  },
  {
    id: 'hunyuan-a13b-instruct',
    label: 'Tencent Hunyuan A13B Instruct (free)',
    provider: 'openrouter',
    model: 'tencent/hunyuan-a13b-instruct:free',
    free: true,
  },
  {
    id: 'gemma-3n-e2b-it',
    label: 'Google Gemma 3n e2B IT (free)',
    provider: 'openrouter',
    model: 'google/gemma-3n-e2b-it:free',
    free: true,
  },
  {
    id: 'gemma-3-27b-it',
    label: 'Google Gemma 3 27B IT (free)',
    provider: 'openrouter',
    model: 'google/gemma-3-27b-it:free',
    free: true,
  },
  {
    id: 'dolphin3-mistral-24b',
    label: 'Dolphin 3.0 Mistral 24B (free)',
    provider: 'openrouter',
    model: 'cognitivecomputations/dolphin3.0-mistral-24b:free',
    free: true,
  },
  {
    id: 'gemma-2-9b-it',
    label: 'Google Gemma 2 9B IT (free)',
    provider: 'openrouter',
    model: 'google/gemma-2-9b-it:free',
    free: true,
  },
  {
    id: 'shisa-v2-llama33-70b',
    label: 'Shisa v2 Llama 3.3 70B (free)',
    provider: 'openrouter',
    model: 'shisa-ai/shisa-v2-llama3.3-70b:free',
    free: true,
  },
  {
    id: 'deepseek-r1t-chimera',
    label: 'DeepSeek R1T Chimera (free)',
    provider: 'openrouter',
    model: 'tngtech/deepseek-r1t-chimera:free',
    free: true,
  },
  {
    id: 'microsoft-mai-ds-r1',
    label: 'Microsoft MAI DS-R1 (free)',
    provider: 'openrouter',
    model: 'microsoft/mai-ds-r1:free',
    free: true,
  },
  // Newly requested models
  {
    id: 'baidu-ernie-4.5-21b-a3b',
    label: 'Baidu ERNIE 4.5 21B A3B',
    provider: 'openrouter',
    model: 'baidu/ernie-4.5-21b-a3b',
  },
  {
    id: 'openai-gpt-oss-20b-free',
    label: 'OpenAI GPT-OSS 20B (free)',
    provider: 'openrouter',
    model: 'openai/gpt-oss-20b:free',
    free: true,
  },
  {
    id: 'xai-grok-3-mini',
    label: 'xAI Grok 3 Mini',
    provider: 'openrouter',
    model: 'x-ai/grok-3-mini',
  },
  
  // Puter.js Models - Free AI models accessible through Puter.js
  // 🚀 COMPLETE PUTER.JS MODEL CATALOG 🚀
  // All models available through Puter.js platform
  
  // 🤖 GPT MODELS
  {
    id: 'puter-gpt-4o-mini',
    label: 'GPT-4o Mini (ModelArena)',
    provider: 'puter',
    model: 'gpt-4o-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-4o',
    label: 'GPT-4o (ModelArena)',
    provider: 'puter',
    model: 'gpt-4o',
    free: true,
    good: true,
  },
  {
    id: 'puter-o1',
    label: 'o1 (ModelArena)',
    provider: 'puter',
    model: 'o1',
    free: true,
    good: true,
  },
  {
    id: 'puter-o1-mini',
    label: 'o1 Mini (ModelArena)',
    provider: 'puter',
    model: 'o1-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-o1-pro',
    label: 'o1 Pro (ModelArena) - Pro Access Required ⭐',
    provider: 'puter',
    model: 'o1-pro',
    free: false, // Requires pro access
    disabled: true,
    // Note: Requires Puter.js Pro/Premium subscription
  },
  {
    id: 'puter-o3',
    label: 'o3 (ModelArena)',
    provider: 'puter',
    model: 'o3',
    free: true,
    good: true,
  },
  {
    id: 'puter-o3-mini',
    label: 'o3 Mini (ModelArena)',
    provider: 'puter',
    model: 'o3-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-o4-mini',
    label: 'o4 Mini (ModelArena)',
    provider: 'puter',
    model: 'o4-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-5',
    label: 'GPT-5 (ModelArena)',
    provider: 'puter',
    model: 'gpt-5',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-5-mini',
    label: 'GPT-5 Mini (ModelArena)',
    provider: 'puter',
    model: 'gpt-5-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-5-nano',
    label: 'GPT-5 Nano (ModelArena)',
    provider: 'puter',
    model: 'gpt-5-nano',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-5-chat-latest',
    label: 'GPT-5 Chat Latest (ModelArena) - Limited',
    provider: 'puter',
    model: 'gpt-5-chat-latest',
    free: true,
    // Note: Has token limit issues
  },
  {
    id: 'puter-gpt-4.1',
    label: 'GPT-4.1 (ModelArena)',
    provider: 'puter',
    model: 'gpt-4.1',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-4.1-mini',
    label: 'GPT-4.1 Mini (ModelArena)',
    provider: 'puter',
    model: 'gpt-4.1-mini',
    free: true,
    good: true,
  },
  {
    id: 'puter-gpt-4.1-nano',
    label: 'GPT-4.1 Nano (ModelArena)',
    provider: 'puter',
    model: 'gpt-4.1-nano',
    free: true,
    good: true,
  },
  
  // 🎭 CLAUDE MODELS
  {
    id: 'puter-claude-sonnet-4',
    label: 'Claude Sonnet 4 (ModelArena)',
    provider: 'puter',
    model: 'claude-sonnet-4',
    free: true,
    good: true,
  },
  {
    id: 'puter-claude-opus-4',
    label: 'Claude Opus 4 (ModelArena)',
    provider: 'puter',
    model: 'claude-opus-4',
    free: true,
    good: true,
  },
  {
    id: 'puter-claude-3-7-sonnet',
    label: 'Claude 3.7 Sonnet (ModelArena)',
    provider: 'puter',
    model: 'claude-3-7-sonnet',
    free: true,
    good: true,
  },
  {
    id: 'puter-claude-3-5-sonnet',
    label: 'Claude 3.5 Sonnet (ModelArena)',
    provider: 'puter',
    model: 'claude-3-5-sonnet',
    free: true,
    good: true,
  },
  
  // 🔬 DEEPSEEK MODELS
  {
    id: 'puter-deepseek-chat',
    label: 'DeepSeek Chat (ModelArena)',
    provider: 'puter',
    model: 'deepseek-chat',
    free: true,
    good: true,
  },
  {
    id: 'puter-deepseek-reasoner',
    label: 'DeepSeek Reasoner (ModelArena)',
    provider: 'puter',
    model: 'deepseek-reasoner',
    free: true,
    good: true,
  },
  
  // 💎 GEMINI MODELS
  {
    id: 'puter-gemini-2.0-flash',
    label: 'Gemini 2.0 Flash (ModelArena)',
    provider: 'puter',
    model: 'gemini-2.0-flash',
    free: true,
    good: true,
  },
  {
    id: 'puter-gemini-1.5-flash',
    label: 'Gemini 1.5 Flash (ModelArena)',
    provider: 'puter',
    model: 'gemini-1.5-flash',
    free: true,
    good: true,
  },
  
  // 🦙 META LLAMA MODELS (Using simpler model names)
  {
    id: 'puter-llama-3.1-8b',
    label: 'Llama 3.1 8B (ModelArena)',
    provider: 'puter',
    model: 'llama-3.1-8b',
    free: true,
    good: true,
  },
  {
    id: 'puter-llama-3.1-70b',
    label: 'Llama 3.1 70B (ModelArena)',
    provider: 'puter',
    model: 'llama-3.1-70b',
    free: true,
    good: true,
  },
  {
    id: 'puter-llama-3.1-405b',
    label: 'Llama 3.1 405B (ModelArena)',
    provider: 'puter',
    model: 'llama-3.1-405b',
    free: true,
    good: true,
  },
  
  // 🌟 MISTRAL MODELS
  {
    id: 'puter-mistral-large-latest',
    label: 'Mistral Large Latest (ModelArena)',
    provider: 'puter',
    model: 'mistral-large-latest',
    free: true,
    good: true,
  },
  {
    id: 'puter-pixtral-large-latest',
    label: 'Pixtral Large Latest (ModelArena)',
    provider: 'puter',
    model: 'pixtral-large-latest',
    free: true,
    good: true,
  },
  {
    id: 'puter-codestral-latest',
    label: 'Codestral Latest (ModelArena)',
    provider: 'puter',
    model: 'codestral-latest',
    free: true,
    good: true,
  },
  
  // 🔷 GOOGLE GEMMA MODELS
  {
    id: 'puter-gemma-2-27b-it',
    label: 'Gemma 2 27B IT (ModelArena)',
    provider: 'puter',
    model: 'google/gemma-2-27b-it',
    free: true,
    good: true,
  },
  
  // 🤖 GROK MODELS
  {
    id: 'puter-grok-beta',
    label: 'Grok Beta (ModelArena)',
    provider: 'puter',
    model: 'grok-beta',
    free: true,
    good: true,
  },
  
  // 📝 DEFAULT MODEL (for fallback)
  {
    id: 'puter-default',
    label: 'Default Model (ModelArena)',
    provider: 'puter',
    model: '', // Empty model name uses default
    free: true,
    good: true,
  },
  
];
