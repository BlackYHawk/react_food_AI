
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


declare global {

}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Video: undefined;
  Nutrition: undefined;
  Profile: undefined;
  Recipes: undefined;
  TabNavigator: undefined;
  Camera: undefined;
  FoodScan: undefined;
  FoodHistory: undefined;
  RecipeDetail: { recipeId: string };
  ChatGroup: undefined;
  LiveStream: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type BottomTabParamList = {
  Home: undefined;
  Video: undefined;
  Recipes: undefined;
  Nutrition: undefined;
  Profile: undefined;
};



