import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,

} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import CameraButton from '@/components/Camera/CameraButton.tsx';
import QuickFunctions from '@/components/QuickFunctions.tsx';
import RecentAnalysis from '@/components/RecentAnalysis.tsx';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '@/i18n/i18n.js';
import { rem } from '@/libs/utils';

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchText, setSearchText] = useState<string>('');
  const safeInsets = useSafeAreaInsets();

  const styles = React.useMemo(() => StyleSheet.create({
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
    content: {
      flex: 1,
    },
    searchContainer: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: rem(24),
      paddingVertical: rem(16),
    },
    searchInputContainer: {
      backgroundColor: theme.secondaryColor,
      borderRadius: 25,
      height: rem(48),
      paddingHorizontal: rem(16),
    },
    searchInput: {
      alignItems: 'center',
      textAlignVertical: 'center',
      fontSize: 16,
      color: theme.textPrimary,
    },
    cameraSection: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    cameraText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 20,
      marginBottom: 40,
    },
  }), [theme]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <StatusBar barStyle={theme.textPrimary === '#fff' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, {paddingTop: safeInsets.top}]}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🍽️</Text>
          </View>
          <Text style={styles.title}>{i18n.t('home.title')}</Text>
        </View>
        <Icon name="settings" type="ionicons" size={24} color="#999" onPress={toggleTheme} />
      </View>

      <View style={styles.content} >
        {/* Search Bar */}
        <SearchBar
          placeholder={i18n.t('home.search.placeholder')}
          onChangeText={setSearchText}
          value={searchText}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          searchIcon={{name:'search', size: 20, color: '#999' }}
          clearIcon={{name:'clear', size: 20, color: '#999' }}
        />

        {/* Main Camera Section */}
        <View style={styles.cameraSection}>
          <CameraButton />
          <Text style={styles.cameraText}>{i18n.t('home.camera')}</Text>
          <QuickFunctions />
        </View>

        {/* Recent Analysis */}
        <RecentAnalysis />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
