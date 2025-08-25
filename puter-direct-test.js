// 🧪 DIRECT PUTER.JS MODEL TESTING SCRIPT
// Copy and paste this into browser console at localhost:3002

async function testPuterModelsDirectly() {
  console.log('🚀 Testing Puter.js Models Directly...');
  
  // Test models that were requested: DeepSeek, Gemini, Grok
  const modelsToTest = [
    'deepseek',
    'deepseek-chat', 
    'deepseek-coder',
    'gemini',
    'gemini-pro',
    'grok'
  ];
  
  const results = {
    working: [],
    failed: [],
    details: {}
  };
  
  console.log('⏳ Waiting for Puter.js to load...');
  
  // Wait for Puter.js
  const waitForPuter = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (window.puter && window.puter.ai) {
          resolve(window.puter);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };
  
  try {
    const puter = await waitForPuter();
    console.log('✅ Puter.js loaded successfully');
    
    // Test each model
    for (const model of modelsToTest) {
      console.log(`\n🔄 Testing ${model}...`);
      
      try {
        const startTime = Date.now();
        
        let response;
        if (model === 'deepseek' || model === 'deepseek-chat' || model === 'deepseek-coder') {
          // Test DeepSeek models
          response = await puter.ai.chat('Hello! Just respond with "OK" to test this model.', {
            model: model,
            stream: false
          });
        } else if (model === 'gemini' || model === 'gemini-pro') {
          // Test Gemini models
          response = await puter.ai.chat('Hello! Just respond with "OK" to test this model.', {
            model: model,
            stream: false
          });
        } else if (model === 'grok') {
          // Test Grok model
          response = await puter.ai.chat('Hello! Just respond with "OK" to test this model.', {
            model: model,
            stream: false
          });
        }
        
        const responseTime = Date.now() - startTime;
        
        if (response && (typeof response === 'string' || (response.choices && response.choices[0]))) {
          results.working.push(model);
          results.details[model] = { 
            status: 'SUCCESS', 
            responseTime: `${responseTime}ms`,
            response: typeof response === 'string' ? response.substring(0, 100) : JSON.stringify(response).substring(0, 100)
          };
          console.log(`✅ ${model} - WORKING (${responseTime}ms)`);
        } else {
          results.failed.push(model);
          results.details[model] = { 
            status: 'EMPTY_RESPONSE', 
            responseTime: `${responseTime}ms`,
            error: 'No valid response content' 
          };
          console.log(`❌ ${model} - Empty response`);
        }
        
      } catch (error) {
        results.failed.push(model);
        results.details[model] = { 
          status: 'ERROR', 
          error: error.message || error.toString()
        };
        console.log(`❌ ${model} - Error: ${error.message}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.log('❌ Failed to load Puter.js:', error.message);
    return { error: 'Puter.js loading failed' };
  }
  
  // Summary
  console.log('\n📊 PUTER.JS MODEL TEST RESULTS:');
  console.log('================================');
  console.log(`✅ Working models (${results.working.length}):`, results.working);
  console.log(`❌ Failed models (${results.failed.length}):`, results.failed);
  
  // Detailed results
  console.log('\n📝 Detailed Results:');
  for (const [model, details] of Object.entries(results.details)) {
    console.log(`${model}:`, details);
  }
  
  return results;
}

// Also test model discovery
async function discoverPuterModels() {
  console.log('\n🔍 Discovering Puter.js models...');
  
  try {
    if (!window.puter || !window.puter.ai) {
      throw new Error('Puter.js not available');
    }
    
    // Try to discover available models through system call
    const discoveryResult = await window.puter.kv.call('ai', 'models', 'list');
    console.log('📋 Discovery result:', discoveryResult);
    
    return discoveryResult;
  } catch (error) {
    console.log('❌ Discovery failed:', error.message);
    return null;
  }
}

console.log('💫 Puter.js Direct Model Testing Ready!');
console.log('Commands:');
console.log('- await testPuterModelsDirectly()  // Test DeepSeek, Gemini, Grok');
console.log('- await discoverPuterModels()      // Discover available models');

// Auto-run the test
testPuterModelsDirectly();