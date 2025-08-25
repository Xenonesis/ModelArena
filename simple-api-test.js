// 🧪 SIMPLE MODEL TESTING WITH FETCH
// This will test the Puter.js models using fetch

async function testPuterModelsDirectly() {
  console.log('🚀 Testing Puter.js Models via API...');
  
  const results = {
    current: { working: [], failed: [] },
    target: { working: [], failed: [] },
    details: {}
  };

  // Helper function to test a model
  async function testModel(model, name) {
    console.log(`🔄 Testing ${name || model}...`);
    
    try {
      const response = await fetch('http://localhost:3002/api/puter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || '',
          messages: [{ 
            role: 'user', 
            content: `Test ${model || 'default'} - respond with OK` 
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${name || model}: API responded successfully`);
        return {
          success: true,
          status: response.status,
          data: data
        };
      } else {
        const errorText = await response.text();
        console.log(`❌ ${name || model}: HTTP ${response.status}`);
        return {
          success: false,
          status: response.status,
          error: errorText
        };
      }
    } catch (error) {
      console.log(`❌ ${name || model}: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test current models
  console.log('\n=== TESTING CURRENT MODELS ===');
  const currentModels = [
    { model: '', name: 'default' },
    { model: 'claude', name: 'claude' },
    { model: 'gpt-4.1-nano', name: 'gpt-4.1-nano' }
  ];

  for (const { model, name } of currentModels) {
    const result = await testModel(model, name);
    results.details[name] = result;
    
    if (result.success) {
      results.current.working.push(name);
    } else {
      results.current.failed.push(name);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test target models
  console.log('\n=== TESTING TARGET MODELS ===');
  const targetModels = ['deepseek', 'deepseek-chat', 'deepseek-coder', 'gemini', 'gemini-pro', 'grok'];

  for (const model of targetModels) {
    const result = await testModel(model, model);
    results.details[model] = result;
    
    if (result.success) {
      results.target.working.push(model);
    } else {
      results.target.failed.push(model);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Results summary
  console.log('\n🎉 TESTING RESULTS:');
  console.log(`✅ Current working: ${results.current.working.length}`);
  console.log(`✅ Target working: ${results.target.working.length}`);
  console.log('Working models:', results.target.working);

  return results;
}

// Run the test
testPuterModelsDirectly();