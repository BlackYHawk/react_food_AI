import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const RecipesScreen = () => {
  const [selectedTab, setSelectedTab] = useState('分类');
  const tabs = ['分类', '品牌', '评价', '综合', '外卖'];
  const safeInsets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        <Text style={styles.logo}>美食食谱</Text>
        <Icon name="menu-outline" size={24} color="#333" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索菜品名称，材料"
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Content */}
      <ScrollView style={styles.content}>
        {/* Today's Recommendation */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>今日推荐</Text>
          <View style={styles.recommendCard}>
            <Image
              source={{ uri: 'https://example.com/fish_image.jpg' }}
              style={styles.recommendImage}
            />
            <View style={styles.recommendInfo}>
              <Text style={styles.recommendName}>红烧鱼</Text>
              <Text style={styles.recommendTime}>烹饪时间: 25分钟</Text>
            </View>
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  selectedTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 15,
    backgroundColor: 'white',
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
  },
  moreText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  recommendCard: {
    margin: 15,
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  recommendImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  recommendInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  recommendName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendTime: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
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
  },
  foodRating: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  recentItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  },
  recentRating: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  recentViews: {
    fontSize: 12,
    color: '#999',
  },
});

export default RecipesScreen;
