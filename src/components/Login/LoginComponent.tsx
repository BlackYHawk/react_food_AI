import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckBox, Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/userSlice';
import { useNavigation } from '@react-navigation/native';

const LoginComponent = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Login method states
  const [loginMethod, setLoginMethod] = useState('email'); // email, phone, biometric
  const [biometricType, setBiometricType] = useState<'faceId' | 'touchId' | 'fingerprint' | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Biometric states
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isFaceIdSupported, setIsFaceIdSupported] = useState(false);
  const [isTouchIdSupported, setIsTouchIdSupported] = useState(false);

  // Check biometric support on component mount
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  // Countdown timer for SMS code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Check what biometric methods are available
  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      
      if (compatible) {
        const enrolledLevel = await LocalAuthentication.isEnrolledAsync();
        if (!enrolledLevel) return;
        
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        // Check for Face ID (iOS)
        if (Platform.OS === 'ios' && supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setIsFaceIdSupported(true);
          setBiometricType('faceId');
        } 
        // Check for Touch ID (iOS) or Fingerprint (Android)
        else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          if (Platform.OS === 'ios') {
            setIsTouchIdSupported(true);
            setBiometricType('touchId');
          } else {
            setIsTouchIdSupported(true);
            setBiometricType('fingerprint');
          }
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  // Handle biometric authentication
  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        Alert.alert(
          t('login.biometricNotAvailable'),
          t('login.biometricNotEnrolled')
        );
        setIsLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('login.biometricPrompt'),
        cancelLabel: t('common.cancel'),
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Mock successful login with biometric
        const mockUser = {
          id: 'bio-user-123',
          name: 'Biometric User',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          loginMethods: {
            email: false,
            phone: false,
            touchId: biometricType === 'touchId',
            faceId: biometricType === 'faceId',
          },
          preferredLoginMethod: biometricType === 'faceId' ? 'faceId' : 'touchId',
          dietaryPreferences: ['Low Carb', 'High Protein'],
          allergies: [],
        };
        
        // 登录成功
        dispatch(login(mockUser));
        
        // 显示成功消息
        Alert.alert(
          t('login.loginSuccess') || '登录成功',
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                // 点击确认后返回上一页
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert(t('login.loginFailed') || '登录失败');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert(t('login.loginFailed') || '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending verification code for phone login
  const handleSendCode = () => {
    if (!phone || phone.length < 10) {
      Alert.alert(t('login.error'), 'Please enter a valid phone number');
      return;
    }
    
    // Mock sending verification code
    setIsLoading(true);
    setTimeout(() => {
      setCodeSent(true);
      setCountdown(60); // 60 seconds countdown
      setIsLoading(false);
      Alert.alert(t('login.verificationCodeSent'));
    }, 1500);
  };

  // Handle login with email/password or phone/code
  const handleLogin = () => {
    if (!privacyChecked) {
      Alert.alert(t('login.error'), 'Please agree to the terms and privacy policy');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (loginMethod === 'email') {
        if (!email || !password) {
          Alert.alert(t('login.error'), 'Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        
        // Mock email login
        setTimeout(() => {
          const mockUser = {
            id: 'email-user-123',
            name: 'Email User',
            email: email,
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            loginMethods: {
              email: true,
              phone: false,
              touchId: false,
              faceId: false,
            },
            preferredLoginMethod: 'email',
            dietaryPreferences: ['Vegetarian'],
            allergies: ['Nuts'],
          };
          
          dispatch(login(mockUser));
          setIsLoading(false);
          
          // 显示成功消息
          Alert.alert(
            t('login.loginSuccess') || '登录成功',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // 点击确认后返回上一页
                  navigation.goBack();
                }
              }
            ]
          );
        }, 1500);
      } 
      else if (loginMethod === 'phone') {
        if (!phone || !code) {
          Alert.alert(t('login.error'), 'Please enter both phone number and verification code.');
          setIsLoading(false);
          return;
        }
        
        if (!codeSent) {
          Alert.alert(t('login.error'), 'Please send verification code first.');
          setIsLoading(false);
          return;
        }
        
        // Mock phone login
        setTimeout(() => {
          const mockUser = {
            id: 'phone-user-123',
            name: 'Phone User',
            phone: phone,
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            loginMethods: {
              email: false,
              phone: true,
              touchId: false,
              faceId: false,
            },
            preferredLoginMethod: 'phone',
            dietaryPreferences: ['Keto', 'Gluten-Free'],
            allergies: ['Dairy'],
          };
          
          dispatch(login(mockUser));
          setIsLoading(false);
          
          // 显示成功消息
          Alert.alert(
            t('login.loginSuccess') || '登录成功',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // 点击确认后返回上一页
                  navigation.goBack();
                }
              }
            ]
          );
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      Alert.alert(t('login.loginFailed'));
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      color: theme.textPrimary,
    },
    methodSwitcher: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: theme.secondaryColor,
      borderRadius: 20,
      width: '100%',
    },
    switchButton: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    activeSwitch: {
      backgroundColor: theme.primaryColor,
    },
    switchButtonText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 5,
    },
    activeSwitchText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    formContainer: {
      width: '100%',
      marginBottom: 20,
    },
    input: {
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
      fontSize: 16,
      color: theme.textPrimary,
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
      minWidth: 100,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: theme.textLight,
      opacity: 0.7,
    },
    sendCodeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    forgotPasswordText: {
      color: theme.primaryColor,
      fontSize: 14,
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
      marginTop: 15,
      width: '100%',
    },
    agreementCheckStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      margin: 0,
    },
    agreementText: {
      fontSize: 12,
      color: theme.textSecondary,
      flex: 1,
    },
    agreementLink: {
      color: theme.primaryColor,
      fontWeight: 'bold',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
      width: '100%',
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textSecondary,
      paddingHorizontal: 10,
      fontSize: 14,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
      width: '100%',
    },
    socialButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    signupContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    signupText: {
      color: theme.textSecondary,
      marginRight: 5,
    },
    signupLink: {
      color: theme.primaryColor,
      fontWeight: 'bold',
    },
    biometricContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 20,
    },
    biometricOption: {
      alignItems: 'center',
      marginHorizontal: 20,
    },
    biometricIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    biometricText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    noBiometricText: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 30,
    },
  }), [theme]);

  // These functions are defined later in the code, removing duplicates

  // Render email login form
  const renderEmailForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={t("login.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t("login.passwordPlaceholder")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>{t("login.forgotPassword")}</Text>
      </TouchableOpacity>
    </View>
  );

  // Render phone login form
  const renderPhoneForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={t("login.phonePlaceholder")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.codeInputContainer}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder={t("login.codePlaceholder")}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity 
          style={[
            styles.sendCodeButton,
            (countdown > 0 || !phone) && styles.disabledButton
          ]}
          onPress={handleSendCode}
          disabled={countdown > 0 || !phone}
        >
          <Text style={styles.sendCodeButtonText}>
            {countdown > 0 ? `${countdown}s` : t("login.sendCode")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render biometric login options
  const renderBiometricOptions = () => (
    <View style={styles.biometricContainer}>
      {isFaceIdSupported && (
        <TouchableOpacity 
          style={styles.biometricOption}
          onPress={() => {
            setBiometricType('faceId');
            handleBiometricLogin();
          }}
        >
          <View style={styles.biometricIconContainer}>
            <Icon name="face-recognition" type="material-community" size={40} color={theme.primaryColor} tvParallaxProperties={{}} />
          </View>
          <Text style={styles.biometricText}>{t("login.faceIdLogin")}</Text>
        </TouchableOpacity>
      )}
      
      {isTouchIdSupported && (
        <TouchableOpacity 
          style={styles.biometricOption}
          onPress={() => {
            setBiometricType(Platform.OS === 'ios' ? 'touchId' : 'fingerprint');
            handleBiometricLogin();
          }}
        >
          <View style={styles.biometricIconContainer}>
            <Icon name="fingerprint" size={40} color={theme.primaryColor} tvParallaxProperties={{}} />
          </View>
          <Text style={styles.biometricText}>
            {Platform.OS === 'ios' ? t("login.touchIdLogin") : t("login.fingerprintLogin")}
          </Text>
        </TouchableOpacity>
      )}
      
      {!isFaceIdSupported && !isTouchIdSupported && (
        <Text style={styles.noBiometricText}>{t("login.biometricNotAvailable")}</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("login.description")}</Text>
        
        {/* Login Method Tabs */}
        <View style={styles.methodSwitcher}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginMethod === 'email' && styles.activeSwitch,
            ]}
            onPress={() => setLoginMethod('email')}>
            <Icon 
              name="email" 
              size={20} 
              color={loginMethod === 'email' ? 'white' : theme.textSecondary} 
              tvParallaxProperties={{}}
            />
            <Text
              style={[
                styles.switchButtonText,
                loginMethod === 'email' && styles.activeSwitchText,
              ]}>
              {t("login.emailLogin")}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginMethod === 'phone' && styles.activeSwitch,
            ]}
            onPress={() => setLoginMethod('phone')}>
            <Icon 
              name="phone" 
              size={20} 
              color={loginMethod === 'phone' ? 'white' : theme.textSecondary} 
              tvParallaxProperties={{}}
            />
            <Text
              style={[
                styles.switchButtonText,
                loginMethod === 'phone' && styles.activeSwitchText,
              ]}>
              {t("login.smsLogin")}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginMethod === 'biometric' && styles.activeSwitch,
            ]}
            onPress={() => setLoginMethod('biometric')}>
            <Icon 
              name={Platform.OS === 'ios' && isFaceIdSupported ? 'face-recognition' : 'fingerprint'} 
              type={Platform.OS === 'ios' && isFaceIdSupported ? 'material-community' : 'material'} 
              size={20} 
              color={loginMethod === 'biometric' ? 'white' : theme.textSecondary} 
              tvParallaxProperties={{}}
            />
            <Text
              style={[
                styles.switchButtonText,
                loginMethod === 'biometric' && styles.activeSwitchText,
              ]}>
              {t("login.biometricLogin")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Forms */}
        {loginMethod === 'email' && renderEmailForm()}
        {loginMethod === 'phone' && renderPhoneForm()}
        {loginMethod === 'biometric' && renderBiometricOptions()}

        {/* Login Button (only for email and phone) */}
        {(loginMethod === 'email' || loginMethod === 'phone') && (
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>{t("login.login")}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Agreement Checkbox */}
        <View style={styles.agreementContainer}>
          <CheckBox
            checked={privacyChecked}
            onPress={() => setPrivacyChecked(!privacyChecked)}
            checkedIcon="check-square-o"
            uncheckedIcon="square-o"
            containerStyle={styles.agreementCheckStyle}
            tvParallaxProperties={{}}
          />
          <Text style={styles.agreementText}>
            {t('login.agreementText')}
            <Text style={styles.agreementLink}>{t('login.agreementLink')}</Text>
            {' '}&{' '}
            <Text style={styles.agreementLink}>{t('login.privacyLink')}</Text>
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{t('login.orContinueWith')}</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Options */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" type="font-awesome" size={20} color="#DB4437" tvParallaxProperties={{}} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="facebook" type="font-awesome" size={20} color="#4267B2" tvParallaxProperties={{}} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="apple" type="font-awesome" size={20} color="#000000" tvParallaxProperties={{}} />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{t('login.noAccount')}</Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>{t('login.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginComponent;
