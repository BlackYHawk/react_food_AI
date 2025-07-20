import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text } from 'react-native-elements';
import HomeScreen from '@/screens/HomeScreen.tsx';
import VideoScreen from '@/screens/VideoScreen';
import RecipesScreen from '@/screens/RecipesScreen.tsx';
import NutritionScreen from '@/screens/NutritionScreen.tsx';
import ProfileScreen from '@/screens/ProfileScreen.tsx';
import LoginScreen from '@/screens/LoginScreen.tsx';
import CameraScreen from '@/components/Camera/CameraScreen';
import FoodScanScreen from '@/screens/FoodScanScreen';
import FoodHistoryScreen from '@/screens/FoodHistoryScreen';
import RecipeDetailScreen from '@/screens/RecipeDetailScreen';
import ChatGroupScreen from '@/screens/ChatGroupScreen';
import LiveStreamScreen from '@/screens/LiveStreamScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from '@/i18n/i18n.js';
import type {
  BottomTabParamList,
  RootStackParamList,
} from '@/types/navigation';
import { useTheme } from '@/styles/ThemeProvider.tsx';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          let iconType = 'material';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Video':
              iconName = 'play-circle-filled';
              break;
            case 'Recipes':
              iconName = 'book';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return (
            <Icon
              name={iconName}
              type={iconType}
              size={size}
              color={color}
              tvParallaxProperties={{}}
            />
          );
        },
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: theme.textLight,
        headerShown: false,
        tabBarLabel: ({ focused }) => {
          let label = '';
          switch (route.name) {
            case 'Home':
              label = i18n.t('tab.home');
              break;
            case 'Video':
              label = i18n.t('tab.video');
              break;
            case 'Recipes':
              label = i18n.t('tab.recipes');
              break;
            case 'Profile':
              label = i18n.t('tab.profile');
              break;
            default:
              label = '';
          }
          return (
            <Text
              style={[
                { color: focused ? theme.primaryColor : theme.textLight },
                { fontSize: 10 },
              ]}>
              {label}
            </Text>
          );
        },
        tabBarStyle: {
          backgroundColor: theme.backgroundColor,
          borderTopColor: theme.secondaryColor,
          paddingBottom: 2,
          height: 65,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { theme } = useTheme();

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Main"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen name="Camera" component={CameraScreen} />
      <RootStack.Screen
        name="FoodScan"
        component={FoodScanScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="FoodHistory"
        component={FoodHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="ChatGroup"
        component={ChatGroupScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="LiveStream"
        component={LiveStreamScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  );
};

export default Navigation;
