import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { RootState } from '@/store';
import { toggleFavorite } from '@/store/slices/recipeSlice';
import { useTranslation } from '@/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ route, navigation }: RootStackScreenProps<'RecipeDetail'>) => {
  const { recipeId } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [showVideo, setShowVideo] = useState(false);
  
  // Get recipe from store
  const recipe = useSelector((state: RootState) => 
    state.recipe.recipes.find(r => r.id === recipeId)
  );
  
  const isFavorite = useSelector((state: RootState) => 
    state.recipe.favoriteRecipes.includes(recipeId)
  );

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={{ color: theme.textPrimary }}>{t('common.noData')}</Text>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing recipe: ${recipe.title}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipeId));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView>
        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.backgroundColor }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
          </TouchableOpacity>
          
          {recipe.videoUrl && (
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: theme.primaryColor }]}
              onPress={() => setShowVideo(true)}
            >
              <Icon name="play-arrow" size={30} color="white" tvParallaxProperties={{}} />
            </TouchableOpacity>
          )}
        </View>

        {/* Recipe Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.recipeTitle, { color: theme.textPrimary }]}>{recipe.title}</Text>
            <TouchableOpacity onPress={handleToggleFavorite}>
              <Icon 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={28} 
                color={isFavorite ? theme.error : theme.textSecondary} 
                tvParallaxProperties={{}}
              />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.recipeDescription, { color: theme.textSecondary }]}>
            {recipe.description}
          </Text>
          
          {/* Recipe Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="timer" size={20} color={theme.primaryColor} tvParallaxProperties={{}} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {recipe.prepTime + recipe.cookTime} {t('recipeDetail.minutes')}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Icon name="restaurant" size={20} color={theme.primaryColor} tvParallaxProperties={{}} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {recipe.servings} {t('recipeDetail.servings')}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Icon name="star" size={20} color={theme.primaryColor} tvParallaxProperties={{}} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {recipe.rating} ({recipe.reviews})
              </Text>
            </View>
          </View>
          
          {/* Nutrition Facts */}
          <View style={[styles.nutritionContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {t('recipeDetail.nutritionFacts')}
            </Text>
            
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                  {recipe.calories}
                </Text>
                <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                  {t('home.calories')}
                </Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                  {recipe.carbs}g
                </Text>
                <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                  {t('home.carbs')}
                </Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                  {recipe.protein}g
                </Text>
                <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                  {t('home.protein')}
                </Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                  {recipe.fat}g
                </Text>
                <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
                  {t('home.fat')}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {t('recipeDetail.ingredients')}
            </Text>
            
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Icon name="fiber-manual-record" size={12} color={theme.primaryColor} tvParallaxProperties={{}} />
                <Text style={[styles.ingredientText, { color: theme.textPrimary }]}>
                  {ingredient}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Instructions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {t('recipeDetail.instructions')}
            </Text>
            
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.instructionNumber, { backgroundColor: theme.primaryColor }]}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.instructionText, { color: theme.textPrimary }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {recipe.videoUrl && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
                onPress={() => setShowVideo(true)}
              >
                <Icon name="videocam" size={20} color="white" tvParallaxProperties={{}} />
                <Text style={styles.actionButtonText}>
                  {t('recipeDetail.watchVideo')}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.secondaryColor }]}
              onPress={handleShare}
            >
              <Icon name="share" size={20} color="white" tvParallaxProperties={{}} />
              <Text style={styles.actionButtonText}>
                {t('recipeDetail.share')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: -30,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  recipeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
  },
  nutritionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RecipeDetailScreen;