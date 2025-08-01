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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigators from '@/navigation/TabNavigators.tsx';
import { ThemeProvider } from '@/styles/ThemeProvider.tsx';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '@/screens/SimpleSplashScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    const onBackPress = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        console.log('App is preparing...');

        // 模拟加载时间，让用户能看到启动动画
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('App preparation completed');
      } catch (e) {
        console.warn('App preparation error:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
        console.log('Native splash screen hidden');
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LanguageProvider>
            <ThemeProvider>
              <SplashScreenComponent />
            </ThemeProvider>
          </LanguageProvider>
        </PersistGate>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <TabNavigators />
              </NavigationContainer>
            </SafeAreaProvider>
          </ThemeProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}
