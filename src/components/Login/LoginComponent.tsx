import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import i18n from '@/i18n/i18n';
import {CheckBox} from 'react-native-elements';

const LoginComponent = () => {
  const { theme } = useTheme();
  const [loginMethod, setLoginMethod] = useState('email'); // email, sms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricLogin = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return Alert.alert(
        'Biometric record not found',
        'Please enroll biometric authentication in your device settings.'
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    if (result.success) {
      Alert.alert('Success', 'You have been logged in.');
    } else {
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  const handleLogin = () => {
    if (loginMethod === 'email') {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
      }
      // Replace with your actual email login logic
      Alert.alert('Login Success', `Logged in with ${email}`);
    } else if (loginMethod === 'sms') {
      if (!phone || !code) {
        Alert.alert('Error', 'Please enter both phone number and code.');
        return;
      }
      // Replace with your actual SMS login logic
      Alert.alert('Login Success', `Logged in with ${phone}`);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      color: '#333',
    },
    methodSwitcher: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: '#e0e0e0',
      borderRadius: 20,
    },
    switchButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 20,
    },
    activeSwitch: {
      backgroundColor: theme.primaryColor,
    },
    switchButtonText: {
      fontSize: 16,
      color: '#333',
    },
    activeSwitchText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    formContainer: {
      width: '100%',
    },
    input: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      fontSize: 16,
    },
    codeInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    codeInput: {
      flex: 1,
      marginRight: 10,
    },
    sendCodeButton: {
      backgroundColor: theme.primaryColor,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    sendCodeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: theme.primaryColor,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    agreementContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    agreementCheckStyle: {
      backgroundColor: '#fffff',
    },
    agreementText: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
    },
    agreementLink: {
      color: '#FF7043',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    biometricButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      width: '100%',
      justifyContent: 'center',
    },
    biometricButtonText: {
      color: '#fff',
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
  }), [theme]);

  const renderEmailForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("login.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.codeInputContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder={i18n.t("login.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.sendCodeButton}>
          <Text style={styles.sendCodeButtonText}>{i18n.t("login.sendCode")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSmsForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("login.phonePlaceholder")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.codeInputContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder={i18n.t("login.passwordPlaceholder")}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.sendCodeButton}>
          <Text style={styles.sendCodeButtonText}>{i18n.t("login.sendCode")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("login.description")}</Text>

      <View style={styles.methodSwitcher}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            loginMethod === 'email' && styles.activeSwitch,
          ]}
          onPress={() => setLoginMethod('email')}>
          <Text
            style={[
              styles.switchButtonText,
              loginMethod === 'email' && styles.activeSwitchText,
            ]}>
            {i18n.t("login.emailLogin")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            loginMethod === 'sms' && styles.activeSwitch,
          ]}
          onPress={() => setLoginMethod('sms')}>
          <Text
            style={[
              styles.switchButtonText,
              loginMethod === 'sms' && styles.activeSwitchText,
            ]}>
            {i18n.t("login.smsLogin")}
          </Text>
        </TouchableOpacity>
      </View>

      {loginMethod === 'email' ? renderEmailForm() : renderSmsForm()}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>{i18n.t("login.login")}</Text>
      </TouchableOpacity>

      {/* Agreement Text */}
      <View style={styles.agreementContainer}>
        <CheckBox
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          containerStyle={styles.agreementCheckStyle}
          tvParallaxProperties={{}}></CheckBox>

        <Text style={styles.agreementText}>
          {i18n.t('login.agreementText')}
        <Text style={styles.agreementText}>
          <Text style={styles.agreementLink}>{i18n.t('login.agreementLink')}</Text> 、
          <Text style={styles.agreementLink}>{i18n.t('login.privacyLink')}</Text>
        </Text>
        </Text>
      </View>

      {isBiometricSupported && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'finger-print' : 'finger-print'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.biometricButtonText}>
            {Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Fingerprint Login'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LoginComponent;
