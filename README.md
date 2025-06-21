# MultipleAI-v1

> A powerful Node.js application that integrates multiple AI providers to deliver intelligent solutions through a unified interface.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🌟 Overview

MultipleAI-v1 is a comprehensive Node.js application that seamlessly integrates multiple AI service providers including OpenAI, Google AI, Anthropic Claude, and more. It provides a unified API interface for accessing various AI capabilities such as text generation, chat completion, image generation, and content analysis.

## ✨ Features

- 🤖 **Multi-Provider Support**: Integration with OpenAI, Google AI, Anthropic, Cohere, and other AI providers
- 💬 **Chat Interface**: Interactive chat functionality with conversation history
- 🖼️ **Image Generation**: AI-powered image creation and manipulation
- 📝 **Text Processing**: Advanced text analysis, summarization, and generation
- 🔐 **Authentication**: Secure JWT-based user authentication
- ⚡ **Rate Limiting**: Built-in API rate limiting and usage tracking
- 📊 **Analytics**: Usage statistics and performance monitoring
- 🌍 **Multi-language**: Support for multiple languages
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔄 **Real-time Updates**: WebSocket support for live interactions

## 🚀 Quick Start

### Prerequisites

```bash
# Required software
Node.js >= 16.0.0
npm or yarn
MongoDB >= 4.4
Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/novalyyt/MultipleAI-v1.git
cd MultipleAI-v1
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment setup**
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

4. **Configure environment variables**
```env
# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/multipleai
DATABASE_NAME=multipleai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# AI Provider API Keys
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_ORG_ID=your-openai-org-id

GOOGLE_AI_API_KEY=your-google-ai-api-key
GOOGLE_PROJECT_ID=your-google-project-id

ANTHROPIC_API_KEY=your-anthropic-api-key

COHERE_API_KEY=your-cohere-api-key

# Optional AI Providers
HUGGINGFACE_API_KEY=your-huggingface-token
REPLICATE_API_TOKEN=your-replicate-token

# Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,txt,docx

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

5. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the application**
```
http://localhost:3000
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
```bash
git clone https://github.com/yourusername/MultipleAI-v1.git
cd MultipleAI-v1
```

3. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

4. **Install dependencies**
```bash
npm install
```

5. **Make your changes**
6. **Run tests**
```bash
npm test
```

7. **Commit your changes**
```bash
git commit -m "Add amazing feature"
```

8. **Push to your branch**
```bash
git push origin feature/amazing-feature
```

9. **Create a Pull Request**

### Code Style Guidelines

- Use ESLint configuration provided
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass

### Pull Request Process

1. Update README.md with details of changes if needed
2. Update the version number following SemVer
3. Ensure CI/CD pipeline passes
4. Request review from maintainers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for their powerful GPT models
- Anthropic for Claude AI capabilities
- Google for their AI services
- The Node.js community
- All contributors and users

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/novalyyt/MultipleAI-v1/issues)
- **Documentation**: Check the [docs](./docs) folder
- **Email**: rifqinoval09@gmail.com

## 🔗 Links

- [Live Demo](https://multipleai-demo.herokuapp.com)
- [API Documentation](https://multipleai-docs.herokuapp.com)
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)

---

Made with ❤️ by [novalyyt](https://github.com/novalyyt)

⭐ If you find this project helpful, please give it a star!
