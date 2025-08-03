import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootState } from '@/store';
import { Icon } from 'react-native-elements';
import { useTranslation } from '@/hooks/useTranslation';

interface UserComponentProps {
  navigation: any;
}

const UserComponent: React.FC<UserComponentProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, profile } = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleEditProfile = () => {
    // 导航到编辑资料页面
    // navigation.navigate('EditProfile');
    // 暂时只显示提示
    alert(t('profile.editProfileComingSoon'));
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userTextContainer: {
      marginLeft: 15,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 4,
    },
    userDetail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    loginText: {
      color: 'white',
      marginLeft: 5,
      fontWeight: '500',
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    editText: {
      color: 'white',
      marginLeft: 5,
      fontWeight: '500',
    },
  });

  if (!isAuthenticated || !profile) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="rgba(255,255,255,0.5)" tvParallaxProperties={{}} />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{t('profile.guest')}</Text>
            <Text style={styles.userDetail}>{t('profile.loginPrompt')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Icon name="login" size={16} color="white" tvParallaxProperties={{}} />
          <Text style={styles.loginText}>{t('login.login')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {profile.avatar ? (
          <Image 
            source={{ uri: profile.avatar }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="rgba(255,255,255,0.5)" tvParallaxProperties={{}} />
          </View>
        )}
        <View style={styles.userTextContainer}>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userDetail}>
            {profile.email || profile.phone || t('profile.userLoggedIn')}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Icon name="edit" size={16} color="white" tvParallaxProperties={{}} />
        <Text style={styles.editText}>{t('profile.edit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserComponent;