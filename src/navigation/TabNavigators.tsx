import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Icon, Text } from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen.tsx';
import RecipesScreen from '../screens/RecipesScreen.tsx';
import NutritionScreen from '../screens/NutritionScreen.tsx';
import ProfileScreen from '../screens/ProfileScreen.tsx';
import LoginScreen from '../screens/LoginScreen.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import i18n from '../i18n/i18n.js';

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
    tabBarLabel: ({ focused }) => {
      let label = '';
      switch (route.name) {
        case 'Home':
          label = i18n.t('tab.home');
          break;
        case 'Recipes':
          label = i18n.t('tab.recipes');
          break;
        case 'Nutrition':
          label = i18n.t('tab.nutrition');
          break;
        case 'Profile':
          label = i18n.t('tab.profile');
          break;
        default:
          label = '';
      }
      return <Text style={[{ color: focused ? '#4CAF50' : '#999' }, { fontSize: 10 }]}>{label}</Text>;
    },
    tabBarStyle: {
      backgroundColor: 'white',
      borderTopColor: '#e0e0e0',
      paddingBottom: 2,
      height: 65,
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
      },
    },
    Login: {
      screen: LoginScreen,
      options: ({navigation}) => ({
        headerShown: true,
        headerBackVisible: true,
        headerBackTitleStyle: {
          fontSize: 16,
        },
        headerBackTitle: i18n.t('login.back'),
        headerTitle: i18n.t('login.title'),
        headerTitleStyle: {
          fontSize: 20,
          color: '#333',
        },
        headerTitleAlign: 'center',
        headerRight: () =>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Icon name="close" type="material" color="#333" size={24} />
        </TouchableOpacity>,
      }),
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;

