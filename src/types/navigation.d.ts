
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


declare global {

}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Nutrition: undefined;
  Profile: undefined;
  Recipes: undefined;
  TabNavigator: undefined;
  Camera: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type BottomTabParamList = {
  HomeTab: undefined;
  NutritionTab: undefined;
  RecipesTab: undefined;
  ProfileTab: undefined;
};



