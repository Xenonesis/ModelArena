// Comprehensive Puter.js Model Discovery and Testing Script
// Run this in the browser console at http://localhost:3001

console.log('🚀 Starting Comprehensive Puter.js Model Discovery...\n');

// Test existing verified models first
const existingModels = ['', 'gpt-4.1-nano', 'claude'];

// Models to search for based on user request
const targetModels = [
  // DeepSeek models
  'deepseek', 'deepseek-r1', 'deepseek-chat', 'deepseek-coder', 'deepseek-v3', 'deepseek-r1-distill-llama-70b',
  
  // Gemini models via Puter.js
  'gemini', 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0', 'gemini-2.5-pro', 'gemini-2.5-flash',
  
  // Xai/Grok models
  'grok', 'grok-beta', 'grok-2', 'grok-3', 'grok-mini', 'xai-grok', 'x-ai-grok',
  
  // Additional popular models to test
  'gpt-4', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo',
  'claude-3', 'claude-3.5', 'claude-sonnet', 'claude-haiku', 'claude-opus',
  'llama', 'llama-3', 'llama-3.3', 'mixtral', 'mistral',
  'qwen', 'qwen-2.5', 'yi', 'yi-large'
];

async function testPuterModel(modelName) {
  const modelLabel = modelName || 'default';
  console.log(`🔍 Testing: "${modelLabel}"`);
  
  try {
    if (!window.puter?.ai?.chat) {
      throw new Error('Puter.js AI not available');
    }
    
    const testMessage = `Test message for ${modelLabel}: Please respond with just "Hello from [your model name]" to verify you're working.`;
    
    let response;
    if (!modelName || modelName === '') {
      response = await window.puter.ai.chat(testMessage);
    } else {
      response = await window.puter.ai.chat(testMessage, { model: modelName });
    }
    
    // Parse response like our callPuter function
    let finalResponse;
    if (typeof response === 'string') {
      finalResponse = response;
    } else if (response?.choices?.[0]?.message?.content) {
      finalResponse = response.choices[0].message.content;
    } else if (response?.message?.content) {
      if (typeof response.message.content === 'string') {
        finalResponse = response.message.content;
      } else if (Array.isArray(response.message.content)) {
        const textBlocks = response.message.content
          .filter(block => block.type === 'text' && block.text)
          .map(block => block.text);
        finalResponse = textBlocks.join('');
      }
    } else if (response?.text) {
      finalResponse = response.text;
    } else if (response?.content) {
      finalResponse = response.content;
    }
    
    if (finalResponse && finalResponse.trim()) {
      console.log(`✅ ${modelLabel}: SUCCESS`);
      console.log(`   Response: ${finalResponse.slice(0, 100)}...`);
      return { 
        model: modelName, 
        success: true, 
        response: finalResponse.slice(0, 200),
        fullResponse: response
      };
    } else {
      console.log(`❌ ${modelLabel}: No valid response`);
      console.log(`   Raw response:`, response);
      return { model: modelName, success: false, error: 'No valid response', rawResponse: response };
    }
  } catch (error) {
    console.log(`❌ ${modelLabel}: ERROR - ${error.message}`);
    return { model: modelName, success: false, error: error.message };
  }
}

async function discoverAllModels() {
  console.log('🔍 Phase 1: Testing existing verified models...\n');
  
  const results = [];
  
  // Test existing models first
  for (const model of existingModels) {
    const result = await testPuterModel(model);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between tests
  }
  
  console.log('\n📊 Existing Models Results:');
  console.table(results.map(r => ({
    Model: r.model || 'default',
    Status: r.success ? '✅ Working' : '❌ Failed',
    Error: r.error || '',
    Response: r.response ? r.response.slice(0, 50) + '...' : ''
  })));
  
  console.log('\n🔍 Phase 2: Testing target models (DeepSeek, Gemini, Grok)...\n');
  
  // Test target models
  for (const model of targetModels) {
    const result = await testPuterModel(model);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Shorter wait for bulk testing
    
    // Log immediately for new working models
    if (result.success) {
      console.log(`🎉 NEW WORKING MODEL FOUND: ${model}`);
    }
  }
  
  console.log('\n🎯 FINAL RESULTS SUMMARY:');
  
  const workingModels = results.filter(r => r.success);
  const failedModels = results.filter(r => !r.success);
  
  console.log(`✅ Working Models (${workingModels.length}):`);
  workingModels.forEach(model => {
    console.log(`   - "${model.model || 'default'}": ${model.response?.slice(0, 80)}...`);
  });
  
  console.log(`\n❌ Failed Models (${failedModels.length}):`);
  failedModels.forEach(model => {
    console.log(`   - "${model.model}": ${model.error}`);
  });
  
  // Group by provider type
  const deepseekModels = workingModels.filter(m => m.model?.toLowerCase().includes('deepseek'));
  const geminiModels = workingModels.filter(m => m.model?.toLowerCase().includes('gemini'));
  const grokModels = workingModels.filter(m => m.model?.toLowerCase().includes('grok') || m.model?.toLowerCase().includes('xai'));
  
  console.log('\n🏷️ Models by Provider:');
  if (deepseekModels.length > 0) {
    console.log(`🔬 DeepSeek Models (${deepseekModels.length}):`, deepseekModels.map(m => m.model));
  }
  if (geminiModels.length > 0) {
    console.log(`💎 Gemini Models (${geminiModels.length}):`, geminiModels.map(m => m.model));
  }
  if (grokModels.length > 0) {
    console.log(`🤖 Grok/Xai Models (${grokModels.length}):`, grokModels.map(m => m.model));
  }
  
  return {
    all: results,
    working: workingModels,
    failed: failedModels,
    deepseek: deepseekModels,
    gemini: geminiModels,
    grok: grokModels
  };
}

// Auto-run the discovery
console.log('📋 This script will test all current models and discover new ones...');
console.log('🎯 Looking specifically for: DeepSeek, Gemini, and Xai/Grok models via Puter.js');
console.log('⏱️  This will take approximately 2-3 minutes...\n');

// Start the discovery
window.puterModelDiscovery = discoverAllModels();

console.log('🚀 Discovery started! Run "await window.puterModelDiscovery" to get results when complete.');
console.log('📊 Or check the console output for real-time updates.');