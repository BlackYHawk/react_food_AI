import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { useTheme } from '@/styles/ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import i18n from '@/i18n/i18n';

const { width } = Dimensions.get('window');

interface NutritionChartProps {
  type: 'daily' | 'weekly' | 'monthly';
  chartType: 'line' | 'pie';
}

const NutritionChart: React.FC<NutritionChartProps> = ({ type, chartType }) => {
  const { theme } = useTheme();
  const { scannedItems, dailyGoals } = useSelector((state: RootState) => state.food);

  // Calculate nutrition data based on scanned items
  const calculateNutritionData = () => {
    const today = new Date();
    const filteredItems = scannedItems.filter(item => {
      const itemDate = new Date(item.date);
      switch (type) {
        case 'daily':
          return itemDate.toDateString() === today.toDateString();
        case 'weekly':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        default:
          return true;
      }
    });

    const totalNutrition = filteredItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        carbs: acc.carbs + item.carbs,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 }
    );

    return totalNutrition;
  };

  const nutritionData = calculateNutritionData();

  // Generate line chart data for weekly/monthly view
  const generateLineChartData = () => {
    const days = type === 'weekly' ? 7 : 30;
    const data: { value: number; label: string }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayItems = scannedItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });

      const dayCalories = dayItems.reduce((sum, item) => sum + item.calories, 0);

      data.push({
        value: dayCalories,
        label: type === 'weekly' ? date.toLocaleDateString('en', { weekday: 'short' }) : date.getDate().toString(),
      });
    }

    return data;
  };

  // Generate pie chart data for macronutrients
  const generatePieChartData = () => {
    const total = nutritionData.carbs + nutritionData.protein + nutritionData.fat;

    if (total === 0) {
      return [];
    }

    return [
      {
        value: nutritionData.carbs,
        color: theme.info,
        text: `${Math.round((nutritionData.carbs / total) * 100)}%`,
        label: i18n.t('home.carbs'),
      },
      {
        value: nutritionData.protein,
        color: theme.success,
        text: `${Math.round((nutritionData.protein / total) * 100)}%`,
        label: i18n.t('home.protein'),
      },
      {
        value: nutritionData.fat,
        color: theme.warning,
        text: `${Math.round((nutritionData.fat / total) * 100)}%`,
        label: i18n.t('home.fat'),
      },
    ];
  };

  const lineData = generateLineChartData();
  const pieData = generatePieChartData();

  if (chartType === 'pie') {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {i18n.t("nutrition.macronutrientDistribution")}
        </Text>

        {pieData.length > 0 ? (
          <View style={styles.pieContainer}>
            <PieChart
              data={pieData}
              radius={80}
              innerRadius={40}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={[styles.centerLabelText, { color: theme.textPrimary }]}>
                    {nutritionData.calories}
                  </Text>
                  <Text style={[styles.centerLabelSubtext, { color: theme.textSecondary }]}>
                    kcal
                  </Text>
                </View>
              )}
            />

            <View style={styles.legend}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                    {item.label}: {item.value}g
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
              {i18n.t('common.noData')}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : 'Monthly'} Calories
      </Text>

      {lineData.length > 0 && lineData.some(item => item.value > 0) ? (
        <LineChart
          data={lineData}
          height={200}
          width={width - 80}
          color={theme.primaryColor}
          hideDataPoints={false}
          dataPointsColor={theme.primaryColor}
          dataPointsRadius={4}
          curved
          showVerticalLines
          verticalLinesColor="rgba(140,140,140,0.1)"
          xAxisColor="lightgray"
          yAxisColor="lightgray"
          yAxisLabelSuffix=" kcal"
          spacing={40}
          initialSpacing={20}
          rulesColor="gray"
          rulesType="solid"
          xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 4,
            pointerLabelComponent: (items) => {
              return (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelText}>
                    {`${items[0].label}: ${items[0].value} kcal`}
                  </Text>
                </View>
              );
            },
          }}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
            {i18n.t('common.noData')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  pieContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerLabelSubtext: {
    fontSize: 12,
  },
  legend: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
  },
  pointerLabel: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pointerLabelText: {
    fontSize: 12,
    color: '#333',
  },
});

export default NutritionChart;