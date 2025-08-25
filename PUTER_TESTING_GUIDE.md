# 🧪 Puter.js Model Testing Guide

## Quick Testing Instructions

### Step 1: Open Application
1. Go to http://localhost:3001
2. Open browser console (F12 → Console tab)

### Step 2: Test Specific Providers
Run this command to test all DeepSeek, Gemini, and Grok models:

```javascript
await testSpecificProviders()
```

### Step 3: Test All Models (Comprehensive)
For complete discovery:

```javascript
await testAllPuterModels()
```

### Step 4: Test Individual Models
To test a specific model:

```javascript
await callPuter({model: 'deepseek', messages: [{role: 'user', content: 'Hello!', ts: Date.now()}]})
```

## Expected Model Testing Results

### 🔬 DeepSeek Models
These models should be tested:
- `deepseek` - Base DeepSeek model
- `deepseek-chat` - DeepSeek chat variant
- `deepseek-coder` - DeepSeek coding model  
- `deepseek-r1` - DeepSeek R1 (reasoning model)
- `deepseek-v3` - DeepSeek v3

### 💎 Gemini Models  
These models should be tested:
- `gemini` - Base Gemini model
- `gemini-pro` - Gemini Pro
- `gemini-flash` - Gemini Flash (faster variant)
- `gemini-1.5-pro` - Gemini 1.5 Pro

### 🤖 Xai/Grok Models
These models should be tested:
- `grok` - Base Grok model
- `grok-beta` - Grok beta version
- `grok-mini` - Grok mini (lighter model)
- `grok-2` - Grok 2

## Testing Commands Reference

```javascript
// Check Puter.js status
getPuterStatus()

// Test existing verified models
await testPuterModels(['', 'gpt-4.1-nano', 'claude'])

// Test DeepSeek models specifically
await testPuterModels(['deepseek', 'deepseek-chat', 'deepseek-coder', 'deepseek-r1'])

// Test Gemini models specifically  
await testPuterModels(['gemini', 'gemini-pro', 'gemini-flash'])

// Test Grok models specifically
await testPuterModels(['grok', 'grok-beta', 'grok-mini'])

// Discovery and authentication
await discoverPuterModels()
await puterAuth.signIn()  // If authentication needed
```

## Expected Output Format

The test will show results like:
```
✅ deepseek: SUCCESS - "Hello! I'm DeepSeek..."
✅ gemini-pro: SUCCESS - "Hello! I'm Gemini Pro..."
❌ grok-2: ERROR - Authentication required
```

## Next Steps After Testing

1. Update models.ts with working models
2. Remove non-working models from catalog
3. Add authentication for premium models if needed
4. Test models in the actual chat interface