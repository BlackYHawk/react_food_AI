import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AnimatedIOPSlide from '@/components/AnimatedIOPSlide.tsx';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import i18n from '@/i18n/i18n';
import ReactAxios from '@/apis/reactAxios.tsx';

interface CookbookItem {
  name: string;
  id: string;
  img: string;
  all_click: string;
  favorites: string;
  uri: string;
  is_fine: number;
  has_make_img: number;
  is_exclusive: string;
  burdens: string;
}

interface CookbookListResponse {
  data: CookbookItem[];
}

const RecipesScreen = () => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('分类');
  const tabs = ['分类', '品牌', '评价', '综合', '外卖'];
  const safeInsets = useSafeAreaInsets();
  const [iopData, setIOPData] = useState<CookbookItem[]>([
    {
      "name": "\u5c0f\u7092\u725b\u8089",
      "id": "785855",
      "img": "http://s1.cdn.jiaonizuocai.com/videoImg/201510/1313/561c9a314c8bb.jpg/OTAweDYwMA",
      "all_click": "961.2\u4e07",
      "favorites": "6.0\u4e07",
      "uri": "dishInfo.app?code=78602371",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "2",
      "burdens": "\u9752\u849c\u3001\u5c0f\u7c73\u6912\u3001\u725b\u91cc\u810a\u3001\u9e21\u86cb\u6e05\u3001\u9999\u83dc\u6897\u3001\u8471\u3001\u59dc"
    }, {
      "name": "\u7ea2\u70e7\u8089",
      "id": "785834",
      "img": "http://s1.cdn.jiaonizuocai.com/videoImg/201510/1311/561c79f4d4e14.jpg/OTAweDYwMA",
      "all_click": "3672.3\u4e07",
      "favorites": "10.0\u4e07",
      "uri": "dishInfo.app?code=78600271",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "2",
      "burdens": "\u4e94\u82b1\u8089"
    }, {
      "name": "\u7cd6\u918b\u6392\u9aa8",
      "id": "786082",
      "img": "http://s1.cdn.jiaonizuocai.com/videoImg/201509/0722/55ed97982b6fc.JPG/OTAweDYwMA",
      "all_click": "3334.9\u4e07",
      "favorites": "20.4\u4e07",
      "uri": "dishInfo.app?code=78625071",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "2",
      "burdens": "\u6392\u9aa8"
    }, {
      "name": "\u6e05\u84b8\u9c7c",
      "id": "778816",
      "img": "http://s1.cdn.jiaonizuocai.com/caipu/201508/3113/311354095180.jpg/OTAweDYwMA",
      "all_click": "1358.8\u4e07",
      "favorites": "7.0\u4e07",
      "uri": "dishInfo.app?code=77898471",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "2",
      "burdens": "\u8349\u9c7c"
    }, {
      "name": "\u897f\u7ea2\u67ff\u7092\u9e21\u86cb",
      "id": "801048",
      "img": "http://s1.cdn.jiaonizuocai.com/caipu/201601/1914/191406289.jpg/OTAweDYwMA",
      "all_click": "624.1\u4e07",
      "favorites": "3.1\u4e07",
      "uri": "dishInfo.app?code=80121673",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "9",
      "burdens": "\u9e21\u86cb\u3001\u9999\u83dc\u3001\u897f\u7ea2\u67ff\u3001\u8471\u3001\u5927\u849c"
    }, {
      "name": "\u849c\u9999\u6392\u9aa8",
      "id": "780819",
      "img": "http://s1.cdn.jiaonizuocai.com/videoImg/201509/0722/55eda07f5974c.JPG/OTAweDYwMA",
      "all_click": "949.4\u4e07",
      "favorites": "5.7\u4e07",
      "uri": "dishInfo.app?code=78098771",
      "is_fine": 1,
      "has_make_img": 1,
      "is_exclusive": "2",
      "burdens": "\u6392\u9aa8"
    },
  ]);

  const fetchIOPData = async () => {
    try {
      const response = await ReactAxios.getInstance().get<CookbookListResponse>(
        '/food/cookbook-list');
      // 假设返回的数据格式与 recentData 相同
      console.log('Fetched recent data:', response.data);
      setIOPData(response.data.data);
    } catch (error: unknown) {
      console.error('Error fetching recent data:', error);
    }
  };

  useEffect(() => {
    fetchIOPData();
  }, []);

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
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryColor,
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 15,
    },
    selectedTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.primaryColor,
    },
    tabText: {
      fontSize: 14,
      color: theme.textLight,
    },
    selectedTabText: {
      color: theme.primaryColor,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    sectionContainer: {
      marginTop: 5,
      backgroundColor: theme.secondaryColor,
      paddingVertical: 15,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingHorizontal: 15,
      marginBottom: 10,
      color: theme.textPrimary,
    },
    moreText: {
      fontSize: 12,
      color: theme.primaryColor,
    },
    recommendCard: {
      margin: 15,
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
    },
    horizontalList: {
      paddingLeft: 15,
    },
    foodCard: {
      width: 120,
      marginRight: 15,
    },
    foodImage: {
      width: 120,
      height: 90,
      borderRadius: 8,
    },
    foodName: {
      fontSize: 14,
      marginTop: 5,
      color: theme.textPrimary,
    },
    foodRating: {
      fontSize: 12,
      color: theme.textLight,
      marginTop: 2,
    },
    recentItem: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryColor,
      alignItems: 'center',
    },
    recentImage: {
      width: 60,
      height: 60,
      borderRadius: 6,
    },
    recentInfo: {
      flex: 1,
      marginLeft: 15,
    },
    recentName: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    recentRating: {
      fontSize: 12,
      color: theme.textLight,
      marginTop: 5,
    },
    recentViews: {
      fontSize: 12,
      color: theme.textLight,
    },
  }), [theme]);

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        <Text style={styles.title}>{i18n.t('recipes.title')}</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => setSelectedTab(tab)}>
            <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Content */}
      <ScrollView style={styles.content}>
        {/* Today's Recommendation */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>今日推荐</Text>
          <AnimatedIOPSlide data={iopData} cardStyle={styles.recommendCard} />
        </View>

        {/* Popular Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>精选产品</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>查看更多 &gt;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {/* Food Item 1 */}
            <TouchableOpacity style={styles.foodCard}>
              <Image
                source={{ uri: 'https://example.com/food1.jpg' }}
                style={styles.foodImage}
              />
              <Text style={styles.foodName}>红烧茄子</Text>
              <Text style={styles.foodRating}>4.5 • 21分钟</Text>
            </TouchableOpacity>

            {/* Food Item 2 */}
            <TouchableOpacity style={styles.foodCard}>
              <Image
                source={{ uri: 'https://example.com/food2.jpg' }}
                style={styles.foodImage}
              />
              <Text style={styles.foodName}>日式天妇罗</Text>
              <Text style={styles.foodRating}>4.7 • 27分钟</Text>
            </TouchableOpacity>

            {/* Food Item 3 */}
            <TouchableOpacity style={styles.foodCard}>
              <Image
                source={{ uri: 'https://example.com/food3.jpg' }}
                style={styles.foodImage}
              />
              <Text style={styles.foodName}>麻辣香锅</Text>
              <Text style={styles.foodRating}>4.6 • 30分钟</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Views */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>最近浏览</Text>

          {/* Recent Item 1 */}
          <TouchableOpacity style={styles.recentItem}>
            <Image
              source={{ uri: 'https://example.com/recent1.jpg' }}
              style={styles.recentImage}
            />
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>菌大扁松紧面窝</Text>
              <Text style={styles.recentRating}>4.3 • 25分钟</Text>
            </View>
            <Text style={styles.recentViews}>323评</Text>
          </TouchableOpacity>

          {/* Recent Item 2 */}
          <TouchableOpacity style={styles.recentItem}>
            <Image
              source={{ uri: 'https://example.com/recent2.jpg' }}
              style={styles.recentImage}
            />
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>香火虾的做法</Text>
              <Text style={styles.recentRating}>4.7 • 18分钟</Text>
            </View>
            <Text style={styles.recentViews}>429评</Text>
          </TouchableOpacity>

          {/* Recent Item 3 */}
          <TouchableOpacity style={styles.recentItem}>
            <Image
              source={{ uri: 'https://example.com/recent3.jpg' }}
              style={styles.recentImage}
            />
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>生汁肉牛牛</Text>
              <Text style={styles.recentRating}>4.7 • 16分钟</Text>
            </View>
            <Text style={styles.recentViews}>423评</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipesScreen;
