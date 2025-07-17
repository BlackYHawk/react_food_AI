import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Icon, Text } from 'react-native-elements';
import HomeScreen from '@/screens/HomeScreen.tsx';
import RecipesScreen from '@/screens/RecipesScreen.tsx';
import NutritionScreen from '@/screens/NutritionScreen.tsx';
import ProfileScreen from '@/screens/ProfileScreen.tsx';
import LoginScreen from '@/screens/LoginScreen.tsx';
import CameraScreen from '@/components/Camera/CameraScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import i18n from '@/i18n/i18n.js';
import type {
  BottomTabParamList,
  RootStackParamList,
} from '@/types/navigation.d.ts';
import {useTheme} from '@/styles/ThemeProvider.tsx';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
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
        tabBarLabel: ({focused}) => {
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
          return (
            <Text
              style={[
                {color: focused ? theme.primaryColor : theme.textLight},
                {fontSize: 10},
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
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {theme} = useTheme();

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
        options={({navigation}) => ({
          headerShown: true,
          headerBackVisible: true,
          headerBackTitleStyle: {
            fontSize: 16,
          },
          headerBackTitle: i18n.t('login.back'),
          headerTitle: i18n.t('login.title'),
          headerTitleStyle: {
            fontSize: 20,
            color: theme.textPrimary,
          },
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <Icon
                name="close"
                type="material"
                color={theme.textPrimary}
                size={24}
                tvParallaxProperties={{}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <RootStack.Screen name="Camera" component={CameraScreen} />
    </RootStack.Navigator>
  );
};

export default Navigation;
