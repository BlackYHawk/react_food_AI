import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import generated from '@/assets/lottie_launcher.json';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={generated}
        autoPlay
        loop={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default SplashScreen;
