/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TabNavagators from './navigation/TabNavigators.tsx';
import {Provider} from 'react-redux';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import i18n from './i18n/i18n';

export default function App() {
  const lastBackPressed = useRef<number>(0);

  useEffect(() => {
    const onBackPress = () => {
      const now = Date.now();
      if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
        // 2秒内再次点击，退出应用
        BackHandler.exitApp();
        return true;
      }
      lastBackPressed.current = now;
      Toast.show(i18n.t('exitApp'), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <TabNavagators />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
