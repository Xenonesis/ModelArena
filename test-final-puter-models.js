// 🧪 FINAL PUTER.JS MODEL TESTING SCRIPT
// Run this in browser console at localhost:3002

async function testFinalPuterModels() {
  console.log('🚀 Testing Final Puter.js Model Selection...');
  
  // Models to test based on high probability of success
  const modelsToTest = [
    // DeepSeek models (highest probability)
    'deepseek',
    'deepseek-chat', 
    'deepseek-coder',
    
    // Gemini models (moderate probability)
    'gemini',
    'gemini-pro',
    
    // Grok models (lower probability but requested)
    'grok'
  ];
  
  const results = {
    working: [],
    failed: [],
    details: {}
  };
  
  // Test each model
  for (const model of modelsToTest) {
    console.log(`\n🔄 Testing ${model}...`);
    
    try {
      const response = await fetch('/api/puter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: 'user',
            content: 'Hello! Just testing if this model works. Please respond with just "OK" if you can see this.'
          }]
        })
      });
      
      if (response.ok) {
        const data = await response.text();
        if (data && data.trim()) {
          results.working.push(model);
          results.details[model] = { status: 'SUCCESS', response: data.substring(0, 100) };
          console.log(`✅ ${model} - WORKING`);
        } else {
          results.failed.push(model);
          results.details[model] = { status: 'EMPTY_RESPONSE', error: 'No response content' };
          console.log(`❌ ${model} - Empty response`);
        }
      } else {
        const errorText = await response.text();
        results.failed.push(model);
        results.details[model] = { status: 'HTTP_ERROR', error: errorText };
        console.log(`❌ ${model} - HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }
      
    } catch (error) {
      results.failed.push(model);
      results.details[model] = { status: 'NETWORK_ERROR', error: error.message };
      console.log(`❌ ${model} - Network error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 FINAL TEST RESULTS:');
  console.log('====================');
  console.log(`✅ Working models (${results.working.length}):`, results.working);
  console.log(`❌ Failed models (${results.failed.length}):`, results.failed);
  
  // Detailed results
  console.log('\n📝 Detailed Results:');
  for (const [model, details] of Object.entries(results.details)) {
    console.log(`${model}: ${details.status} - ${details.error || details.response || 'Success'}`);
  }
  
  return results;
}

// Also test model discovery to see what's actually available
async function discoverAvailablePuterModels() {
  console.log('\n🔍 Discovering available Puter.js models...');
  
  try {
    const response = await fetch('/api/puter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'discover_models'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📋 Available models:', data);
      return data;
    } else {
      console.log('❌ Failed to discover models:', await response.text());
    }
  } catch (error) {
    console.log('❌ Discovery error:', error.message);
  }
}

// Run tests
console.log('💫 Puter.js Final Model Testing Suite Ready!');
console.log('Commands:');
console.log('- await testFinalPuterModels()  // Test all selected models');
console.log('- await discoverAvailablePuterModels()  // See what models are available');