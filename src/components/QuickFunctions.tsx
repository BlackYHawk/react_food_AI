import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

const QuickFunctions = () => {
  const functions = [
    {
      icon: 'photo',
      label: '相册导入',
      onPress: () => Alert.alert('功能提示', '相册导入功能'),
    },
    {
      icon: 'history',
      label: '历史记录',
      onPress: () => Alert.alert('功能提示', '历史记录功能'),
    },
    {
      icon: 'assessment',
      label: '营养分析',
      onPress: () => Alert.alert('功能提示', '营养分析功能'),
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
          <Text style={styles.label}>{func.label}</Text>
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
