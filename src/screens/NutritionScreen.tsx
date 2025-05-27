import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const NutritionScreen = () => {
  // Mock data for the chart
  const chartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        data: [1800, 1900, 1850, 2200, 1500, 1400, 2000],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };
  const safeInsets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/book-icon.png')}
            style={styles.bookIcon}
          />
          <Text style={styles.logoText}>美味食谱</Text>
        </View>
        <Icon name="menu-outline" size={24} color="#333" />
      </View>

      <ScrollView style={styles.content}>
        {/* Title Section */}
        <Text style={styles.titleText}>营养摄入</Text>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity style={styles.dateOption}>
            <Text style={styles.dateOptionText}>日</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dateOption, styles.activeDateOption]}>
            <Text style={styles.activeDateOptionText}>周</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateOption}>
            <Text style={styles.dateOptionText}>月</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie Stats */}
        <View style={styles.calorieStats}>
          {/* Current Intake */}
          <View style={styles.calorieBox}>
            <View style={styles.calorieHeader}>
              <Icon name="silverware-fork-knife" size={18} color="#4CAF50" />
              <Text style={styles.calorieLabel}>已摄入</Text>
            </View>
            <View style={styles.calorieValue}>
              <Text style={styles.calorieNumber}>1,847</Text>
              <Text style={styles.calorieUnit}>千卡</Text>
            </View>
            <Text style={styles.calorieChange}>
              <Icon name="arrow-up" size={12} color="#4CAF50" />
              较昨日增加 12%
            </Text>
          </View>

          {/* Goal */}
          <View style={styles.calorieBox}>
            <View style={styles.calorieHeader}>
              <Icon name="md-flag-outline" size={18} color="#FF9800" />
              <Text style={styles.calorieLabel}>目标</Text>
            </View>
            <View style={styles.calorieValue}>
              <Text style={styles.calorieNumber}>2,200</Text>
              <Text style={styles.calorieUnit}>千卡</Text>
            </View>
            <Text style={styles.calorieRemaining}>
              还差摄入 353 千卡
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#4CAF50',
              },
              fillShadowGradient: 'rgba(76, 175, 80, 0.2)',
              fillShadowGradientOpacity: 0.5,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Nutrition Distribution */}
        <View style={styles.nutritionContainer}>
          <Text style={styles.sectionTitle}>营养素分布</Text>

          {/* Protein */}
          <View style={styles.nutrientItem}>
            <View style={styles.nutrientInfo}>
              <Text style={styles.nutrientName}>蛋白质</Text>
              <Text style={styles.nutrientValue}>75g</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, styles.proteinBar, {width: '70%'}]} />
            </View>
          </View>

          {/* Carbohydrates */}
          <View style={styles.nutrientItem}>
            <View style={styles.nutrientInfo}>
              <Text style={styles.nutrientName}>碳水化合物</Text>
              <Text style={styles.nutrientValue}>280g</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, styles.carbsBar, {width: '85%'}]} />
            </View>
          </View>

          {/* Fat */}
          <View style={styles.nutrientItem}>
            <View style={styles.nutrientInfo}>
              <Text style={styles.nutrientName}>脂肪</Text>
              <Text style={styles.nutrientValue}>45g</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, styles.fatBar, {width: '40%'}]} />
            </View>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.mealsContainer}>
          <Text style={styles.sectionTitle}>今日饮食记录</Text>

          {/* Breakfast */}
          <View style={styles.mealItem}>
            <Image
              source={{ uri: 'https://example.com/breakfast.jpg' }}
              style={styles.mealImage}
            />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>早餐</Text>
                <Text style={styles.mealTime}>08:30</Text>
              </View>
              <Text style={styles.mealDescription}>全麦面包、牛奶、煎蛋</Text>
              <View style={styles.calorieInfo}>
                <Icon name="flame" size={16} color="#FF5722" />
                <Text style={styles.mealCalories}>450 千卡</Text>
              </View>
            </View>
          </View>

          {/* Lunch */}
          <View style={styles.mealItem}>
            <Image
              source={{ uri: 'https://example.com/lunch.jpg' }}
              style={styles.mealImage}
            />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>午餐</Text>
                <Text style={styles.mealTime}>12:30</Text>
              </View>
              <Text style={styles.mealDescription}>糙米饭、清炒西兰花、鸡胸肉</Text>
              <View style={styles.calorieInfo}>
                <Icon name="flame" size={16} color="#FF5722" />
                <Text style={styles.mealCalories}>680 千卡</Text>
              </View>
            </View>
          </View>

          {/* Dinner */}
          <View style={styles.mealItem}>
            <Image
              source={{ uri: 'https://example.com/dinner.jpg' }}
              style={styles.mealImage}
            />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>晚餐</Text>
                <Text style={styles.mealTime}>18:30</Text>
              </View>
              <Text style={styles.mealDescription}>三文鱼、萝卜、沙拉</Text>
              <View style={styles.calorieInfo}>
                <Icon name="flame" size={16} color="#FF5722" />
                <Text style={styles.mealCalories}>717 千卡</Text>
              </View>
            </View>
          </View>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  dateSelector: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dateOption: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeDateOption: {
    backgroundColor: '#4CAF50',
  },
  dateOptionText: {
    color: '#666',
    fontSize: 14,
  },
  activeDateOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  calorieStats: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  calorieBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  calorieValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  calorieNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    marginBottom: 3,
  },
  calorieChange: {
    fontSize: 12,
    color: '#4CAF50',
  },
  calorieRemaining: {
    fontSize: 12,
    color: '#FF9800',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  nutritionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  nutrientItem: {
    marginBottom: 15,
  },
  nutrientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nutrientName: {
    fontSize: 14,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  proteinBar: {
    backgroundColor: '#2196F3',
  },
  carbsBar: {
    backgroundColor: '#4CAF50',
  },
  fatBar: {
    backgroundColor: '#FFC107',
  },
  mealsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    padding: 15,
    marginBottom: 20,
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mealType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    color: '#999',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  calorieInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    color: '#FF5722',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default NutritionScreen;
