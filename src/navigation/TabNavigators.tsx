import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen.tsx';
import RecipesScreen from '../screens/RecipesScreen.tsx';
import NutritionScreen from '../screens/NutritionScreen.tsx';
import ProfileScreen from '../screens/ProfileScreen.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

const MainTabs = createBottomTabNavigator({
  screenOptions: ({route}) => ({
    tabBarIcon: ({color, size}) => {
      let iconName = 'home';
      let iconType = 'material';

      switch (route.name) {
        case 'Home':
          iconName = 'home';
          break;
        case 'Recipes':
          iconName = 'book';
          break;
        case 'Nutrition':
          iconName = 'assessment';
          break;
        case 'Profile':
          iconName = 'person';
          break;
        default:
          iconName = 'home';
      }

      // You can return any component that you like here!
      return <Icon name={iconName} type={iconType} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#4CAF50',
    tabBarInactiveTintColor: '#999',
    headerShown: false,
    tabBarStyle: {
      backgroundColor: 'white',
      borderTopColor: '#e0e0e0',
      paddingBottom: 5,
      height: 60,
    },
  }),
  screens: {
    Home: HomeScreen,
    Recipes: RecipesScreen,
    Nutrition: NutritionScreen,
    Profile: ProfileScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: MainTabs,
      options: {
        headerShown: false,
      }
    }
  }
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
