# Development Setup & Troubleshooting

## Resolving Console Errors

If you're seeing console errors in development, here's how to fix them:

### 1. API Key Configuration

**Required**: Set up your API keys to test AI models.

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API keys to `.env.local`:
   ```bash
   # OpenRouter API Key (for multiple models)
   OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
   
   # Gemini API Key (for Google models)
   GEMINI_API_KEY=AIzaSyA-your_actual_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyA-your_actual_key_here
   ```

3. Get your API keys:
   - **OpenRouter**: [Get API Key](https://openrouter.ai/keys) (supports 100+ models)
   - **Gemini**: [Get API Key](https://aistudio.google.com/app/apikey) (Google AI Studio)

### 2. Puter.js Authentication (Optional)

The Puter.js 401 error is expected in development. Puter.js requires user authentication for full functionality:

- Visit [Puter.js Setup Guide](https://docs.puter.com/getting-started/)
- For browser-based testing, you'll need to authenticate with Puter.js manually
- This doesn't affect other AI models (OpenRouter, Gemini)

### 3. WebGL Context Loss (Three.js)

The "THREE.WebGLRenderer: Context Lost" warning during development is normal:
- Caused by React Hot Reload refreshing the 3D background
- Fixed automatically when context restores
- No action needed - this is development-only

### 4. Theme Accessibility

If you see contrast warnings:
- These are development-only accessibility checks
- Updated crimson theme now meets WCAG standards
- Warnings help ensure good contrast ratios

### 5. Development vs Production

**Development features:**
- API key setup helper (bottom-right corner)
- Console logging for debugging
- Accessibility contrast warnings
- Hot reload notifications

**Production builds:**
- All development helpers are automatically disabled
- Clean console output
- Optimized performance

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Test production build:**
   ```bash
   npm run build
   npm start
   ```

## Common Console Messages Explained

- `[Fast Refresh] rebuilding` - Normal development hot reload
- `Simple Analytics: Set hostname on localhost:3000` - Analytics disabled in dev
- `[Theme] Applied font: geist` - Theme system working correctly
- `Failed to load resource: 401/400` - Missing API keys (see setup above)

All console messages in development are informational and don't affect functionality.