// Quick debug script to test Puter.js models in browser console
// Paste this into browser console on the chat page

console.log('🔍 Starting Puter.js Debug Test...');

// Check if Puter is available
if (typeof puter === 'undefined') {
    console.error('❌ Puter.js not loaded');
} else {
    console.log('✅ Puter.js found:', puter);
    
    if (puter.ai) {
        console.log('✅ Puter AI available');
        
        // Test default model
        console.log('🚀 Testing default model...');
        puter.ai.chat('Hello, are you working?')
            .then(response => {
                console.log('✅ Default model works:', response);
                
                // Test DeepSeek
                console.log('🚀 Testing DeepSeek...');
                return puter.ai.chat('Hello from DeepSeek test', { model: 'deepseek' });
            })
            .then(response => {
                console.log('✅ DeepSeek works:', response);
                
                // Test Gemini
                console.log('🚀 Testing Gemini...');
                return puter.ai.chat('Hello from Gemini test', { model: 'gemini' });
            })
            .then(response => {
                console.log('✅ Gemini works:', response);
                
                // Test Grok
                console.log('🚀 Testing Grok...');
                return puter.ai.chat('Hello from Grok test', { model: 'grok' });
            })
            .then(response => {
                console.log('✅ Grok works:', response);
            })
            .catch(error => {
                console.error('❌ Test failed:', error);
            });
    } else {
        console.error('❌ Puter AI not available');
    }
}