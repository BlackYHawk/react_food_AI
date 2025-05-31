import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView, useColorScheme,
} from 'react-native';
import {
  Avatar,
  Button,
  Icon,
  ListItem
} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import i18n from '../i18n/i18n';

const ProfileScreen = () => {
  const navigation = useNavigation();

  // Mock data
  const userData = {
    name: '陈美琪',
    id: '888666',
    avatar: 'https://example.com/avatar.jpg',
    stats: [
      { id: 1, icon: 'heart', type: 'font-awesome', color: '#00C984', title: '我的收藏', count: 28 },
      { id: 2, icon: 'history', type: 'font-awesome', color: '#00C984', title: '浏览记录', count: 156 },
      { id: 3, icon: 'star', type: 'font-awesome', color: '#00C984', title: '我的评价', count: 46 },
      { id: 4, icon: 'thumbs-up', type: 'font-awesome', color: '#00C984', title: '获赞', count: 198 },
    ],
    collections: [
      { id: 1, title: '香煎三文鱼', date: '2024-01-15', image: 'https://example.com/salmon.jpg' },
      { id: 2, title: '和牛牛排', date: '2024-01-14', image: 'https://example.com/steak.jpg' },
    ],
    history: [
      { id: 1, title: '日式拉面', time: '10:30', calories: 480, image: 'https://example.com/ramen.jpg' },
      { id: 2, title: '意大利面', time: '昨天', calories: 520, image: 'https://example.com/pasta.jpg' },
    ]
  };
  const isDarkMode = useColorScheme() === 'dark';
  const safeInsets = useSafeAreaInsets();
  const showAvatorPreview = () => {
    navigation.navigate('Login', {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Profile Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
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
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
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
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.itemDate}>{item.date}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon
                name="trash"
                type="font-awesome-5"
                color="#ccc"
                size={18}
              />
            </ListItem>
          ))}
        </View>

        {/* History Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.history')}</Text>

          {userData.history.map((item) => (
            <ListItem key={item.id} containerStyle={styles.listItemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.itemTime}>
                  <Icon
                    name="clock"
                    type="font-awesome-5"
                    color="#999"
                    size={12}
                    containerStyle={{ marginRight: 5 }}
                  />
                  {item.time} · {item.calories} 千卡
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon
                name="times"
                type="font-awesome-5"
                color="#ccc"
                size={18}
              />
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#00C984',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: 'white',
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 15,
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
    color: '#333',
    marginBottom: 2,
  },
  statCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
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
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#00C984',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavText: {
    fontSize: 12,
    color: '#00C984',
    marginTop: 4,
  },
});

export default ProfileScreen;
