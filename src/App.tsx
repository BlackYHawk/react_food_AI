/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavagators from './navigation/TabNavigators.tsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <TabNavagators />
    </SafeAreaProvider>
  )
}
