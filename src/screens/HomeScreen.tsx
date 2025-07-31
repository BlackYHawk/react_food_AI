import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { RootStackScreenProps } from '@/types/navigation';
import CameraButton from '@/components/Camera/CameraButton.tsx';
import QuickFunctions from '@/components/Home/QuickFunctions.tsx';
import NutritionChart from '@/components/NutritionChart';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { rem } from '@/styles/dimension'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/useTranslation';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }: RootStackScreenProps<'Home'>) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const safeInsets = useSafeAreaInsets();
  const { scannedItems, dailyGoals } = useSelector((state: RootState) => state.food);

  // Calculate today's nutrition totals
  const styles = React.useMemo(() => StyleSheet.create({
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: theme.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryColor,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 25,
      height: 25,
      backgroundColor: theme.primaryColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    logoText: {
      fontSize: 18,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    searchContainer: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: rem(24),
      paddingVertical: rem(10),
    },
    searchInputContainer: {
      backgroundColor: theme.secondaryColor,
      borderRadius: 25,
      height: rem(48),
      paddingHorizontal: rem(16),
      justifyContent: 'center',
    },
    searchInput: {
      textAlignVertical: 'center',
      lineHeight: rem(48),
      fontSize: 16,
      color: theme.textPrimary,
      padding: 0,
      margin: 0,
    },
    cameraSection: {
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    cameraText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 20,
      marginBottom: 40,
    },
    settingsButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'transparent',
    },
  }), [theme]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: safeInsets.top }]}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🍽️</Text>
            </View>
            <Text style={styles.title}>{t('home.title')}</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('ChatGroup')}
            activeOpacity={0.7}
          >
            <Icon
              name="notifications"
              type="ionicon"
              size={24}
              color={theme.textSecondary}
              tvParallaxProperties={{}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content} >
          {/* Search Bar */}
          <SearchBar
            placeholder={t('home.search.placeholder')}
            onChangeText={setSearchText}
            value={searchText}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
            searchIcon={{ name: 'search', size: 20, color: '#999' }}
            clearIcon={{ name: 'clear', size: 20, color: '#999' }}
          />

          {/* Main Camera Section */}
          <View style={styles.cameraSection}>
            <CameraButton />
            <Text style={styles.cameraText}>{t('home.camera')}</Text>
            <QuickFunctions />
          </View>

          {/* Daily Nutrition Summary */}
          {scannedItems.length > 0 && (
            <View style={{ marginTop: rem(5) }}>
              <NutritionChart type="daily" chartType="pie" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
