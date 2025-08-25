// 🎯 COMPLETE PUTER.JS MODEL AUTOMATION SUITE
// This script will test all models, handle auth, and provide update instructions

console.log('🚀 PUTER.JS MODEL AUTOMATION SUITE STARTING...');
console.log('This script will:');
console.log('1. Handle authentication automatically');
console.log('2. Test all current Puter.js models');
console.log('3. Test DeepSeek, Gemini, and Grok models');
console.log('4. Generate updated model catalog');
console.log('5. Provide instructions for updating models.ts');

// Copy this entire script and paste it into browser console at localhost:3002

(async function runFullModelAutomation() {
  const results = {
    phase: 'starting',
    authentication: { status: 'unknown', errors: [], attempts: [] },
    currentModels: { working: [], failed: [], details: {} },
    targetModels: { working: [], failed: [], details: {} },
    catalog: { newEntries: [], updateInstructions: '' }
  };

  try {
    console.log('\n🔐 PHASE 1: AUTHENTICATION HANDLING');
    console.log('==================================');
    
    results.phase = 'authentication';
    
    // Check if Puter.js is available
    if (typeof window.puter === 'undefined') {
      throw new Error('Puter.js not loaded. Please refresh the page and try again.');
    }
    
    // Check auth status
    try {
      const response = await fetch('https://api.puter.com/whoami');
      if (response.ok) {
        console.log('✅ Already authenticated with Puter.js');
        results.authentication.status = 'authenticated';
      } else {
        console.log('🔑 Not authenticated, attempting sign-in...');
        results.authentication.status = 'unauthenticated';
      }
    } catch (error) {
      console.log('⚠️ Auth check failed:', error.message);
      results.authentication.errors.push(error.message);
    }

    // Attempt authentication if needed
    if (results.authentication.status === 'unauthenticated') {
      try {
        console.log('🔓 Opening Puter.js sign-in...');
        if (typeof puterAuth !== 'undefined' && puterAuth.signIn) {
          await puterAuth.signIn();
          results.authentication.attempts.push('signIn() called successfully');
          console.log('✅ Sign-in completed. Testing authentication...');
          
          // Verify authentication worked
          const authTest = await fetch('https://api.puter.com/whoami');
          results.authentication.status = authTest.ok ? 'authenticated' : 'failed';
        } else {
          console.log('⚠️ puterAuth.signIn not available, continuing with anonymous access');
          results.authentication.status = 'anonymous';
        }
      } catch (error) {
        console.log('❌ Authentication failed:', error.message);
        results.authentication.errors.push(error.message);
        results.authentication.status = 'failed';
      }
    }

    console.log('\n🧪 PHASE 2: TESTING CURRENT MODELS');
    console.log('================================');
    
    results.phase = 'testing-current';
    
    // Test current known working models
    const currentModels = [
      { model: '', name: 'default' },
      { model: 'claude', name: 'claude' },
      { model: 'gpt-4.1-nano', name: 'gpt-4.1-nano' }
    ];
    
    for (const { model, name } of currentModels) {
      console.log(`\n🔄 Testing current model: ${name}...`);
      
      try {
        const startTime = Date.now();
        
        if (typeof callPuter !== 'undefined') {
          const testResult = await callPuter({
            model: model,
            messages: [{ role: 'user', content: 'Test - respond with just "OK"' }]
          });
          
          const responseTime = Date.now() - startTime;
          
          if (testResult.error) {
            console.log(`❌ ${name}: ${testResult.error}`);
            results.currentModels.failed.push(name);
            results.currentModels.details[name] = { error: testResult.error, responseTime };
          } else {
            console.log(`✅ ${name}: Working (${responseTime}ms)`);
            results.currentModels.working.push(name);
            results.currentModels.details[name] = { 
              success: true, 
              responseTime,
              response: testResult.text?.substring(0, 50) + '...'
            };
          }
        } else {
          throw new Error('callPuter function not available');
        }
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        results.currentModels.failed.push(name);
        results.currentModels.details[name] = { error: error.message };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎯 PHASE 3: TESTING TARGET MODELS');
    console.log('===============================');
    
    results.phase = 'testing-targets';
    
    // Test the specifically requested models
    const targetModels = [
      // DeepSeek models (primary request)
      'deepseek', 'deepseek-chat', 'deepseek-coder', 
      // Gemini models (primary request)
      'gemini', 'gemini-pro',
      // Grok models (primary request)
      'grok',
      // Additional high-probability models
      'claude-3', 'gpt-4', 'gpt-3.5-turbo'
    ];
    
    console.log(`🎯 Testing ${targetModels.length} target models...`);
    
    for (const model of targetModels) {
      console.log(`\n🔄 Testing target model: ${model}...`);
      
      try {
        const startTime = Date.now();
        
        if (typeof callPuter !== 'undefined') {
          const testResult = await callPuter({
            model: model,
            messages: [{ role: 'user', content: `Test ${model} - respond with "OK ${model}"` }]
          });
          
          const responseTime = Date.now() - startTime;
          
          if (testResult.error) {
            console.log(`❌ ${model}: ${testResult.error}`);
            results.targetModels.failed.push(model);
            results.targetModels.details[model] = { error: testResult.error, responseTime };
          } else {
            console.log(`✅ ${model}: Working (${responseTime}ms) - "${testResult.text?.substring(0, 30)}..."`);
            results.targetModels.working.push(model);
            results.targetModels.details[model] = { 
              success: true, 
              responseTime,
              response: testResult.text?.substring(0, 100)
            };
          }
        } else {
          throw new Error('callPuter function not available');
        }
      } catch (error) {
        console.log(`❌ ${model}: ${error.message}`);
        results.targetModels.failed.push(model);
        results.targetModels.details[model] = { error: error.message };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log('\n📝 PHASE 4: GENERATING MODEL CATALOG');
    console.log('=================================');
    
    results.phase = 'generating-catalog';
    
    // Generate new model entries
    const workingModels = results.targetModels.working;
    
    if (workingModels.length > 0) {
      console.log(`✅ Found ${workingModels.length} new working models!`);
      
      workingModels.forEach(model => {
        let label = model;
        let good = false;
        
        // Generate proper labels and mark good models
        if (model.includes('deepseek')) {
          label = model.replace('deepseek', 'DeepSeek').replace('-', ' ');
          good = true;
        } else if (model.includes('gemini')) {
          label = model.replace('gemini', 'Gemini').replace('-', ' ');
          good = model.includes('pro');
        } else if (model.includes('grok')) {
          label = model.replace('grok', 'Grok').replace('-', ' ');
          good = true;
        } else if (model.includes('claude')) {
          label = model.replace('claude', 'Claude').replace('-', ' ');
          good = true;
        } else if (model.includes('gpt')) {
          label = model.toUpperCase().replace('-', '.');
          good = model.includes('4');
        }
        
        const entry = {
          id: `puter-${model}`,
          label: `${label} (Puter)`,
          provider: 'puter',
          model: model,
          free: true,
          good: good
        };
        
        results.catalog.newEntries.push(entry);
      });
      
      // Generate update instructions
      let updateCode = '\n// 🆕 ADD THESE NEW WORKING MODELS TO lib/models.ts:\n';
      updateCode += '// Add to the PUTER.JS section of the models array:\n\n';
      
      results.catalog.newEntries.forEach(entry => {
        updateCode += `  {\n`;
        updateCode += `    id: '${entry.id}',\n`;
        updateCode += `    label: '${entry.label}',\n`;
        updateCode += `    provider: '${entry.provider}',\n`;
        updateCode += `    model: '${entry.model}',\n`;
        updateCode += `    free: ${entry.free},\n`;
        if (entry.good) {
          updateCode += `    good: true,\n`;
        }
        updateCode += `  },\n`;
      });
      
      results.catalog.updateInstructions = updateCode;
    } else {
      console.log('❌ No new working models found');
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message);
    results.error = error.message;
  }

  console.log('\n🎉 FINAL RESULTS SUMMARY');
  console.log('=======================');
  console.log(`🔐 Authentication: ${results.authentication.status}`);
  console.log(`📊 Current models working: ${results.currentModels.working.length}/${results.currentModels.working.length + results.currentModels.failed.length}`);
  console.log(`🎯 Target models working: ${results.targetModels.working.length}/${results.targetModels.working.length + results.targetModels.failed.length}`);
  console.log(`📝 New catalog entries: ${results.catalog.newEntries.length}`);
  
  if (results.targetModels.working.length > 0) {
    console.log('\n🔥 NEW WORKING MODELS FOUND:');
    results.targetModels.working.forEach(model => {
      const details = results.targetModels.details[model];
      console.log(`  ✅ ${model} (${details.responseTime}ms)`);
    });
    
    console.log(results.catalog.updateInstructions);
  }
  
  if (results.targetModels.failed.length > 0) {
    console.log('\n❌ FAILED MODELS:');
    results.targetModels.failed.forEach(model => {
      const details = results.targetModels.details[model];
      console.log(`  ❌ ${model}: ${details.error}`);
    });
  }
  
  console.log('\n💾 Full results saved to window.fullModelResults');
  window.fullModelResults = results;
  
  return results;
})();