import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  Avatar,
  Button,
  Icon,
  ListItem,
} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import i18n from '@/i18n/i18n';
import { rem } from '@/libs/utils';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import userData from '@/mock/profile_user_date.json';
import type { RootStackScreenProps } from '@/types/navigation'; // 路径按实际调整

type LoginNavigation = RootStackScreenProps<'Login'>['navigation'];

const ProfileScreen = () => {
  const navigation = useNavigation<LoginNavigation>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const safeInsets = useSafeAreaInsets();

  const showAvatorPreview = () => {
    navigation.navigate('Login');
  };

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
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      borderWidth: 3,
      borderColor: 'white',
    },
    userInfo: {
      marginLeft: 15,
    },
    userName: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    userId: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
      marginTop: 5,
    },
    editButtonContainer: {
      borderRadius: 20,
    },
    editButton: {
      borderColor: 'white',
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    editButtonText: {
      color: 'white',
      fontSize: 14,
    },
    scrollContainer: {
      flex: 1,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.secondaryColor,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statIconContainer: {
      backgroundColor: 'rgba(0, 201, 132, 0.1)',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    statTitle: {
      fontSize: 12,
      color: theme.textPrimary,
      marginBottom: 2,
    },
    statCount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    sectionContainer: {
      backgroundColor: theme.secondaryColor,
      marginBottom: 15,
      paddingTop: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    listItemContainer: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    itemDate: {
      fontSize: 13,
      color: '#999',
      marginTop: 5,
    },
    itemTime: {
      fontSize: 13,
      color: '#999',
      marginTop: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fixedHeader: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: theme.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    fixedHeaderTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor
    }
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.textPrimary === '#fff' ? 'light-content' : 'dark-content'} />

      {/* Animated 顶部标题栏，滑动渐变显示 */}
      <Animated.View style={[styles.fixedHeader,
        { height: headerHeight, paddingTop: safeInsets.top,
          opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
        <Text style={styles.fixedHeaderTitle}>{userData.name}</Text>
      </Animated.View>

      {/* Profile Header */}
      <Animated.View
        style={[
          styles.fixProfileHeader,
          { height: profileHeight, paddingTop: safeInsets.top },
          { opacity: profileOpacity },
          { transform: [{ translateY: profileTranslateY }] }]}
      >
        <View style={styles.profileContainer}>
          <Avatar
            rounded
            size={80}
            source={{ uri: userData.avatar }}
            activeOpacity={0.7}
            onPress={showAvatorPreview}
            containerStyle={styles.avatarContainer}
          >
            <Avatar.Accessory
              size={22}
              color="white"
              backgroundColor="#00C984"
              name="camera"
              type="font-awesome-5"
            />
          </Avatar>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userId}>ID: {userData.id}</Text>
          </View>
        </View>
        <Button
          title={i18n.t('profile.edit')}
          type="outline"
          buttonStyle={styles.editButton}
          titleStyle={styles.editButtonText}
          containerStyle={styles.editButtonContainer}
        />
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollContainer]}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollY } } }
        ], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Stats Section */}
        <View
          style={[styles.statsContainer,
            { paddingTop: profileHeight + 10}]}
        >
          {userData.stats.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <Icon
                name={stat.icon}
                type={stat.type}
                color={stat.color}
                size={24}
                containerStyle={styles.statIconContainer}
              />
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statCount}>{stat.count}</Text>
            </View>
          ))}
        </View>

        {/* Collections Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.collections')}</Text>

          {userData.collections.map((item) => (
            <ListItem key={item.id} containerStyle={styles.listItemContainer}>
              <Image key="image" source={{ uri: item.image }} style={styles.itemImage} />
              <ListItem.Content key="content">
                <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.itemDate}>{item.date}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon key="icon" name="trash" type="font-awesome-5" color="#ccc" size={18} />
            </ListItem>
          ))}
        </View>

        {/* History Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.history')}</Text>

          {userData.history.map((item) => (
            <ListItem key={item.id} containerStyle={styles.listItemContainer}>
              <Image key="history_image" source={{ uri: item.image }} style={styles.itemImage} />
              <ListItem.Content key="history_content">
                <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.itemTime}>
                  <Icon name="clock" type="font-awesome-5" color="#999" size={12} containerStyle={{ marginRight: 5 }} />
                  {item.time} · {item.calories} 千卡
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon key="history_icon" name="times" type="font-awesome-5" color="#ccc" size={18} />
            </ListItem>
          ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
