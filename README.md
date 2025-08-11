# Food AI Monorepo

A comprehensive food recognition and nutrition tracking application built with React Native and Fastify.

## 🏗️ Architecture

This monorepo contains:

- **Mobile App** (`apps/mobile`) - React Native application with Expo
- **API Server** (`apps/api`) - Fastify backend with TypeScript
- **Shared Package** (`packages/shared`) - Common types, constants, and utilities

## 📦 Project Structure

```
food-ai-monorepo/
├── apps/
│   ├── mobile/          # React Native mobile app
│   │   ├── src/         # Source code
│   │   ├── android/     # Android specific files
│   │   ├── ios/         # iOS specific files
│   │   └── package.json
│   └── api/             # Fastify API server
│       ├── src/         # Source code
│       │   ├── routes/  # API routes
│       │   ├── services/# Business logic
│       │   └── types/   # Type definitions
│       └── package.json
├── packages/
│   └── shared/          # Shared utilities and types
│       ├── src/
│       │   ├── types/   # TypeScript interfaces
│       │   ├── constants/# App constants
│       │   └── utils/   # Utility functions
│       └── package.json
├── pnpm-workspace.yaml  # PNPM workspace config
├── lerna.json           # Lerna config
└── package.json         # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PNPM >= 8
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-ai-monorepo
   ```

2. **Install dependencies**
   ```bash
   # Install PNPM if you haven't already
   npm install -g pnpm

   # Install all dependencies
   pnpm install
   ```

3. **Build shared packages**
   ```bash
   pnpm run build:shared
   ```

### Development

#### Start all services
```bash
pnpm run dev
```

#### Start individual services
```bash
# Mobile app only
pnpm run dev:mobile

# API server only
pnpm run dev:api
```

#### Build all projects
```bash
pnpm run build
```

#### Run tests
```bash
pnpm run test
```

#### Lint code
```bash
pnpm run lint
```

## 📱 Mobile App

The mobile app is built with:
- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Expo Camera** for food scanning
- **i18n** for internationalization

### Key Features
- 📸 Food recognition via camera
- 📊 Nutrition tracking and analytics
- 🎨 Multiple themes and languages
- 👤 User profiles and preferences
- 📈 Progress tracking and goals

### Running the Mobile App
```bash
cd apps/mobile
pnpm run start
```

## 🔧 API Server

The API server is built with:
- **Fastify** for high performance
- **TypeScript** for type safety
- **Zod** for validation
- **JWT** for authentication
- **Swagger** for API documentation

### Key Features
- 🔐 JWT authentication
- 📸 Food image recognition
- 📊 Nutrition data management
- 👤 User management
- 📖 Auto-generated API docs

### API Documentation
When running the API server, visit:
- **Swagger UI**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health

### Running the API Server
```bash
cd apps/api
pnpm run dev
```

## 📚 Shared Package

Contains common code shared between mobile and API:
- **Types**: TypeScript interfaces and types
- **Constants**: API endpoints, nutrition data, etc.
- **Utils**: Helper functions and utilities

## 🔧 Development Workflow

### Adding New Features

1. **Define types** in `packages/shared/src/types/`
2. **Add API endpoints** in `apps/api/src/routes/`
3. **Implement mobile features** in `apps/mobile/src/`
4. **Update shared constants** if needed

### Code Organization

- **Mobile**: Feature-based organization (`screens/`, `components/`, `services/`)
- **API**: Layer-based organization (`routes/`, `services/`, `types/`)
- **Shared**: Type-based organization (`types/`, `constants/`, `utils/`)

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run mobile tests only
pnpm run test:mobile

# Run API tests only
pnpm run test:api

# Run tests with coverage
pnpm run test:coverage
```

## 📦 Building for Production

### Mobile App
```bash
# Build for Android
pnpm run build:mobile:android

# Build for iOS
pnpm run build:mobile:ios
```

### API Server
```bash
# Build TypeScript
pnpm run build:api

# Start production server
pnpm run start:api
```

## 🔄 Package Management

This monorepo uses PNPM workspaces for efficient package management:

- **Install dependency for mobile**: `pnpm --filter mobile add <package>`
- **Install dependency for API**: `pnpm --filter api add <package>`
- **Install dependency for shared**: `pnpm --filter shared add <package>`
- **Install root dependency**: `pnpm add -w <package>`

## 🌍 Environment Variables

### Mobile App
Create `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### API Server
Create `apps/api/.env` (copy from `.env.example`):
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
```

## 📖 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Food Recognition
- `POST /api/food/recognize` - Recognize food from image
- `GET /api/food/database` - Search food database
- `GET /api/food/:id` - Get food by ID

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

### Nutrition Tracking
- `POST /api/nutrition/log` - Add food to nutrition log
- `GET /api/nutrition/log/:date` - Get nutrition log for date
- `GET /api/nutrition/summary` - Get nutrition summary
- `PUT /api/nutrition/goals` - Update nutrition goals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the mobile app documentation

---

Built with ❤️ using React Native and Fastify