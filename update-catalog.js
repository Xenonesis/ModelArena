// 🔧 MODEL CATALOG AUTO-UPDATER SCRIPT
// This script will automatically update the models.ts file based on test results

async function updateModelCatalog(testResults) {
  console.log('📝 Updating model catalog based on test results...');
  
  if (!testResults || !testResults.newModels) {
    console.log('❌ No test results provided');
    return;
  }

  const workingModels = testResults.newModels.working;
  console.log(`✅ Found ${workingModels.length} working models to add:`, workingModels);
  
  // Generate model entries for models.ts
  const modelEntries = [];
  
  workingModels.forEach(model => {
    let provider = 'unknown';
    let label = model;
    let good = false;
    
    // Categorize models
    if (model.includes('deepseek')) {
      provider = 'DeepSeek';
      label = model.replace('deepseek', 'DeepSeek').replace('-', ' ');
      good = true; // DeepSeek models are generally good
    } else if (model.includes('gemini')) {
      provider = 'Gemini';
      label = model.replace('gemini', 'Gemini').replace('-', ' ');
      good = model.includes('pro'); // Pro versions are typically better
    } else if (model.includes('grok')) {
      provider = 'Grok';
      label = model.replace('grok', 'Grok').replace('-', ' ');
      good = model === 'grok'; // Base Grok model is good
    } else if (model.includes('claude')) {
      provider = 'Claude';
      label = model.replace('claude', 'Claude').replace('-', ' ');
      good = true; // Claude models are generally good
    } else if (model.includes('gpt')) {
      provider = 'OpenAI';
      label = model.toUpperCase().replace('-', '.');
      good = model.includes('4'); // GPT-4 models are good
    }
    
    const modelEntry = {
      id: `puter-${model}`,
      label: `${label} (Puter)`,
      provider: 'puter',
      model: model,
      free: true,
      good: good
    };
    
    modelEntries.push(modelEntry);
  });
  
  console.log('📋 Generated model entries:');
  modelEntries.forEach(entry => {
    console.log(`  ${entry.id}: ${entry.label} (${entry.good ? 'good' : 'standard'})`);
  });
  
  // Generate the code to add to models.ts
  console.log('\n📄 Code to add to models.ts:');
  console.log('// Add these entries to the PUTER.JS section:');
  
  modelEntries.forEach(entry => {
    console.log(`  {
    id: '${entry.id}',
    label: '${entry.label}',
    provider: '${entry.provider}',
    model: '${entry.model}',
    free: ${entry.free},${entry.good ? '\n    good: true,' : ''}
  },`);
  });
  
  // Save results for copying
  window.newModelEntries = modelEntries;
  
  return modelEntries;
}

// Auto-run when test results are available
if (window.modelTestResults) {
  updateModelCatalog(window.modelTestResults);
} else {
  console.log('⏳ Waiting for test results...');
  
  // Check every 2 seconds for test results
  const checkForResults = setInterval(() => {
    if (window.modelTestResults) {
      updateModelCatalog(window.modelTestResults);
      clearInterval(checkForResults);
    }
  }, 2000);
}

// Make function available globally
window.updateModelCatalog = updateModelCatalog;