// 🚀 COMPREHENSIVE MODEL TESTING AUTOMATION SCRIPT
// This script will test ALL Puter.js models and handle authentication automatically

console.log('🎯 Starting Comprehensive Model Testing...');

// Main test automation function
async function runCompleteModelTesting() {
  const results = {
    currentModels: { working: [], failed: [] },
    newModels: { working: [], failed: [] },
    authentication: { status: 'unknown', errors: [] },
    summary: {}
  };

  console.log('\n=== PHASE 1: AUTHENTICATION CHECK ===');
  
  // Step 1: Check current authentication status
  try {
    if (typeof puterAuth !== 'undefined') {
      const authStatus = await puterAuth.getAuthStatus();
      console.log('🔍 Current auth status:', authStatus);
      results.authentication.status = authStatus.authenticated ? 'authenticated' : 'unauthenticated';
    } else {
      console.log('❌ puterAuth functions not available');
      results.authentication.status = 'unavailable';
    }
  } catch (error) {
    console.log('⚠️ Auth check failed:', error.message);
    results.authentication.errors.push(error.message);
  }

  // Step 2: Attempt authentication if needed
  if (results.authentication.status === 'unauthenticated') {
    console.log('🔑 Attempting authentication...');
    try {
      await puterAuth.signIn();
      console.log('✅ Authentication completed');
      results.authentication.status = 'authenticated';
    } catch (error) {
      console.log('⚠️ Authentication failed:', error.message);
      results.authentication.errors.push(error.message);
    }
  }

  console.log('\n=== PHASE 2: CURRENT MODEL VERIFICATION ===');
  
  // Step 3: Test current working models
  const currentModels = ['claude', 'gpt-4.1-nano', ''];  // Empty string for default
  
  for (const model of currentModels) {
    console.log(`\n🔄 Testing current model: ${model || 'default'}...`);
    
    try {
      const testResult = await callPuter({
        model: model,
        messages: [{ role: 'user', content: 'Test message - just respond with "OK"' }]
      });
      
      if (testResult.error) {
        console.log(`❌ ${model || 'default'}: ${testResult.error}`);
        results.currentModels.failed.push({ model: model || 'default', error: testResult.error });
      } else {
        console.log(`✅ ${model || 'default'}: Working`);
        results.currentModels.working.push(model || 'default');
      }
    } catch (error) {
      console.log(`❌ ${model || 'default'}: ${error.message}`);
      results.currentModels.failed.push({ model: model || 'default', error: error.message });
    }
    
    // Delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n=== PHASE 3: NEW MODEL DISCOVERY ===');
  
  // Step 4: Test requested new models (DeepSeek, Gemini, Grok)
  const targetModels = [
    // DeepSeek variants
    'deepseek', 'deepseek-chat', 'deepseek-coder', 'deepseek-r1',
    // Gemini variants  
    'gemini', 'gemini-pro', 'gemini-flash', 'gemini-1.5-pro',
    // Grok variants
    'grok', 'grok-beta', 'grok-2', 'grok-mini',
    // Additional common models
    'claude-3', 'gpt-4', 'gpt-3.5-turbo'
  ];
  
  console.log(`🎯 Testing ${targetModels.length} target models...`);
  
  for (const model of targetModels) {
    console.log(`\n🔄 Testing new model: ${model}...`);
    
    try {
      const testResult = await callPuter({
        model: model,
        messages: [{ role: 'user', content: 'Hello! Just respond with "OK" to confirm this model works.' }]
      });
      
      if (testResult.error) {
        console.log(`❌ ${model}: ${testResult.error}`);
        results.newModels.failed.push({ model, error: testResult.error });
      } else {
        console.log(`✅ ${model}: Working - Response: ${testResult.text?.substring(0, 50)}...`);
        results.newModels.working.push(model);
      }
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}`);
      results.newModels.failed.push({ model, error: error.message });
    }
    
    // Delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('\n=== PHASE 4: MODEL DISCOVERY ===');
  
  // Step 5: Try to discover available models
  try {
    if (typeof discoverPuterModels !== 'undefined') {
      console.log('🔍 Attempting model discovery...');
      const discoveredModels = await discoverPuterModels();
      console.log('📋 Discovered models:', discoveredModels);
      results.discoveredModels = discoveredModels;
    }
  } catch (error) {
    console.log('⚠️ Model discovery failed:', error.message);
  }

  // Step 6: Generate summary
  results.summary = {
    currentWorkingModels: results.currentModels.working.length,
    currentFailedModels: results.currentModels.failed.length,
    newWorkingModels: results.newModels.working.length,
    newFailedModels: results.newModels.failed.length,
    authenticationStatus: results.authentication.status
  };

  console.log('\n=== 📊 FINAL RESULTS SUMMARY ===');
  console.log('================================');
  console.log(`🔐 Authentication: ${results.authentication.status}`);
  console.log(`✅ Current working models: ${results.currentModels.working.length}`);
  console.log(`❌ Current failed models: ${results.currentModels.failed.length}`);
  console.log(`🆕 New working models: ${results.newModels.working.length}`);
  console.log(`🚫 New failed models: ${results.newModels.failed.length}`);
  
  console.log('\n🎯 Working Models Found:');
  console.log('Current:', results.currentModels.working);
  console.log('New:', results.newModels.working);
  
  if (results.newModels.working.length > 0) {
    console.log('\n🔥 SUCCESS! Found new working models:');
    results.newModels.working.forEach(model => {
      console.log(`  ✅ ${model}`);
    });
  }
  
  console.log('\n📝 Detailed Results Object:');
  console.log(results);
  
  return results;
}

// Auto-run the comprehensive test
console.log('💫 Comprehensive Model Testing Script Loaded!');
console.log('🚀 Starting automated testing in 3 seconds...');

setTimeout(() => {
  runCompleteModelTesting()
    .then(results => {
      console.log('\n🎉 Testing Complete! Results saved to window.modelTestResults');
      window.modelTestResults = results;
    })
    .catch(error => {
      console.error('💥 Testing failed:', error);
    });
}, 3000);

// Also make functions available for manual testing
window.runCompleteModelTesting = runCompleteModelTesting;