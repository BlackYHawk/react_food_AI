import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { Recipe, toggleFavorite } from '@/store/slices/recipeSlice';
import { useTranslation } from '@/hooks/useTranslation';

const { width } = Dimensions.get('window');

interface RecipeCardProps {
    recipe: Recipe;
    onPress: () => void;
    style?: any;
    compact?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    onPress,
    style,
    compact = false
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleToggleFavorite = (e: any) => {
        e.stopPropagation();
        dispatch(toggleFavorite(recipe.id));
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}${t('recipeDetail.minutes')}`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'm' : ''}`;
    };

    if (compact) {
        return (
            <TouchableOpacity
                style={[styles.compactCard, { backgroundColor: theme.cardBackground }, style]}
                onPress={onPress}
            >
                <Image source={{ uri: recipe.imageUrl }} style={styles.compactImage} />

                <View style={styles.compactContent}>
                    <Text style={[styles.compactTitle, { color: theme.textPrimary }]} numberOfLines={2}>
                        {recipe.title}
                    </Text>

                    <View style={styles.compactMeta}>
                        <View style={styles.metaItem}>
                            <Icon name="timer" size={14} color={theme.textSecondary} tvParallaxProperties={{}} />
                            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                                {formatTime(recipe.prepTime + recipe.cookTime)}
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Icon name="star" size={14} color={theme.warning} tvParallaxProperties={{}} />
                            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                                {recipe.rating}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                    <Icon
                        name={recipe.isFavorite ? "favorite" : "favorite-border"}
                        size={20}
                        color={recipe.isFavorite ? theme.error : theme.textLight}
                        tvParallaxProperties={{}}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.cardBackground }, style]}
            onPress={onPress}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

                <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                    <Icon
                        name={recipe.isFavorite ? "favorite" : "favorite-border"}
                        size={24}
                        color={recipe.isFavorite ? theme.error : 'white'}
                        tvParallaxProperties={{}}
                    />
                </TouchableOpacity>

                {recipe.videoUrl && (
                    <View style={styles.videoIndicator}>
                        <Icon name="play-circle-filled" size={20} color="white" tvParallaxProperties={{}} />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={2}>
                    {recipe.title}
                </Text>

                <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
                    {recipe.description}
                </Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Icon name="timer" size={16} color={theme.primaryColor} tvParallaxProperties={{}} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                            {formatTime(recipe.prepTime + recipe.cookTime)}
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Icon name="restaurant" size={16} color={theme.primaryColor} tvParallaxProperties={{}} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                            {recipe.servings} servings
                        </Text>
                    </View>

                    <View style={styles.metaItem}>
                        <Icon name="star" size={16} color={theme.warning} tvParallaxProperties={{}} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                            {recipe.rating} ({recipe.reviews})
                        </Text>
                    </View>
                </View>

                <View style={styles.nutritionContainer}>
                    <View style={styles.nutritionItem}>
                        <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                            {recipe.calories}
                        </Text>
                        <Text style={[styles.nutritionLabel, { color: theme.textLight }]}>
                            kcal
                        </Text>
                    </View>

                    <View style={styles.nutritionItem}>
                        <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                            {recipe.protein}g
                        </Text>
                        <Text style={[styles.nutritionLabel, { color: theme.textLight }]}>
                            protein
                        </Text>
                    </View>

                    <View style={styles.nutritionItem}>
                        <Text style={[styles.nutritionValue, { color: theme.textPrimary }]}>
                            {recipe.carbs}g
                        </Text>
                        <Text style={[styles.nutritionLabel, { color: theme.textLight }]}>
                            carbs
                        </Text>
                    </View>
                </View>

                <View style={styles.tagsContainer}>
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: theme.primaryColor + '20' }]}>
                            <Text style={[styles.tagText, { color: theme.primaryColor }]}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    compactCard: {
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
    },
    compactImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIndicator: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    content: {
        padding: 16,
    },
    compactContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    compactTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    compactMeta: {
        flexDirection: 'row',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 12,
        marginLeft: 4,
    },
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nutritionLabel: {
        fontSize: 10,
        marginTop: 2,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '500',
    },
});

export default RecipeCard;