import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { rem } from '@/styles/dimension'
import ThemeSwitch from '@/components/Theme/ThemeSwitch';
import {useAppSelector} from '@/hooks/appHooks.tsx';
import UserComponent from '@/components/Login/UserComponent';
import {RootStackScreenProps} from '@/types/navigation';
import SocialCard from '@/components/Section/SocialCard';

const ProfileScreen = ({navigation}: RootStackScreenProps<'Profile'>) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme, themeType } = useTheme();
  const { t } = useTranslation();
  const safeInsets = useSafeAreaInsets();
  const userData = useAppSelector((state) => state.user);

  //顶部标题栏高度
  const headerHeight = rem(50) + safeInsets.top; // 标题栏高度
  // 渐变动画：透明度和位移
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [-headerHeight, 0],
    extrapolate: 'clamp',
  });
  // 头像区域高度
  const profileHeight = rem(100) + safeInsets.top; // 头像区域高度
  //头像区域动画
  const profileOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const profileTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight - rem(50)],
    extrapolate: 'clamp',
  });

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor
    },
    fixProfileHeader: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: theme.primaryColor,
      paddingTop: rem(20),
      paddingBottom: rem(30),
      paddingHorizontal: rem(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex:5,
    },
    scrollContainer: {
      flex: 1,
    },
    sectionContainer: {
      backgroundColor: theme.backgroundColor,
      marginTop: rem(15),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    sectionSettingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      marginTop: rem(15),
    },
    sectionSettingTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 15,
    },
    fixedHeader: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: theme.primaryColor,
      justifyContent: 'center',
      alignItems: 'flex-start',
      zIndex: 10,
    },
    fixedHeaderTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: rem(10),
    },
  }), [theme]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(themeType === 'light' ? 'light-content' : 'dark-content');
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeType === 'light' ? 'light-content' : 'dark-content'} />

      {/* Animated 顶部标题栏，滑动渐变显示 */}
      <Animated.View
        style={[
          styles.fixedHeader, {
            height: headerHeight,
            paddingTop: safeInsets.top,
            opacity: headerOpacity,
            transform: [{translateY: headerTranslateY}],
          },
        ]}>
        <Text style={styles.fixedHeaderTitle}>{userData.name}</Text>
      </Animated.View>

      {/* Profile Header */}
      <Animated.View
        style={[
          styles.fixProfileHeader,
          {height: profileHeight, paddingTop: safeInsets.top},
          {opacity: profileOpacity},
          {transform: [{translateY: profileTranslateY}]},
        ]}>
        <UserComponent navigation={navigation} />
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollContainer]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>

        {/* 社交卡片 */}
        <SocialCard key="social-card" socialStyle={{paddingTop: profileHeight + 10}} />

        {/* 安全Section */}
        <TouchableOpacity 
          style={styles.sectionSettingContainer}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7} >
          <Text style={styles.sectionSettingTitle}>
            {t('profile.settings')}
          </Text>
          <Icon 
            name="chevron-right" 
            type="material" 
            style={{paddingHorizontal: 15}}
            size={30}
            color={theme.textSecondary}
            tvParallaxProperties={{}} />
        </TouchableOpacity>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
