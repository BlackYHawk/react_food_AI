import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import LoginComponent from '@/components/Login/LoginComponent.tsx';
import i18n from '@/i18n/i18n';

const LoginScreen = () => {
  const { theme, isLightTheme } = useTheme();
  const navigation = useNavigation();
  const safeInsets = useSafeAreaInsets();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleClose = () => {
    // Close current screen - you can customize this behavior
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If no previous screen, navigate to home or main screen
      navigation.navigate('Home' as never);
    }
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || '#E5E5E5',
      backgroundColor: theme.backgroundColor,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary || '#000000',
      textAlign: 'center',
      flex: 1,
    },
    content: {
      flex: 1,
    },
  }), [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={isLightTheme ? 'dark-content' : 'light-content'} />
      
      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon 
            name="arrow-back" 
            type="material"
            size={24} 
            color={theme.textPrimary || '#000000'} 
            tvParallaxProperties={{}}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>登录</Text>

        {/* Close Button */}
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleClose}
          activeOpacity={0.7} >
          <Icon 
            name="close" 
            type="material"
            size={24} 
            color={theme.textPrimary || '#000000'} 
            tvParallaxProperties={{}}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <LoginComponent />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
