import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import i18n from '@/i18n/i18n';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import ThemeSwitch from '@/components/Theme/ThemeSwitch';
import {useAppSelector} from '@/hooks/appHooks.tsx';
import UserComponent from '@/components/Login/UserComponent';
import {RootStackScreenProps} from '@/types/navigation';
import SocialCard from '../components/Section/SocialCard';

const ProfileScreen = ({navigation}: RootStackScreenProps<'Profile'>) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme, isLightTheme } = useTheme();
  const safeInsets = useSafeAreaInsets();
  const userData = useAppSelector((state) => state.user);

  //顶部标题栏高度
  const headerHeight = theme.rem(50) + safeInsets.top; // 标题栏高度
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
  const profileHeight = theme.rem(100) + safeInsets.top; // 头像区域高度
  //头像区域动画
  const profileOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const profileTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight - theme.rem(50)],
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
      paddingTop: theme.rem(20),
      paddingBottom: theme.rem(30),
      paddingHorizontal: theme.rem(20),
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
      marginTop: theme.rem(15),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 15,
      marginBottom: 10,
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
      marginLeft: theme.rem(10),
    },
  }), [theme]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(isLightTheme ? 'light-content' : 'dark-content');
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isLightTheme ? 'light-content' : 'dark-content'} />

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

        {/* 主题Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {i18n.t('profile.theme.title')}
          </Text>
          <ThemeSwitch />
        </View>

        {/* 安全Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {i18n.t('profile.security.title')}
          </Text>
          <ThemeSwitch />
        </View>

        {/* Collections Section */}
        {/*<View style={styles.sectionContainer}>*/}
        {/*  <Text style={styles.sectionTitle}>*/}
        {/*    {i18n.t('profile.collections')}*/}
        {/*  </Text>*/}

        {/*  {userData.collections.map(item => (*/}
        {/*    <ListItem key={item.id} containerStyle={styles.listItemContainer}>*/}
        {/*      <Image*/}
        {/*        key="image"*/}
        {/*        source={{uri: item.image}}*/}
        {/*        style={styles.itemImage}*/}
        {/*      />*/}
        {/*      <ListItem.Content key="content">*/}
        {/*        <ListItem.Title style={styles.itemTitle}>*/}
        {/*          {item.title}*/}
        {/*        </ListItem.Title>*/}
        {/*        <ListItem.Subtitle style={styles.itemDate}>*/}
        {/*          {item.date}*/}
        {/*        </ListItem.Subtitle>*/}
        {/*      </ListItem.Content>*/}
        {/*      <Icon*/}
        {/*        key="icon"*/}
        {/*        name="trash"*/}
        {/*        type="font-awesome-5"*/}
        {/*        color="#ccc"*/}
        {/*        size={18}*/}
        {/*      />*/}
        {/*    </ListItem>*/}
        {/*  ))}*/}
        {/*</View>*/}

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
