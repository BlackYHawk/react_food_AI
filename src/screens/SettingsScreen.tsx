import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Dimensions, StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';
import { clearFoodHistory } from '@/store/slices/foodSlice';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeSelector from '@/components/Theme/ThemeSelector';
import LanguageSelector from '@/components/Launguage/LanguageSelector';

const SettingsScreen = ({ navigation }: RootStackScreenProps<'Settings'>) => {
  const { theme, themeType, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguageAlias } = useLanguage();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Theme selector state
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('settings.data.clearHistoryConfirmTitle'),
      t('settings.data.clearHistoryConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.clear'),
          onPress: () => dispatch(clearFoodHistory()),
          style: 'destructive',
        },
      ]
    );
  };

  const handleThemeSelection = () => {
    setShowThemeSelector(true);
  };

  const handleCloseThemeSelector = () => {
    setShowThemeSelector(false);
  };

  // Get the display name of the current theme
  const getCurrentThemeName = () => {
    return theme?.name || (theme.isDark ? t('settings.theme.darkMode') : t('settings.theme.lightMode'));
  };

  const handleLanguageChange = () => {
    setShowLanguageSelector(true);
  };

  const handleCloseLanguageSelector = () => {
    setShowLanguageSelector(false);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={theme.primaryColor} tvParallaxProperties={{}} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightComponent || (showArrow && (
        <Icon name="chevron-right" size={20} color={theme.textLight} tvParallaxProperties={{}} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top }]}>
      <StatusBar barStyle={themeType === 'light' ? 'dark-content' : 'light-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {t('profile.settings')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              {t('settings.account')}
            </Text>

            <SettingItem
              icon="person"
              title={userProfile?.name || t('settings.userProfile')}
              subtitle={userProfile?.email}
              onPress={() => {/* Navigate to profile edit */ }}
            />

            <SettingItem
              icon="favorite"
              title={t('profile.savedRecipes')}
              subtitle={t('settings.viewSavedRecipes')}
              onPress={() => {/* Navigate to saved recipes */ }}
            />
          </View>
        )}

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.appearance')}
          </Text>

          <SettingItem
            icon={theme.isDark ? 'dark-mode' : 'light-mode'}
            title={t('settings.theme.title')}
            subtitle={theme.isDark ? t('settings.theme.darkMode') : t('settings.theme.lightMode')}
            showArrow={false}
            rightComponent={
              <Switch
                value={theme.isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primaryColor }}
                thumbColor={theme.isDark ? 'white' : theme.backgroundColor}
              />
            }
          />

          <SettingItem
            icon="palette"
            title={t('settings.skin.title')}
            subtitle={getCurrentThemeName()}
            onPress={handleThemeSelection}
          />

          <SettingItem
            icon="language"
            title={t('settings.language.title')}
            subtitle={currentLanguageAlias}
            onPress={handleLanguageChange}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.preferences')}
          </Text>

          <SettingItem
            icon="notifications"
            title={t('profile.notifications')}
            subtitle={t('settings.manageNotifications')}
            onPress={() => {/* Navigate to notifications */ }}
          />

          <SettingItem
            icon="restaurant-menu"
            title={t('profile.dietaryRestrictions')}
            subtitle={t('settings.setDietaryPrefs')}
            onPress={() => {/* Navigate to dietary preferences */ }}
          />

          <SettingItem
            icon="fitness-center"
            title={t('settings.dailyGoals')}
            subtitle={t('settings.setNutritionGoals')}
            onPress={() => {/* Navigate to goals setting */ }}
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.data.title')}
          </Text>

          <SettingItem
            icon="history"
            title={t('settings.data.foodHistory')}
            subtitle={t('settings.data.foodHistorySub')}
            onPress={() => navigation.navigate('FoodHistory')}
          />

          <SettingItem
            icon="delete-sweep"
            title={t('settings.data.clearHistory')}
            subtitle={t('settings.data.clearHistorySub')}
            onPress={handleClearHistory}
          />

          <SettingItem
            icon="cloud-download"
            title={t('settings.data.exportData')}
            subtitle={t('settings.data.exportDataSub')}
            onPress={() => {/* Handle data export */ }}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.support')}
          </Text>

          <SettingItem
            icon="help"
            title={t('profile.help')}
            subtitle={t('settings.getHelp')}
            onPress={() => {/* Navigate to help */ }}
          />

          <SettingItem
            icon="info"
            title={t('profile.about')}
            subtitle={t('settings.appInfo')}
            onPress={() => {/* Navigate to about */ }}
          />

          <SettingItem
            icon="star-rate"
            title={t('settings.rateApp')}
            subtitle={t('settings.rateAppSub')}
            onPress={() => {/* Handle app rating */ }}
          />
        </View>

        {/* Logout Section */}
        {isAuthenticated && (
          <View style={styles.section}>
            <SettingItem
              icon="logout"
              title={t('profile.logout')}
              subtitle={t('settings.signOut')}
              onPress={handleLogout}
              showArrow={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Theme selector modal */}
      <Modal
        visible={showThemeSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        onRequestClose={handleCloseThemeSelector}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <ThemeSelector onClose={handleCloseThemeSelector} />
          </View>
        </View>
      </Modal>

      {/* Language selector modal */}
      <Modal
        visible={showLanguageSelector}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseLanguageSelector}
      >
        <View style={styles.languageModalOverlay}>
          <View style={[styles.languageModalContainer, { backgroundColor: theme.backgroundColor }]}>
            <LanguageSelector onClose={handleCloseLanguageSelector} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  // Language selector styles
  languageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  languageModalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.7,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default SettingsScreen;