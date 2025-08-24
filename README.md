<div align="center">

# 🎯 ModelArena

### The ultimate open-source playground for comparing multiple AI models side-by-side

[![GitHub Stars](https://img.shields.io/github/stars/Xenonesis/ModelArena)](https://github.com/Xenonesis/ModelArena/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Xenonesis/ModelArena)](https://github.com/Xenonesis/ModelArena/issues)
[![License](https://img.shields.io/github/license/Xenonesis/ModelArena)](https://github.com/Xenonesis/ModelArena/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Xenonesis/ModelArena/pulls)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://hub.docker.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)

[🌐 Live Demo](https://modelarena.vercel.app) • [📖 Documentation](https://github.com/Xenonesis/ModelArena/wiki) • [🚀 Quick Start](#-quick-start)

</div>

---

## 📋 Table of Contents

- [🎯 What is ModelArena?](#-what-is-modelarena)
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [🌐 Supported Providers](#-supported-providers)
- [🔧 Environment Variables](#-environment-variables)
- [🐳 Docker Support](#-docker-support)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)
- [📬 Support](#-support)

---

</div>



<div align="center">
  <video controls poster="./public/osfiesta.png" width="800">
    <source src="./public/OSFiesta.mp4" type="video/mp4" />
    <a href="./public/OSFiesta.mp4">
      <img src="./public/osfiesta.png" alt="ModelArena preview" />
    </a>
    Your browser does not support the video tag.
  </video>
</div>

## 🎯 What is ModelArena?

ModelArena is a cutting-edge, open-source AI playground that allows you to experiment with and compare multiple AI models side-by-side. Unlike traditional chat interfaces, ModelArena enables you to run up to 5 different AI models simultaneously, compare their outputs, and find the best response for your specific needs.

Built with Next.js 15, TypeScript, and Tailwind CSS, ModelArena provides a modern, responsive interface with real-time streaming capabilities and a clean, intuitive UI.

## ✨ Key Features

### 🎯 Multi-Model Comparison
- **Side-by-side comparison** of up to 5 AI models simultaneously
- **Real-time response comparison** with color-coded outputs
- **Performance metrics** and response time tracking
- **A/B testing interface** for prompt optimization
- **Export comparison results** in multiple formats

### 🤖 Extensive Model Support
- **🔹 Google Gemini**: Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 1.5 Pro
- **🔸 OpenRouter Models** (20+ models):
  - 🆓 **DeepSeek R1** - Advanced reasoning capabilities
  - 🆓 **Llama 3.3 70B** - Meta's latest high-quality model
  - 🆓 **Qwen 2.5 72B** - Alibaba's multilingual powerhouse
  - 🆓 **Mistral Small 24B** - Efficient performance
  - 🆓 **Moonshot Kimi K2** - Fast and reliable
  - 🆓 **Reka Flash 3** - Vision and text combined
  - 💰 **GLM 4.5 Air** - High-performance paid option
- **🔹 Anthropic Claude**: Claude 3.5 Sonnet, Claude 3 Opus
- **🔹 OpenAI GPT**: GPT-4, GPT-3.5 Turbo

### 🚀 Advanced Capabilities
- **🌐 Web Search Integration**: Real-time information retrieval per message
- **📸 Image Analysis**: Upload and analyze images with vision models
- **⚡ Real-time Streaming**: Blazing-fast responses with normalized APIs
- **📁 Project Organization**: Custom system prompts and conversation management
- **🎨 Multiple Themes**: Dark/light mode with customizable accents
- **⌨️ Keyboard Shortcuts**: Power user shortcuts for efficiency
- **📱 Mobile Responsive**: Works seamlessly on all devices

### 🛠️ Developer-Friendly Features
- **🏠 Self-Hostable**: Fully open-source with MIT license
- **🐳 Docker Support**: One-click deployment with Docker Compose
- **🔄 API Normalization**: Consistent interface across all providers
- **🎯 Hot Reload**: Instant development feedback
- **📊 Built-in Analytics**: Usage tracking and performance monitoring
- **🔧 Extensible Architecture**: Easy to add new AI providers
- **🧪 Testing Framework**: Comprehensive test suites included

## 📸 Screenshots

<div align="center">
  <img src="./public/screenshots/dashboard.png" alt="ModelArena Dashboard" width="800"/>
  <p><em>Main Dashboard - Compare multiple AI models side by side</em></p>

  <img src="./public/screenshots/chat-interface.png" alt="Chat Interface" width="800"/>
  <p><em>Real-time chat interface with streaming responses</em></p>

  <img src="./public/screenshots/model-selection.png" alt="Model Selection" width="800"/>
  <p><em>Choose from 20+ AI models with easy selection interface</em></p>
</div>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys from at least one AI provider

### Option 1: One-Click Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Xenonesis/ModelArena.git
cd ModelArena

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# Get free API keys from:
# - OpenRouter: https://openrouter.ai/keys
# - Google AI Studio: https://aistudio.google.com/app/apikey

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Option 2: Docker Development (Fastest)

```bash
# Using Docker Compose (recommended)
docker-compose up modelarena_dev

# Or using npm script
npm run docker:dev
```

### Option 3: Manual Docker Commands

```bash
# Build the image
docker build -t modelarena .

# Run the container
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=your_key_here \
  -e GOOGLE_GENERATIVE_AI_API_KEY=your_key_here \
  modelarena
```

### Option 4: Deploy to Vercel (1-minute setup)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Xenonesis/ModelArena)

**After deployment:**
1. Add environment variables in Vercel dashboard
2. Your ModelArena instance is live! 🚀

## 🛠️ Tech Stack

<div align="center">

### Core Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend Framework** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js) | 15.x | Full-stack React framework |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript) | 5.x | Type-safe JavaScript |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css) | 3.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Beautiful, accessible components |
| **Icons** | Lucide React | Latest | Consistent icon library |

### Backend & APIs
| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Routes** | Next.js API | Serverless backend functions |
| **AI Providers** | OpenRouter, Google Gemini | AI model integrations |
| **State Management** | React Context | Global state management |
| **Data Storage** | localStorage | Client-side persistence |

### Development & Deployment
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Containerization** | Docker | Consistent environments |
| **Orchestration** | Docker Compose | Multi-container management |
| **Deployment** | Vercel | Serverless deployment platform |
| **Package Manager** | npm | Dependency management |
| **Code Quality** | ESLint | Code linting and formatting |

### Additional Libraries
- **Framer Motion** - Smooth animations and transitions
- **React Toastify** - Beautiful notification system
- **React Markdown** - Rich text rendering
- **UUID** - Unique identifier generation
- **Date-fns** - Date manipulation utilities

</div>

## 🏗️ Project Structure

```
app/
├── api/                 # API routes for different providers
│   ├── gemini/          # Gemini provider integration
│   └── openrouter/      # OpenRouter provider integration
├── chat/                # Chat interface
└── ...                  # Other Next.js app routes

components/
├── app/                 # Main application components
├── chat/                # Chat-specific components
├── ui/                  # Reusable UI components (shadcn/ui)
└── ...                  # Other component categories

lib/
├── models.ts            # Model catalog and configuration
├── themeContext.ts      # Theme management
└── ...                  # Utility functions and helpers

public/                  # Static assets
```

## 🌐 Supported Providers

| Provider | Models | Features |
|---------|--------|----------|
| **Google Gemini** | Gemini 2.5 Pro, Flash | Image input, fast responses |
| **OpenRouter** | 20+ models including: | Free tiers, wide selection |
| | - DeepSeek R1 | Reasoning capabilities |
| | - Llama 3.3 70B | High-quality responses |
| | - Qwen 2.5 72B | Multilingual support |
| | - Mistral Small | Efficient performance |
| | - And many more... | |

## 🔧 Environment Variables

| Variable | Description | Required |
|---------|-------------|----------|
| `OPENROUTER_API_KEY` | API key from [OpenRouter](https://openrouter.ai) | For OpenRouter models |
| `GOOGLE_GENERATIVE_AI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com) | For Gemini models |

You can also provide API keys at runtime through the UI's Settings panel.

## 🐳 Docker Support

ModelArena includes comprehensive Docker support for both development and production:

### Development
- Hot reload enabled for instant code changes
- Volume mounting for live code updates
- Includes all development dependencies

### Production
- Multi-stage build for optimized image size (~100MB)
- Security best practices with non-root user
- Environment variable configuration support

### Available Docker Commands
```bash
npm run docker:build    # Build production Docker image
npm run docker:run      # Run production container
npm run docker:dev      # Start development environment with Docker Compose
npm run docker:prod     # Start production environment with Docker Compose
```

## 🗺️ Roadmap

### 🚀 **Q4 2024 - Current Features**
- ✅ Multi-model comparison interface
- ✅ Real-time streaming responses
- ✅ 20+ AI model support
- ✅ Docker deployment
- ✅ Mobile responsive design
- ✅ Project organization system

### 🎯 **Q1 2025 - Enhanced Comparison**
- 🔄 **Advanced Analytics Dashboard** - Response time graphs, token usage tracking
- 🔄 **A/B Testing Framework** - Systematic prompt comparison tools
- 🔄 **Custom Model Integration** - Support for private/local models
- 🔄 **Batch Processing** - Compare models on multiple prompts simultaneously
- 🔄 **Response Quality Metrics** - Automated scoring and ranking

### 🚀 **Q2 2025 - Collaboration Features**
- 🔄 **Team Workspaces** - Shared projects and comparisons
- 🔄 **Real-time Collaboration** - Live co-editing and discussions
- 🔄 **Comment System** - Annotate and discuss model responses
- 🔄 **Version Control** - Track changes in prompts and settings
- 🔄 **Export & Sharing** - Share comparison results with stakeholders

### 🎨 **Q3 2025 - Advanced Features**
- 🔄 **Plugin System** - Extend functionality with custom plugins
- 🔄 **API Access** - REST API for integrations
- 🔄 **Advanced Analytics** - Model performance over time
- 🔄 **Custom Workflows** - Automated comparison pipelines
- 🔄 **Integration APIs** - Connect with external tools

### 🌟 **Future Vision**
- 🤖 **AI-Powered Suggestions** - Smart model recommendations
- 🎯 **Automated Testing** - Continuous model evaluation
- 📊 **Industry Benchmarks** - Standardized performance metrics
- 🌐 **Federated Learning** - Privacy-preserving model training
- 🧠 **Cognitive Architecture** - Advanced reasoning frameworks

## 🤝 Contributing

We welcome contributions of all kinds! Whether you're fixing bugs, adding features, improving documentation, or sharing ideas.

### 🚀 **Ways to Contribute**
- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Share your ideas for new functionality
- 📝 **Documentation** - Improve guides, tutorials, and API docs
- 🎨 **UI/UX** - Enhance the user interface and experience
- 🔧 **Code** - Submit pull requests with improvements
- 🧪 **Testing** - Help test new features and report issues
- 🌍 **Translations** - Help translate the interface
- 📢 **Community** - Help others in discussions and issues

### 🛠️ **Development Setup**

```bash
# Fork and clone the repository
git clone https://github.com/your-username/ModelArena.git
cd ModelArena

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### 📋 **Pull Request Process**

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feat/amazing-feature
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript for all new code
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes** thoroughly:
   ```bash
   npm run lint
   npm run build
   npm run test
   ```

4. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

5. **Push to your fork** and create a Pull Request:
   ```bash
   git push origin feat/amazing-feature
   ```

### 🎯 **Development Guidelines**

#### **Code Style**
- **TypeScript First** - All new code must be TypeScript
- **ESLint Compliance** - Code must pass all linting rules
- **Consistent Naming** - Use camelCase for variables, PascalCase for components
- **Error Handling** - Proper try-catch blocks and error messages
- **Type Safety** - Leverage TypeScript's type system fully

#### **Component Guidelines**
- **Functional Components** - Use React hooks and functional components
- **Props Interface** - Define clear TypeScript interfaces for props
- **Accessibility** - Follow WCAG guidelines and use semantic HTML
- **Performance** - Optimize renders with React.memo when appropriate
- **Responsive Design** - Ensure mobile compatibility

#### **Testing**
- **Unit Tests** - Write tests for utility functions and hooks
- **Component Tests** - Test user interactions and rendering
- **Integration Tests** - Test complete user flows
- **E2E Tests** - Use Playwright for critical user journeys

#### **Documentation**
- **README Updates** - Update README for significant features
- **Code Comments** - Document complex logic and algorithms
- **API Documentation** - Document new API endpoints
- **Changelog** - Update CHANGELOG.md for releases

### 🏆 **Recognition**

Contributors are recognized in:
- **GitHub Contributors List** - Automatic recognition
- **Changelog** - Credits for significant contributions
- **Documentation** - Author attribution where appropriate
- **Social Media** - Feature highlights and shoutouts

### 📞 **Getting Help**

- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For questions and community support
- **Discord** - Real-time chat with maintainers and contributors
- **Documentation** - Comprehensive guides and tutorials

### 🎉 **First-Time Contributors**

We love welcoming new contributors! If you're new to open source:
- Look for issues labeled `good first issue`
- Check our [Contributing Guide](CONTRIBUTING.md)
- Join our community discussions
- Don't hesitate to ask for help!

---

<div align="center">
  <strong>Ready to contribute? 🚀</strong><br>
  <a href="https://github.com/Xenonesis/ModelArena/issues">View Issues</a> •
  <a href="https://github.com/Xenonesis/ModelArena/discussions">Join Discussions</a> •
  <a href="https://discord.gg/modelarena">Chat on Discord</a>
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Model access via [OpenRouter](https://openrouter.ai) and [Google AI](https://ai.google.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Inspired by the need for better AI model comparison tools

## 📬 Support

If you encounter any issues or have questions:
- Check [existing issues](https://github.com/Xenonesis/ModelArena/issues)
- [Open a new issue](https://github.com/Xenonesis/ModelArena/issues/new) for bug reports and feature requests
- [Join our discussions](https://github.com/Xenonesis/ModelArena/discussions) for community support
- Feel free to reach out to the maintainer at [Xenonesis](https://github.com/Xenonesis)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Xenonesis">Xenonesis</a>
</div>
