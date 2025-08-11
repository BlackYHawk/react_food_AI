import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootState } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';

interface SocialCardProps {
  socialStyle?: any;
}

const SocialCard: React.FC<SocialCardProps> = ({ socialStyle }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      marginHorizontal: 15,
      marginVertical: 10,
      padding: 15,
      ...socialStyle,
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    socialItem: {
      alignItems: 'center',
    },
    socialCount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 5,
    },
    socialLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    notLoggedInContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    notLoggedInText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    loginButton: {
      backgroundColor: theme.primaryColor,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    loginButtonText: {
      color: 'white',
      fontWeight: '500',
    },
  });

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>{t('profile.loginToViewSocial')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.socialRow}>
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>128</Text>
          <Text style={styles.socialLabel}>{t('profile.following')}</Text>
        </View>
        
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>3.2k</Text>
          <Text style={styles.socialLabel}>{t('profile.followers')}</Text>
        </View>
        
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>26</Text>
          <Text style={styles.socialLabel}>{t('profile.posts')}</Text>
        </View>
        
        <View style={styles.socialItem}>
          <Text style={styles.socialCount}>156</Text>
          <Text style={styles.socialLabel}>{t('profile.rate')}</Text>
        </View>
      </View>
    </View>
  );
};

export default SocialCard;