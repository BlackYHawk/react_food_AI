import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useTheme } from '@/styles/ThemeProvider';
import { FoodItem } from '@/store/slices/foodSlice';
import { useTranslation } from '@/hooks/useTranslation';

const { width } = Dimensions.get('window');

interface FoodScanResultProps {
  foodItem: FoodItem;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const FoodScanResult: React.FC<FoodScanResultProps> = ({
  foodItem,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getNutritionColor = (value: number, type: 'calories' | 'carbs' | 'protein' | 'fat') => {
    // Define thresholds for different nutrition types
    const thresholds = {
      calories: { low: 100, medium: 300, high: 500 },
      carbs: { low: 10, medium: 30, high: 50 },
      protein: { low: 5, medium: 15, high: 25 },
      fat: { low: 3, medium: 10, high: 20 },
    };

    const threshold = thresholds[type];
    
    if (value <= threshold.low) return theme.success;
    if (value <= threshold.medium) return theme.warning;
    if (value <= threshold.high) return theme.error;
    return theme.error;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return theme.success;
    if (confidence >= 0.6) return theme.warning;
    return theme.error;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.foodName, { color: theme.textPrimary }]}>
            {foodItem.name}
          </Text>
          <View style={styles.confidenceContainer}>
            <Icon 
              name="verified" 
              size={16} 
              color={getConfidenceColor(foodItem.confidence)} 
              tvParallaxProperties={{}}
            />
            <Text style={[styles.confidence, { color: getConfidenceColor(foodItem.confidence) }]}>
              {Math.round(foodItem.confidence * 100)}% {t('foodScan.confidence')}
            </Text>
          </View>
        </View>
        
        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Icon name="edit" size={20} color={theme.primaryColor} tvParallaxProperties={{}} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Icon name="delete" size={20} color={theme.error} tvParallaxProperties={{}} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Food Image */}
        {foodItem.imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: foodItem.imageUri }} style={styles.foodImage} />
          </View>
        )}

        {/* Nutrition Information */}
        <View style={styles.nutritionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Nutrition Information
          </Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <View style={[styles.nutritionIcon, { backgroundColor: getNutritionColor(foodItem.calories, 'calories') + '20' }]}>
                <Icon 
                  name="local-fire-department" 
                  size={20} 
                  color={getNutritionColor(foodItem.calories, 'calories')} 
                  tvParallaxProperties={{}}
                />
              </View>
              <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                {foodItem.calories}
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                {t('home.calories')}
              </Text>
            </View>
            
            <View style={styles.nutritionItem}>
              <View style={[styles.nutritionIcon, { backgroundColor: getNutritionColor(foodItem.carbs, 'carbs') + '20' }]}>
                <Icon 
                  name="grain" 
                  size={20} 
                  color={getNutritionColor(foodItem.carbs, 'carbs')} 
                  tvParallaxProperties={{}}
                />
              </View>
              <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                {foodItem.carbs}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                {t('home.carbs')}
              </Text>
            </View>
            
            <View style={styles.nutritionItem}>
              <View style={[styles.nutritionIcon, { backgroundColor: getNutritionColor(foodItem.protein, 'protein') + '20' }]}>
                <Icon 
                  name="fitness-center" 
                  size={20} 
                  color={getNutritionColor(foodItem.protein, 'protein')} 
                  tvParallaxProperties={{}}
                />
              </View>
              <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                {foodItem.protein}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                {t('home.protein')}
              </Text>
            </View>
            
            <View style={styles.nutritionItem}>
              <View style={[styles.nutritionIcon, { backgroundColor: getNutritionColor(foodItem.fat, 'fat') + '20' }]}>
                <Icon 
                  name="opacity" 
                  size={20} 
                  color={getNutritionColor(foodItem.fat, 'fat')} 
                  tvParallaxProperties={{}}
                />
              </View>
              <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                {foodItem.fat}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                {t('home.fat')}
              </Text>
            </View>
          </View>
        </View>

        {/* Timestamp */}
        <View style={styles.footer}>
          <Icon name="schedule" size={16} color={theme.textLight} tvParallaxProperties={{}} />
          <Text style={[styles.timestamp, { color: theme.textLight }]}>
            Scanned on {formatDate(foodItem.date)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidence: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  foodImage: {
    width: width * 0.6,
    height: width * 0.4,
    borderRadius: 8,
  },
  nutritionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default FoodScanResult;