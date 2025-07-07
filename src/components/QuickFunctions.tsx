import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import i18n from '@/i18n/i18n';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';

const QuickFunctions = () => {
  const functions = [
    {
      icon: 'photo',
      label: 'home.quickFunctions.photo',
      onPress: openGallery,
    },
    {
      icon: 'history',
      label: 'home.quickFunctions.history',
      onPress: () => Alert.alert('功能提示', '历史记录功能'),
    },
    {
      icon: 'assessment',
      label: 'home.quickFunctions.assessment',
      onPress: () => Alert.alert('功能提示', '营养分析功能'),
    },
  ];

  const openGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      // 处理相册选择结果
      console.log('Gallery result:', result.assets[0].uri);
      // 这里添加图片识别逻辑
    }
  };

  return (
    <View style={styles.container}>
      {functions.map((func, index) => (
        <TouchableOpacity
          key={index}
          style={styles.functionButton}
          onPress={func.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Icon name={func.icon} type="material" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.label}>{i18n.t(func.label)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  functionButton: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default QuickFunctions;
