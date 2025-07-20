import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Avatar} from 'react-native-elements';
import ReactAxios from '@/apis/reactAxios.tsx';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { rem } from '@/styles/dimension'

interface CookbookItem {
  id: string;
  name: string;
  favorites: string;
  burdens: string;
  img: string;
}

interface CookbookListResponse {
  data: CookbookItem[];
}

const RecentAnalysis = () => {
  const {theme} = useTheme();
  const [recentData, setRecentData] = useState<CookbookItem[]>([
    {
      id: '1',
      name: '清炒西兰花',
      favorites: '78 卡路里',
      burdens: '今天 12:30',
      img: '🥬',
    },
    {
      id: '2',
      name: '红烧排骨',
      favorites: '450 卡路里',
      burdens: '今天 08:15',
      img: '🍖',
    },
    {
      id: '3',
      name: '水煮青菜',
      favorites: '45 卡路里',
      burdens: '昨天 19:20',
      img: '🥬',
    },
  ]);

  const fetchRecentData = async () => {
    try {
      const response = await ReactAxios.getInstance().get<CookbookListResponse>(
        '/api/food/cookbook-list');
      // 假设返回的数据格式与 recentData 相同
      console.log('Fetched recent data:', response.data);
      setRecentData(response.data.data);
    } catch (error: unknown) {
      console.error('Error fetching recent data:', error);
    }
  };

  useEffect(() => {
    fetchRecentData();
  }, []);

  const styles = React.useMemo(() => StyleSheet.create({
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
    listRow: {
      flexDirection: 'row',
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      marginBottom: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      width: '100%',
      height: rem(60),
    },
    avatar: {
      width: rem(50),
      height: rem(50),
    },
    textContainer: {
      flex: 1,
      marginLeft: rem(10),
    },
    itemTitle: {
      maxWidth: rem(120),
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 4,
    },
    itemSubtitle: {
      maxWidth: rem(80),
      fontSize: 14,
      color: '#666',
    },
    timeText: {
      maxWidth: rem(60),
      fontSize: 12,
      color: '#999',
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>最近分析</Text>
      <FlatList
        data={recentData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listRow}>
            <Avatar rounded source={{uri: item.img}} containerStyle={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle} ellipsizeMode="tail">{item.name}</Text>
              <Text style={styles.itemSubtitle} ellipsizeMode="tail">{item.favorites}</Text>
            </View>
            <Text style={styles.timeText} numberOfLines={2} ellipsizeMode="tail" >{item.burdens}</Text>
          </View>
        )} />
    </View>
  );
};

export default RecentAnalysis;
