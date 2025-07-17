import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Icon } from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackScreenProps} from '@/types/navigation';
import { useTheme } from '@/styles/ThemeProvider.tsx';
import bookIcon from '@/assets/book-icon.png';
import { useFocusEffect } from '@react-navigation/native';

const NutritionScreen = ({navigation}: RootStackScreenProps<'Nutrition'>) => {
  const { theme } = useTheme();
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

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
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
      color: theme.primaryColor,
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
      color: theme.textPrimary,
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
      backgroundColor: theme.primaryColor,
    },
    dateOptionText: {
      color: theme.textSecondary,
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
      backgroundColor: theme.secondaryColor,
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
      color: theme.textSecondary,
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
      color: theme.textPrimary,
    },
    calorieUnit: {
      fontSize: 14,
      color: theme.textSecondary,
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
      backgroundColor: theme.secondaryColor,
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
      backgroundColor: theme.secondaryColor,
      borderRadius: 12,
      marginHorizontal: 15,
      padding: 15,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.textPrimary,
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
      color: theme.textPrimary,
    },
    nutrientValue: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: 'bold',
    },
    progressBarContainer: {
      height: 10,
      backgroundColor: theme.backgroundColor,
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
      backgroundColor: theme.secondaryColor,
      borderRadius: 12,
      marginHorizontal: 15,
      padding: 15,
      marginBottom: 20,
    },
    mealItem: {
      flexDirection: 'row',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.secondaryColor,
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
  }), [theme]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, [navigation])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: safeInsets.top }]}>
        <View style={styles.logoContainer}>
          <Image
            source={bookIcon}
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
            data={chartData.datasets[0].data.map((value, index) => ({ value, label: chartData.labels[index] }))}
            height={220}
            width={300} // You might need to adjust this based on your layout
            color='rgb(76, 175, 80)'
            hideDataPoints
            isCurved
            showVerticalLines
            verticalLinesColor='rgba(140,140,140,0.1)'
            xAxisColor='lightgray'
            yAxisColor='lightgray'
            yAxisLabelSuffix='千卡'
            spacing={40}
            initialSpacing={0}
            rulesColor='gray'
            rulesType='solid'
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
            yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: 'lightgray',
              radius: 4,
              pointerLabelComponent: (item) => {
                return (
                  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 10 }}>{`${item[0].label}: ${item[0].value}千卡`}</Text>
                  </View>
                );
              },
            }}
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

export default NutritionScreen;
