import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';
import { clearFoodHistory } from '@/store/slices/foodSlice';
import i18n from '@/i18n/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = ({ navigation }: RootStackScreenProps<'Settings'>) => {
  const { theme, themeType, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleLogout = () => {
    Alert.alert(
      i18n.t('profile.logout'),
      'Are you sure you want to logout?',
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('profile.logout'),
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
      'Clear Food History',
      'This will permanently delete all your food scan history. This action cannot be undone.',
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => dispatch(clearFoodHistory()),
          style: 'destructive',
        },
      ]
    );
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {i18n.t('profile.settings')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {i18n.t('settings.account')}
            </Text>

            <SettingItem
              icon="person"
              title={userProfile?.name || 'User Profile'}
              subtitle={userProfile?.email}
              onPress={() => {/* Navigate to profile edit */ }}
            />

            <SettingItem
              icon="favorite"
              title={i18n.t('profile.savedRecipes')}
              subtitle="View your saved recipes"
              onPress={() => {/* Navigate to saved recipes */ }}
            />
          </View>
        )}

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {i18n.t('settings.appearance')}
          </Text>

          <SettingItem
            icon="palette"
            title={i18n.t('profile.theme')}
            subtitle={themeType === 'dark' ? 'Dark Mode' : 'Light Mode'}
            showArrow={false}
            rightComponent={
              <Switch
                value={themeType === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primaryColor }}
                thumbColor={themeType === 'dark' ? 'white' : theme.backgroundColor}
              />
            }
          />

          <SettingItem
            icon="language"
            title={i18n.t('profile.language')}
            subtitle="English"
            onPress={() => {/* Navigate to language selection */ }}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {i18n.t('settings.preferences')}
          </Text>

          <SettingItem
            icon="notifications"
            title={i18n.t('profile.notifications')}
            subtitle="Manage notification settings"
            onPress={() => {/* Navigate to notifications */ }}
          />

          <SettingItem
            icon="restaurant-menu"
            title={i18n.t('profile.dietaryRestrictions')}
            subtitle="Set your dietary preferences"
            onPress={() => {/* Navigate to dietary preferences */ }}
          />

          <SettingItem
            icon="fitness-center"
            title="Daily Goals"
            subtitle="Set your nutrition goals"
            onPress={() => {/* Navigate to goals setting */ }}
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {i18n.t('settings.data')}
          </Text>

          <SettingItem
            icon="history"
            title={i18n.t('nutrition.foodHistory')}
            subtitle="View your food scan history"
            onPress={() => navigation.navigate('FoodHistory')}
          />

          <SettingItem
            icon="delete-sweep"
            title="Clear Food History"
            subtitle="Delete all food scan records"
            onPress={handleClearHistory}
          />

          <SettingItem
            icon="cloud-download"
            title="Export Data"
            subtitle="Download your data"
            onPress={() => {/* Handle data export */ }}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {i18n.t('settings.support')}
          </Text>

          <SettingItem
            icon="help"
            title={i18n.t('profile.help')}
            subtitle="Get help and support"
            onPress={() => {/* Navigate to help */ }}
          />

          <SettingItem
            icon="info"
            title={i18n.t('profile.about')}
            subtitle="App version and info"
            onPress={() => {/* Navigate to about */ }}
          />

          <SettingItem
            icon="star-rate"
            title="Rate App"
            subtitle="Rate us on the app store"
            onPress={() => {/* Handle app rating */ }}
          />
        </View>

        {/* Logout Section */}
        {isAuthenticated && (
          <View style={styles.section}>
            <SettingItem
              icon="logout"
              title={i18n.t('profile.logout')}
              subtitle="Sign out of your account"
              onPress={handleLogout}
              showArrow={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
});

export default SettingsScreen;