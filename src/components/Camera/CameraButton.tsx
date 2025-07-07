import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/styles/ThemeProvider.tsx';

const CameraButton = () => {
  const { theme } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleCameraPress = async () => {
    navigation.navigate('CameraScreen');
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    glowOuter: {
      position: 'absolute',
      width: 148,
      height: 148,
      backgroundColor: theme.primaryColor,
      borderRadius: 74,
      opacity: 0.2,
    },
    glowInner: {
      position: 'absolute',
      width: 138,
      height: 138,
      backgroundColor: theme.primaryColor,
      borderRadius: 69,
      opacity: 0.3,
    },
    buttonContainer: {
      width: 128,
      height: 128,
      borderRadius: 64,
      elevation: 8,
      shadowColor: theme.primaryColor,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    button: {
      width: 128,
      height: 128,
      backgroundColor: theme.primaryColor,
      borderRadius: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    camera: {
      width: '90%',
      height: '70%',
      borderRadius: 16,
      overflow: 'hidden',
    },
    captureBtn: {
      position: 'absolute',
      bottom: 40,
      alignSelf: 'center',
      backgroundColor: theme.primaryColor,
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: 40,
      right: 30,
      zIndex: 2,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      {/* Glow Effect */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCameraPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}>
          <Icon name="camera-alt" type="material" size={48} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CameraButton;
