import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTranslation } from '@/hooks/useTranslation';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

const QuickFunctions = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const openGallery = async () => {
    // 选择相机或相册
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    // 如果取消，直接返回
    if (result.canceled) return;

    // 获取图片 uri
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    // 压缩图片
    const compressed = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    // 这里可以将 compressed.uri 返回给调用方或做后续处理
    console.log('压缩后图片:', compressed.uri);
  };

  const functions = [
    {
      icon: 'photo',
      label: 'home.quickFunctions.photo',
      onPress: openGallery,
    },
    {
      icon: 'history',
      label: 'home.quickFunctions.history',
      onPress: () => {navigation.navigate('FoodHistory')}
    },
    {
      icon: 'assessment',
      label: 'home.quickFunctions.assessment',
      onPress: () => {navigation.navigate('Nutrition')}
    },
  ];

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
          <Text style={styles.label}>{t(func.label)}</Text>
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
