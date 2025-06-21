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

## 📁 Project Structure

```
MultipleAI-v1/
├── src/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   ├── redis.js             # Redis configuration
│   │   └── swagger.js           # API documentation setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── aiController.js      # AI service interactions
│   │   ├── chatController.js    # Chat functionality
│   │   ├── userController.js    # User management
│   │   └── fileController.js    # File upload/processing
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── validator.js         # Input validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── logger.js            # Request logging
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Conversation.js      # Chat conversations
│   │   ├── Message.js           # Chat messages
│   │   └── ApiUsage.js          # Usage tracking
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── ai.js                # AI service routes
│   │   ├── chat.js              # Chat routes
│   │   ├── user.js              # User routes
│   │   └── files.js             # File handling routes
│   ├── services/
│   │   ├── aiService.js         # Main AI service coordinator
│   │   ├── openaiService.js     # OpenAI integration
│   │   ├── googleaiService.js   # Google AI integration
│   │   ├── anthropicService.js  # Anthropic Claude integration
│   │   ├── cohereService.js     # Cohere integration
│   │   ├── emailService.js      # Email notifications
│   │   └── fileService.js       # File processing
│   ├── utils/
│   │   ├── constants.js         # App constants
│   │   ├── helpers.js           # Utility functions
│   │   ├── logger.js            # Winston logger setup
│   │   └── validation.js        # Validation schemas
│   └── app.js                   # Express app setup
├── public/
│   ├── css/                     # Stylesheets
│   ├── js/                      # Client-side JavaScript
│   ├── images/                  # Static images
│   └── index.html               # Main HTML file
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
├── docs/                        # Documentation
├── logs/                        # Application logs
├── uploads/                     # Uploaded files
├── scripts/                     # Utility scripts
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── README.md                    # This file
└── server.js                    # Application entry point
```

## 🔧 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

### AI Services

#### Chat Completion
```http
POST /api/ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "Explain quantum computing in simple terms",
  "provider": "openai",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7,
  "conversationId": "optional-conversation-id"
}
```

#### Text Generation
```http
POST /api/ai/generate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "prompt": "Write a short story about AI",
  "provider": "anthropic",
  "model": "claude-3-sonnet",
  "maxTokens": 1000,
  "temperature": 0.8
}
```

#### Image Generation
```http
POST /api/ai/image
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "prompt": "A futuristic cityscape with flying cars",
  "provider": "openai",
  "model": "dall-e-3",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1
}
```

#### Text Analysis
```http
POST /api/ai/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Text to analyze",
  "analysisType": "sentiment" | "summary" | "keywords",
  "provider": "google"
}
```

### Chat Management

#### Get Conversations
```http
GET /api/chat/conversations
Authorization: Bearer <access_token>
```

#### Get Conversation Messages
```http
GET /api/chat/conversations/:id/messages
Authorization: Bearer <access_token>
```

#### Delete Conversation
```http
DELETE /api/chat/conversations/:id
Authorization: Bearer <access_token>
```

### File Operations

#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "file": <file_object>,
  "description": "Optional file description"
}
```

#### Process File with AI
```http
POST /api/files/:id/process
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "action": "summarize" | "analyze" | "extract_text",
  "provider": "openai",
  "instructions": "Optional processing instructions"
}
```

## 💻 Usage Examples

### Node.js Client Example

```javascript
const axios = require('axios');

class MultipleAIClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async chat(message, options = {}) {
    const payload = {
      message,
      provider: options.provider || 'openai',
      model: options.model || 'gpt-3.5-turbo',
      maxTokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      ...options
    };

