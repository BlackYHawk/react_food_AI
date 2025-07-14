
import React, { useState, useEffect } from 'react';
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

const LoginComponent = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // email, sms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

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

  const renderEmailForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  );

  const renderSmsForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.codeInputContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.sendCodeButton}>
          <Text style={styles.sendCodeButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

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
            Email
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
            SMS
          </Text>
        </TouchableOpacity>
      </View>

      {loginMethod === 'email' ? renderEmailForm() : renderSmsForm()}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
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

const styles = StyleSheet.create({
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
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendCodeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
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
});

export default LoginComponent;
