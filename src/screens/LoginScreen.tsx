import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import LoginComponent from '@/components/Login/LoginComponent.tsx';

const LoginScreen = () => {
  const { theme } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
  }), [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={theme.textPrimary === '#fff' ? 'light-content' : 'dark-content'} />
      <LoginComponent />
    </SafeAreaView>
  );
};

export default LoginScreen;
