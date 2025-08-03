import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackScreenProps} from '@/types/navigation';
import AnimatedIOPSlide from '@/components/AnimatedIOPSlide.tsx';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import { rem } from '@/styles/dimension'
import { useTranslation } from '@/hooks/useTranslation';
import cookIopData from '@/mock/cookbook.json';
import cookHotcatData from '@/mock/cookbook-hotcat.json';

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

interface CookbookCatItem {
  id: string;
  img: string;
  name: string;
}

//今日推荐数据接口
interface CookbookListResponse {
  data: CookbookItem[];
}

//精选食谱数据接口
interface CookbookCatListResponse {
  data: CookbookCatItem[];
}

const RecipesScreen = ({navigation} : RootStackScreenProps<'Recipes'>) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('分类');
  const tabs = ['分类', '品牌', '评价', '综合', '外卖'];
  const safeInsets = useSafeAreaInsets();
  const [iopData, setIOPData] = useState<CookbookItem[]>( cookIopData.data as CookbookItem[]);
  const [hotCatData, setHotCatData] = useState<CookbookCatItem[]>(cookHotcatData.data as CookbookCatItem[]);

  // 获取今日推荐数据
  const fetchIOPData = async () => {
    try {
      // 使用模拟数据，避免网络错误
      console.log('Using mock data for recipes');
      // 保持现有的模拟数据
    } catch (error: unknown) {
      console.error('Error fetching recent data:', error);
    }
  };

  // 获取精选食谱数据
  const fetchHotCatData = async () => {
    try {
      // 使用模拟数据，避免网络错误
      console.log('Using mock data for categories');
      // 保持现有的模拟数据
    } catch (error: unknown) {
      console.error('Error fetching hot data:', error);
    }
  };

  useEffect(() => {
    fetchIOPData();
    fetchHotCatData();
  }, []);

  const styles = React.useMemo(() => StyleSheet.create({
    header: {
      flexDirection: 'row',
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
      paddingVertical: 5,
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

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, [navigation])
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        <Icon name="food-bank" type="material" size={24} color="#333" />
        <Text style={styles.title}>{t('recipes.title')}</Text>
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
          <AnimatedIOPSlide data={hotCatData} cardStyle={styles.recommendCard} />
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
