/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import * as Haptics from 'expo-haptics';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigators from '@/navigation/TabNavigators.tsx';
import { ThemeProvider } from '@/styles/ThemeProvider.tsx';
import {Provider} from 'react-redux';
import {persistor, store} from '@/store';
import {PersistGate} from 'redux-persist/integration/react';


export default function App() {
  useEffect(() => {
    const onBackPress = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <TabNavigators />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
