import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { RootState } from '@/store';
import { removeScannedItem } from '@/store/slices/foodSlice';
import i18n from '@/i18n/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FoodHistoryScreen = ({ navigation }: RootStackScreenProps<'FoodHistory'>) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { scannedItems } = useSelector((state: RootState) => state.food);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      i18n.t('common.delete'),
      i18n.t('common.confirmDelete'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.delete'),
          onPress: () => dispatch(removeScannedItem(id)),
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, { color: theme.textPrimary }]}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Icon name="delete-outline" size={24} color={theme.error} tvParallaxProperties={{}} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemContent}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        )}
        
        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
              {i18n.t('home.calories')}:
            </Text>
            <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
              {item.calories} kcal
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
              {i18n.t('home.carbs')}:
            </Text>
            <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
              {item.carbs}g
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
              {i18n.t('home.protein')}:
            </Text>
            <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
              {item.protein}g
            </Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
              {i18n.t('home.fat')}:
            </Text>
            <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
              {item.fat}g
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.itemDate, { color: theme.textLight }]}>
        {formatDate(item.date)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {i18n.t('nutrition.foodHistory')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {scannedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="restaurant" size={80} color={theme.textLight} tvParallaxProperties={{}} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {i18n.t('common.noData')}
          </Text>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => navigation.navigate('FoodScan')}
          >
            <Text style={styles.scanButtonText}>{i18n.t('home.scanFood')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={scannedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  nutritionContainer: {
    flex: 1,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 14,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemDate: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  scanButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FoodHistoryScreen;