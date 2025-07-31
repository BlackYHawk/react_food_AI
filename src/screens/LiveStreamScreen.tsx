import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiveStream {
    id: string;
    title: string;
    chef: {
        name: string;
        avatar: string;
        followers: number;
    };
    thumbnail: string;
    viewers: number;
    isLive: boolean;
    startTime: string;
    category: string;
}

const LiveStreamScreen = ({ navigation }: RootStackScreenProps<'LiveStream'>) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [selectedTab, setSelectedTab] = useState('live');

    // Mock data for live streams
    const liveStreams: LiveStream[] = [
        {
            id: '1',
            title: 'Making Perfect Pasta from Scratch',
            chef: {
                name: 'Chef Marco',
                avatar: 'https://via.placeholder.com/50',
                followers: 15000,
            },
            thumbnail: 'https://via.placeholder.com/300x200',
            viewers: 1250,
            isLive: true,
            startTime: '2024-01-15T10:00:00Z',
            category: 'Italian',
        },
        {
            id: '2',
            title: 'Healthy Breakfast Ideas',
            chef: {
                name: 'Chef Sarah',
                avatar: 'https://via.placeholder.com/50',
                followers: 8500,
            },
            thumbnail: 'https://via.placeholder.com/300x200',
            viewers: 890,
            isLive: true,
            startTime: '2024-01-15T09:30:00Z',
            category: 'Healthy',
        },
    ];

    const upcomingStreams: LiveStream[] = [
        {
            id: '3',
            title: 'Asian Fusion Cooking',
            chef: {
                name: 'Chef Kim',
                avatar: 'https://via.placeholder.com/50',
                followers: 12000,
            },
            thumbnail: 'https://via.placeholder.com/300x200',
            viewers: 0,
            isLive: false,
            startTime: '2024-01-15T15:00:00Z',
            category: 'Asian',
        },
    ];

    const renderStreamCard = ({ item }: { item: LiveStream }) => (
        <TouchableOpacity style={[styles.streamCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                {item.isLive && (
                    <View style={[styles.liveIndicator, { backgroundColor: theme.error }]}>
                        <Text style={styles.liveText}>{t('livestream.live')}</Text>
                    </View>
                )}
                <View style={styles.viewerCount}>
                    <Icon name="visibility" size={16} color="white" tvParallaxProperties={{}} />
                    <Text style={styles.viewerText}>
                        {item.isLive ? item.viewers : formatTime(item.startTime)}
                    </Text>
                </View>
            </View>

            <View style={styles.streamInfo}>
                <Text style={[styles.streamTitle, { color: theme.textPrimary }]} numberOfLines={2}>
                    {item.title}
                </Text>

                <View style={styles.chefInfo}>
                    <Image source={{ uri: item.chef.avatar }} style={styles.chefAvatar} />
                    <View style={styles.chefDetails}>
                        <Text style={[styles.chefName, { color: theme.textSecondary }]}>
                            {item.chef.name}
                        </Text>
                        <Text style={[styles.chefFollowers, { color: theme.textLight }]}>
                            {formatFollowers(item.chef.followers)} followers
                        </Text>
                    </View>

                    <TouchableOpacity style={[styles.followButton, { backgroundColor: theme.primaryColor }]}>
                        <Text style={styles.followButtonText}>{t('livestream.follow')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatFollowers = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                    Live Cooking
                </Text>
                <TouchableOpacity>
                    <Icon name="videocam" size={24} color={theme.primaryColor} tvParallaxProperties={{}} />
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'live' && [styles.activeTab, { borderBottomColor: theme.primaryColor }]
                    ]}
                    onPress={() => setSelectedTab('live')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: selectedTab === 'live' ? theme.primaryColor : theme.textSecondary }
                    ]}>
                        {t('livestream.live')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'upcoming' && [styles.activeTab, { borderBottomColor: theme.primaryColor }]
                    ]}
                    onPress={() => setSelectedTab('upcoming')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: selectedTab === 'upcoming' ? theme.primaryColor : theme.textSecondary }
                    ]}>
                        {t('livestream.upcoming')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'past' && [styles.activeTab, { borderBottomColor: theme.primaryColor }]
                    ]}
                    onPress={() => setSelectedTab('past')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: selectedTab === 'past' ? theme.primaryColor : theme.textSecondary }
                    ]}>
                        {t('livestream.past')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <FlatList
                data={selectedTab === 'live' ? liveStreams : selectedTab === 'upcoming' ? upcomingStreams : []}
                renderItem={renderStreamCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.streamsList}
                showsVerticalScrollIndicator={false}
            />

            {/* Start Stream Button */}
            <TouchableOpacity style={[styles.startStreamButton, { backgroundColor: theme.primaryColor }]}>
                <Icon name="videocam" size={24} color="white" tvParallaxProperties={{}} />
                <Text style={styles.startStreamText}>{t('livestream.startStream')}</Text>
            </TouchableOpacity>
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
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    streamsList: {
        padding: 16,
    },
    streamCard: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    thumbnailContainer: {
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    liveIndicator: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    viewerCount: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewerText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 4,
    },
    streamInfo: {
        padding: 16,
    },
    streamTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    chefInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chefAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    chefDetails: {
        flex: 1,
    },
    chefName: {
        fontSize: 14,
        fontWeight: '500',
    },
    chefFollowers: {
        fontSize: 12,
        marginTop: 2,
    },
    followButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    followButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    startStreamButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        paddingVertical: 16,
        borderRadius: 12,
    },
    startStreamText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default LiveStreamScreen;