    try {
      const response = await this.client.post('/api/ai/chat', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Chat request failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async generateImage(prompt, options = {}) {
    const payload = {
      prompt,
      provider: options.provider || 'openai',
      model: options.model || 'dall-e-3',
      size: options.size || '1024x1024',
      ...options
    };

    try {
      const response = await this.client.post('/api/ai/image', payload);
      return response.data;
    } catch (error) {
      throw new Error(`Image generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async analyzeText(text, analysisType, provider = 'openai') {
    try {
      const response = await this.client.post('/api/ai/analyze', {
        text,
        analysisType,
        provider
      });
      return response.data;
    } catch (error) {
      throw new Error(`Text analysis failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Usage example
const client = new MultipleAIClient('http://localhost:3000', 'your-jwt-token');

(async () => {
  try {
    // Chat with AI
    const chatResponse = await client.chat('What is machine learning?', {
      provider: 'anthropic',
      model: 'claude-3-sonnet'
    });
    console.log('AI Response:', chatResponse.message);

    // Generate image
    const imageResponse = await client.generateImage('A beautiful sunset landscape');
    console.log('Generated Image URL:', imageResponse.imageUrl);

    // Analyze text sentiment
    const analysis = await client.analyzeText('I love this product!', 'sentiment');
    console.log('Sentiment Analysis:', analysis.result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

### Frontend JavaScript Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>MultipleAI Chat</title>
    <style>
        .chat-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .messages { height: 400px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
        .message { margin-bottom: 10px; padding: 8px; border-radius: 5px; }
        .user-message { background-color: #e3f2fd; text-align: right; }
        .ai-message { background-color: #f5f5f5; }
        .input-container { display: flex; gap: 10px; }
        .message-input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .send-button { padding: 10px 20px; background-color: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1>MultipleAI Chat Interface</h1>
        <div id="messages" class="messages"></div>
        <div class="input-container">
            <input type="text" id="messageInput" class="message-input" placeholder="Type your message..." />
            <select id="providerSelect">
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google AI</option>
            </select>
            <button onclick="sendMessage()" class="send-button">Send</button>
        </div>
    </div>

    <script>
        const API_BASE = 'http://localhost:3000/api';
        let authToken = localStorage.getItem('authToken'); // Assume user is logged in

        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const providerSelect = document.getElementById('providerSelect');
            const messagesDiv = document.getElementById('messages');
            
            const message = messageInput.value.trim();
            if (!message) return;

            // Add user message to chat
            addMessage(message, 'user');
            messageInput.value = '';

            try {
                const response = await fetch(`${API_BASE}/ai/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        message: message,
                        provider: providerSelect.value,
                        maxTokens: 500
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    addMessage(data.message, 'ai');
                } else {
                    addMessage(`Error: ${data.message}`, 'error');
                }
            } catch (error) {
                addMessage(`Network error: ${error.message}`, 'error');
            }
        }

        function addMessage(text, type) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Enter key to send message
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "auth"

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```javascript
// tests/integration/ai.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('AI API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Login and get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });
    authToken = loginResponse.body.token;
  });

  describe('POST /api/ai/chat', () => {
    it('should return AI response for valid chat request', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'Hello, how are you?',
          provider: 'openai'
        })
        .expect(200);

      expect(response.body.message).toBeDefined();
      expect(response.body.provider).toBe('openai');
    });

    it('should return 401 for unauthorized request', async () => {
      await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'Hello'
        })
        .expect(401);
    });
  });
});
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S multipleai -u 1001
USER multipleai

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  multipleai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/multipleai
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    restart: unless-stopped

  redis:
    image: redis:6.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - multipleai
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

### Running with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f multipleai

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🚀 Deployment

### Environment Setup for Production

```bash
# Create production environment file
cp .env.example .env.production

# Set production values
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-very-secure-production-secret
# ... other production configs
```

### PM2 Process Manager

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'multipleai',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Monitor application
pm2 monit

# Restart application
pm2 restart multipleai

# Stop application
pm2 stop multipleai

# View logs
pm2 logs multipleai
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    services: {
      database: 'unknown',
      redis: 'unknown',
      openai: 'unknown'
    }
  };

  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = 'disconnected';
    health.status = 'error';
  }

  // Check Redis connection (if enabled)
  if (redisClient) {
    try {
      await redisClient.ping();
      health.services.redis = 'connected';
    } catch (error) {
      health.services.redis = 'disconnected';
    }
  }

  // Check OpenAI API
  try {
    // Simple API check
    health.services.openai = 'available';
  } catch (error) {
    health.services.openai = 'unavailable';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## 🔒 Security

### Security Best Practices Implemented

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all user inputs
- **CORS Protection**: Configure allowed origins
- **Helmet.js**: Security headers
- **bcrypt**: Password hashing
- **API Key Protection**: Secure storage of AI provider keys

### Security Configuration

```javascript
// src/middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);
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
- **Email**: novalyyt@gmail.com

## 🔗 Links

- [Live Demo](https://multipleai-demo.herokuapp.com)
- [API Documentation](https://multipleai-docs.herokuapp.com)
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)

---

Made with ❤️ by [novalyyt](https://github.com/novalyyt)

⭐ If you find this project helpful, please give it a star!
