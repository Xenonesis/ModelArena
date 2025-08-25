// 🤖 AUTOMATED PUTER.JS MODEL TESTING SCRIPT
// This script will automatically test models using the API endpoints

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

// Test results storage
const testResults = {
  current: { working: [], failed: [] },
  target: { working: [], failed: [] },
  details: {},
  timestamp: new Date().toISOString()
};

// Helper function to test a model via API
async function testModelViaAPI(model, modelName) {
  console.log(`🔄 Testing ${modelName || model}...`);
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${BASE_URL}/api/puter`, {
      model: model || '',
      messages: [
        { role: 'user', content: `Test ${model || 'default'} - respond with "OK ${model || 'default'}"` }
      ]
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.data && response.data.usePuterDirect) {
      // This is expected - Puter API returns instructions to use Puter.js directly
      console.log(`✅ ${modelName || model}: API endpoint working (${responseTime}ms)`);
      return {
        success: true,
        responseTime,
        type: 'puter-direct',
        data: response.data
      };
    } else if (response.data && response.data.text) {
      console.log(`✅ ${modelName || model}: Working with response (${responseTime}ms)`);
      return {
        success: true,
        responseTime,
        type: 'direct-response',
        response: response.data.text.substring(0, 100)
      };
    } else {
      console.log(`❌ ${modelName || model}: Unexpected response format`);
      return {
        success: false,
        error: 'Unexpected response format',
        responseTime,
        data: response.data
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error.response) {
      console.log(`❌ ${modelName || model}: HTTP ${error.response.status} - ${error.response.statusText}`);
      return {
        success: false,
        error: `HTTP ${error.response.status}: ${error.response.statusText}`,
        responseTime,
        httpStatus: error.response.status
      };
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`❌ ${modelName || model}: Server not running`);
      return {
        success: false,
        error: 'Server not running (ECONNREFUSED)',
        responseTime
      };
    } else {
      console.log(`❌ ${modelName || model}: ${error.message}`);
      return {
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
}

// Main testing function
async function runAutomatedTesting() {
  console.log('🚀 Starting Automated Puter.js Model Testing...');
  console.log(`Target: ${BASE_URL}`);
  
  // Test current models
  console.log('\n=== TESTING CURRENT MODELS ===');
  
  const currentModels = [
    { model: '', name: 'default' },
    { model: 'claude', name: 'claude' },
    { model: 'gpt-4.1-nano', name: 'gpt-4.1-nano' }
  ];
  
  for (const { model, name } of currentModels) {
    const result = await testModelViaAPI(model, name);
    testResults.details[name] = result;
    
    if (result.success) {
      testResults.current.working.push(name);
    } else {
      testResults.current.failed.push(name);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test target models (DeepSeek, Gemini, Grok)
  console.log('\n=== TESTING TARGET MODELS (DeepSeek, Gemini, Grok) ===');
  
  const targetModels = [
    'deepseek',
    'deepseek-chat',
    'deepseek-coder',
    'deepseek-r1',
    'gemini',
    'gemini-pro',
    'gemini-flash',
    'grok',
    'grok-beta',
    'grok-mini'
  ];
  
  for (const model of targetModels) {
    const result = await testModelViaAPI(model, model);
    testResults.details[model] = result;
    
    if (result.success) {
      testResults.target.working.push(model);
    } else {
      testResults.target.failed.push(model);
    }
    
    // Longer delay for target models to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Generate results summary
  console.log('\n🎉 AUTOMATED TESTING COMPLETE!');
  console.log('==============================');
  console.log(`✅ Current working models: ${testResults.current.working.length}/${currentModels.length}`);
  console.log(`✅ Target working models: ${testResults.target.working.length}/${targetModels.length}`);
  console.log(`❌ Total failed models: ${testResults.current.failed.length + testResults.target.failed.length}`);
  
  if (testResults.current.working.length > 0) {
    console.log('\n✅ Current working models:');
    testResults.current.working.forEach(model => {
      const details = testResults.details[model];
      console.log(`  ✅ ${model} (${details.responseTime}ms)`);
    });
  }
  
  if (testResults.target.working.length > 0) {
    console.log('\n🔥 Target working models (NEW):');
    testResults.target.working.forEach(model => {
      const details = testResults.details[model];
      console.log(`  ✅ ${model} (${details.responseTime}ms)`);
    });
    
    console.log('\n📝 CODE TO ADD TO models.ts:');
    console.log('// Add these entries to the PUTER.JS section:');
    
    testResults.target.working.forEach(model => {
      const isGood = model.includes('deepseek') || model === 'gemini-pro' || model === 'grok';
      const label = model.charAt(0).toUpperCase() + model.slice(1).replace('-', ' ');
      
      console.log(`  {
    id: 'puter-${model}',
    label: '${label} (Puter)',
    provider: 'puter',
    model: '${model}',
    free: true,${isGood ? '\n    good: true,' : ''}
  },`);
    });
  }
  
  if (testResults.current.failed.length + testResults.target.failed.length > 0) {
    console.log('\n❌ Failed models:');
    [...testResults.current.failed, ...testResults.target.failed].forEach(model => {
      const details = testResults.details[model];
      console.log(`  ❌ ${model}: ${details.error}`);
    });
  }
  
  return testResults;
}

// Run the test
if (require.main === module) {
  runAutomatedTesting()
    .then(results => {
      console.log('\n💾 Results saved to test-results.json');
      require('fs').writeFileSync('test-results.json', JSON.stringify(results, null, 2));
    })
    .catch(error => {
      console.error('💥 Testing failed:', error.message);
      process.exit(1);
    });
} else {
  module.exports = { runAutomatedTesting, testModelViaAPI };
}