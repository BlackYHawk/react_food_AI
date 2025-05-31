/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TabNavagators from './navigation/TabNavigators.tsx';
import {Provider} from 'react-redux';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';

export default function App() {
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
