# Smart Food Assistant App 🍽️

A comprehensive React Native food assistant app with AI-powered food scanning, recipe management, community features, and live streaming capabilities.

## 🚀 Features Implemented

### 1. Food Scanning & Analysis
- **AI Food Recognition**: Scan food items using camera or photo gallery
- **Nutrition Analysis**: Get detailed calorie, carbohydrate, protein, and fat information
- **Confidence Scoring**: AI confidence levels for scan accuracy
- **History Tracking**: Save and manage all food scan records
- **Data Persistence**: Redux store with AsyncStorage persistence

### 2. Recipe Management
- **Recipe Collection**: Browse comprehensive recipe database
- **Video Support**: Watch recipe preparation videos
- **Detailed Instructions**: Step-by-step cooking instructions
- **Nutrition Facts**: Complete nutritional information per recipe
- **Favorites System**: Save and organize favorite recipes
- **Categories & Tags**: Organized recipe browsing
- **Search Functionality**: Find recipes by ingredients or name

### 3. Nutrition Tracking & Analytics
- **Daily Tracking**: Monitor daily nutrition intake
- **Visual Charts**: Interactive pie charts and line graphs
- **Goal Setting**: Set and track daily nutrition goals
- **Progress Monitoring**: Weekly and monthly nutrition trends
- **Macronutrient Distribution**: Visual breakdown of carbs, protein, and fat

### 4. Community & Chat Features
- **Chat Groups**: Join cooking communities and chef groups
- **Real-time Messaging**: Share recipes and cooking tips
- **Recipe Sharing**: Share recipes directly in chat
- **Community Discovery**: Find and join popular cooking groups

### 5. Live Streaming (Future-Ready)
- **Live Cooking Shows**: Watch chefs cook in real-time
- **Interactive Chat**: Engage with chefs during live streams
- **Scheduled Streams**: Browse upcoming cooking sessions
- **Stream History**: Access past cooking demonstrations

### 6. User Experience & Customization
- **Theme Switching**: Light and dark mode support
- **Multi-language**: English and Chinese localization
- **User Authentication**: Secure login and profile management
- **Settings Management**: Comprehensive app preferences
- **Responsive Design**: Optimized for all screen sizes

## 🏗️ Technical Architecture

### Frontend Stack
- **React Native 0.79.5** with Expo SDK 53
- **TypeScript** for type safety
- **React Navigation 7** for navigation
- **Redux Toolkit** for state management
- **Redux Persist** for data persistence

### Key Libraries
- **expo-camera**: Camera functionality for food scanning
- **expo-image-picker**: Gallery image selection
- **react-native-gifted-charts**: Interactive charts and graphs
- **react-native-elements**: UI components
- **i18n-js**: Internationalization support
- **react-native-vector-icons**: Icon library

### State Management
- **Redux Slices**:
  - `foodSlice`: Food scanning history and nutrition goals
  - `recipeSlice`: Recipe management and favorites
  - `userSlice`: User authentication and profile
  - `chatSlice`: Chat groups and messaging

## 📱 Screen Structure

### Core Screens
1. **HomeScreen**: Dashboard with nutrition summary and quick actions
2. **FoodScanScreen**: AI-powered food scanning interface
3. **FoodHistoryScreen**: Historical food scan records
4. **RecipesScreen**: Recipe browsing and discovery
5. **RecipeDetailScreen**: Detailed recipe view with video support
6. **NutritionScreen**: Nutrition tracking and analytics
7. **ChatGroupScreen**: Community chat interface
8. **LiveStreamScreen**: Live cooking stream platform
9. **SettingsScreen**: App preferences and customization
10. **ProfileScreen**: User profile and account management

### Navigation Structure
- **Bottom Tab Navigation**: Home, Recipes, Nutrition, Profile
- **Stack Navigation**: Modal screens and detailed views
- **Deep Linking**: Support for recipe and chat group links

## 🎨 UI/UX Features

### Design System
- **Consistent Theming**: Light/dark mode with custom color schemes
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Screen reader support and proper contrast ratios
- **Smooth Animations**: React Native Reanimated for fluid interactions

### Components
- **NutritionChart**: Interactive charts for nutrition data
- **RecipeCard**: Reusable recipe display component
- **FoodScanResult**: Detailed food analysis display
- **Custom Icons**: Food and nutrition-specific iconography

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- React Native development environment
- Expo CLI
- iOS Simulator / Android Emulator

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd react_food_AI

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup
1. Configure camera permissions in `app.json`
2. Set up API endpoints for food recognition service
3. Configure push notifications (optional)
4. Set up analytics tracking (optional)

## 🚀 Future Enhancements

### Planned Features
1. **AI Integration**: Connect to real food recognition APIs
2. **Meal Planning**: Weekly meal planning and shopping lists
3. **Social Features**: Follow chefs and share cooking achievements
4. **Offline Mode**: Cached recipes and offline food database
5. **Wearable Integration**: Apple Watch and fitness tracker sync
6. **Barcode Scanning**: Packaged food nutrition lookup
7. **Restaurant Integration**: Menu nutrition information
8. **Dietary Restrictions**: Allergy and diet-specific filtering

### Technical Improvements
1. **Performance Optimization**: Image compression and caching
2. **Real-time Sync**: Cloud synchronization across devices
3. **Push Notifications**: Meal reminders and community updates
4. **Advanced Analytics**: Machine learning insights
5. **Voice Commands**: Voice-activated food logging

## 📊 Data Models

### Food Item
```typescript
interface FoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  confidence: number;
  date: string;
  imageUri?: string;
}
```

### Recipe
```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  category: string[];
  tags: string[];
  isFavorite: boolean;
  rating: number;
  reviews: number;
}
```

## 🔒 Security & Privacy

### Data Protection
- Local data encryption with Redux Persist
- Secure image storage and handling
- User authentication with JWT tokens
- Privacy-compliant data collection

### Permissions
- Camera access for food scanning
- Photo library access for image selection
- Microphone access for live streaming (future)
- Location access for restaurant features (future)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Food recognition powered by AI/ML services
- Recipe data from various culinary sources
- Community features inspired by social cooking platforms
- UI/UX design following modern mobile app standards

---

**Built with ❤️ for food lovers and cooking enthusiasts worldwide!**