import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const RecentAnalysis = () => {
  const recentData = [
    {
      id: 1,
      name: '清炒西兰花',
      calories: '78 卡路里',
      time: '今天 12:30',
      icon: '🥬',
    },
    {
      id: 2,
      name: '红烧排骨',
      calories: '450 卡路里',
      time: '今天 08:15',
      icon: '🍖',
    },
    {
      id: 3,
      name: '水煮青菜',
      calories: '45 卡路里',
      time: '昨天 19:20',
      icon: '🥬',
    },
  ];

  const renderAvatar = (icon) => (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{icon}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>最近分析</Text>
      {recentData.map((item) => (
        <ListItem
          key={item.id}
          containerStyle={styles.listItem}
          onPress={() => console.log('View details:', item.name)}
        >
          <ListItem.Content style={styles.listContent}>
            <View style={styles.listRow}>
              {renderAvatar(item.icon)}
              <View style={styles.textContainer}>
                <ListItem.Title style={styles.itemTitle}>
                  {item.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.itemSubtitle}>
                  {item.calories}
                </ListItem.Subtitle>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#e8f5e8',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
});

export default RecentAnalysis;
