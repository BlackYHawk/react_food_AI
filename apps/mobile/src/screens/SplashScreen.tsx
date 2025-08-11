import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/styles/ThemeProvider';
import generated from '@/assets/lottie_launcher.json';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const { theme } = useTheme();
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // 启动动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 确保Lottie动画开始播放
    const timer = setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.play();
      } else {
        // 如果Lottie加载失败，显示备用界面
        setShowFallback(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primaryColor || '#4CAF50',
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    animation: {
      width: width * 0.6,
      height: height * 0.3,
    },
    fallbackIcon: {
      fontSize: 80,
      marginBottom: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 20,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: 8,
      textAlign: 'center',
      fontWeight: '300',
    },
    loadingDots: {
      flexDirection: 'row',
      marginTop: 30,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {!showFallback ? (
          <LottieView
            ref={animationRef}
            source={generated}
            style={styles.animation}
            autoPlay={true}
            loop={true}
            speed={1.2}
            resizeMode="contain"
            onAnimationFailure={() => setShowFallback(true)}
          />
        ) : (
          <Text style={styles.fallbackIcon}>🍽️</Text>
        )}
        
        <Text style={styles.appName}>美食AI</Text>
        <Text style={styles.subtitle}>智能营养分析助手</Text>
        
        <View style={styles.loadingDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
