import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { launchCamera } from 'react-native-image-picker';
import { globalStyles } from '../styles/globalStyles';

const CameraButton = () => {
  const [scaleValue] = useState(new Animated.Value(1));

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

  const handleCameraPress = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.assets && response.assets[0]) {
        // 处理拍照结果
        console.log('Camera result:', response.assets[0]);
        // 这里添加图片识别逻辑
      }
    });
  };

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

// @ts-ignore
// @ts-ignore
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 148,
    height: 148,
    backgroundColor: globalStyles.primaryColor,
    borderRadius: 74,
    opacity: 0.2,
  },
  glowInner: {
    position: 'absolute',
    width: 138,
    height: 138,
    backgroundColor: globalStyles.primaryColor,
    borderRadius: 69,
    opacity: 0.3,
  },
  buttonContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    elevation: 8,
    shadowColor: globalStyles.primaryColor,
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
    backgroundColor: globalStyles.primaryColor,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraButton;
