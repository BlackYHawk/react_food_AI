import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useAppSelector} from '@/hooks/appHooks.tsx';
import { useTheme } from '@/styles/ThemeProvider.tsx';

import i18n from '@/i18n/i18n.js';
import { LinearGradient } from 'expo-linear-gradient';
import {Avatar} from 'react-native-elements';

const LoginScreen = () => {
  const { theme } = useTheme();
  const userData = useAppSelector((state) => state.user);

  const showAvatorPreview = () => {
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    loginCard: {
      marginHorizontal: 20,
      backgroundColor: theme.secondaryColor,
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      marginTop: 40,
    },
    avatarContainer: {
      borderWidth: 1,
      borderColor: 'gray',
    },
    appTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.textPrimary,
    },
    appDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
    },
    loginButton: {
      width: '100%',
      marginBottom: 15,
      borderRadius: 8,
      overflow: 'hidden',
    },
    buttonGradient: {
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    registerButton: {
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 8,
      backgroundColor: theme.backgroundColor,
    },
    registerButtonText: {
      color: theme.textPrimary,
      fontSize: 16,
    },
    agreementContainer: {
      marginTop: 20,
      marginBottom: 10,
    },
    agreementText: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
    },
    agreementLink: {
      color: '#FF7043',
    },
  }), [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={theme.textPrimary === '#fff' ? 'light-content' : 'dark-content'} />

      {/* Login Card */}
      <View style={styles.loginCard}>
        {/* App Logo */}
        <Avatar
          rounded
          size={80}
          source={{ uri: userData.avatar }}
          activeOpacity={0.7}
          onPress={showAvatorPreview}
          containerStyle={styles.avatarContainer}
        >
          <Avatar.Accessory
            size={22}
            color="white"
            backgroundColor="#00C984"
            name="camera"
            type="font-awesome-5"
          />
        </Avatar>

        {/* App Title */}
        <Text style={styles.appTitle}>{i18n.t('login.title')}</Text>

        {/* App Description */}
        <Text style={styles.appDescription}>
          {i18n.t('login.description')}
        </Text>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <LinearGradient
            colors={['#FF8F59', '#FF5C5C']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.loginButtonText}>{i18n.t('login.login')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>{i18n.t('login.register')}</Text>
        </TouchableOpacity>

        {/* Agreement Text */}
        <View style={styles.agreementContainer}>
          <Text style={styles.agreementText}>
            {i18n.t('login.agreementText')}
            <Text style={styles.agreementLink}>{i18n.t('login.agreementLink')}</Text> 、
            <Text style={styles.agreementLink}>{i18n.t('login.privacyLink')}</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
