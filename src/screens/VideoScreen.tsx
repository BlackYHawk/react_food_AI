import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Modal,
    Alert,
    ScrollView,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Icon } from 'react-native-elements';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '@/i18n/i18n';

const { width, height } = Dimensions.get('window');

interface VideoItem {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    author: {
        id: string;
        name: string;
        avatar: string;
        isFollowed: boolean;
    };
    stats: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    isLiked: boolean;
}

interface Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
}

const VideoScreen = ({ navigation }: RootStackScreenProps<'Video'>) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [videos, setVideos] = useState<VideoItem[]>([
        {
            id: '1',
            title: '美味意大利面制作教程',
            description: '学会这道经典意大利面，让你在家也能享受餐厅级别的美味！#美食教程 #意大利面',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://via.placeholder.com/400x600',
            author: {
                id: 'chef1',
                name: '美食大师小王',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                isFollowed: false,
            },
            stats: {
                likes: 1234,
                comments: 89,
                shares: 45,
                views: 12500,
            },
            isLiked: false,
        },
        {
            id: '2',
            title: '健康沙拉搭配指南',
            description: '营养师推荐的健康沙拉搭配，美味又营养！#健康饮食 #沙拉',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://via.placeholder.com/400x600',
            author: {
                id: 'chef2',
                name: '营养师小李',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                isFollowed: true,
            },
            stats: {
                likes: 2567,
                comments: 156,
                shares: 78,
                views: 25600,
            },
            isLiked: true,
        },
        {
            id: '3',
            title: '日式料理入门',
            description: '从零开始学习日式料理，掌握基本技巧！#日式料理 #料理教程',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://via.placeholder.com/400x600',
            author: {
                id: 'chef3',
                name: '日料达人',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                isFollowed: false,
            },
            stats: {
                likes: 3456,
                comments: 234,
                shares: 123,
                views: 45600,
            },
            isLiked: false,
        },
    ]);

    // Create video players at component level to avoid hook call issues
    const player1 = useVideoPlayer(videos[0]?.videoUrl || '', player => {
        player.loop = true;
        player.muted = false;
    });

    const player2 = useVideoPlayer(videos[1]?.videoUrl || '', player => {
        player.loop = true;
        player.muted = false;
    });

    const player3 = useVideoPlayer(videos[2]?.videoUrl || '', player => {
        player.loop = true;
        player.muted = false;
    });

    const videoPlayers = [player1, player2, player3];

    const [comments] = useState<Comment[]>([
        {
            id: '1',
            userId: 'user1',
            userName: '美食爱好者',
            userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            content: '太棒了！学会了这个做法',
            timestamp: '2小时前',
            likes: 12,
            isLiked: false,
        },
        {
            id: '2',
            userId: 'user2',
            userName: '厨房新手',
            userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            content: '请问调料的比例是多少？',
            timestamp: '1小时前',
            likes: 8,
            isLiked: true,
        },
    ]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );

    const handleLike = (videoId: string) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId
                    ? {
                        ...video,
                        isLiked: !video.isLiked,
                        stats: {
                            ...video.stats,
                            likes: video.isLiked ? video.stats.likes - 1 : video.stats.likes + 1,
                        },
                    }
                    : video
            )
        );
    };

    const handleFollow = (authorId: string) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.author.id === authorId
                    ? {
                        ...video,
                        author: {
                            ...video.author,
                            isFollowed: !video.author.isFollowed,
                        },
                    }
                    : video
            )
        );
    };

    const handleShare = (video: VideoItem) => {
        Alert.alert('分享', `分享视频: ${video.title}`);
    };

    const handleComment = () => {
        if (commentText.trim()) {
            Alert.alert('评论', `发表评论: ${commentText}`);
            setCommentText('');
            setShowComments(false);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 10000) {
            return `${(num / 10000).toFixed(1)}万`;
        }
        return num.toString();
    };

    // Control video playback based on current index
    React.useEffect(() => {
        videoPlayers.forEach((player, index) => {
            if (player) {
                if (index === currentIndex) {
                    player.play();
                } else {
                    player.pause();
                }
            }
        });
    }, [currentIndex, videoPlayers]);

    const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => {
        const player = videoPlayers[index];

        return (
            <View style={styles.videoContainer}>
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    nativeControls={false}
                />

                {/* 右侧操作栏 */}
                <View style={styles.rightActions}>
                    {/* 作者头像 */}
                    <TouchableOpacity style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                        {!item.author.isFollowed && (
                            <TouchableOpacity
                                style={styles.followButton}
                                onPress={() => handleFollow(item.author.id)}
                            >
                                <Icon name="add" size={16} color="white" tvParallaxProperties={{}} />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* 点赞 */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(item.id)}
                    >
                        <Icon
                            name={item.isLiked ? 'favorite' : 'favorite-border'}
                            size={32}
                            color={item.isLiked ? '#ff4757' : 'white'}
                            tvParallaxProperties={{}}
                        />
                        <Text style={styles.actionText}>{formatNumber(item.stats.likes)}</Text>
                    </TouchableOpacity>

                    {/* 评论 */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setShowComments(true)}
                    >
                        <Icon name="chat-bubble-outline" size={32} color="white" tvParallaxProperties={{}} />
                        <Text style={styles.actionText}>{formatNumber(item.stats.comments)}</Text>
                    </TouchableOpacity>

                    {/* 分享 */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleShare(item)}
                    >
                        <Icon name="share" size={32} color="white" tvParallaxProperties={{}} />
                        <Text style={styles.actionText}>{formatNumber(item.stats.shares)}</Text>
                    </TouchableOpacity>
                </View>

                {/* 底部信息 */}
                <View style={styles.bottomInfo}>
                    <Text style={styles.authorName}>@{item.author.name}</Text>
                    <Text style={styles.videoTitle}>{item.title}</Text>
                    <Text style={styles.videoDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
            </View>
        );
    };

    const renderCommentItem = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>👤</Text>
            </View>
            <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>{item.userName}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <View style={styles.commentFooter}>
                    <Text style={styles.commentTime}>{item.timestamp}</Text>
                    <TouchableOpacity style={styles.commentLike}>
                        <Icon
                            name={item.isLiked ? 'favorite' : 'favorite-border'}
                            size={14}
                            color={item.isLiked ? '#ff4757' : theme.textLight}
                            tvParallaxProperties={{}}
                        />
                        <Text style={styles.commentLikeText}>{item.likes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
        },
        videoContainer: {
            width,
            height,
            position: 'relative',
        },
        video: {
            width: '100%',
            height: '100%',
        },
        rightActions: {
            position: 'absolute',
            right: 16,
            bottom: 100,
            alignItems: 'center',
        },
        avatarContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'white',
        },
        avatarText: {
            fontSize: 20,
        },
        followButton: {
            position: 'absolute',
            bottom: -8,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#ff4757',
            justifyContent: 'center',
            alignItems: 'center',
        },
        actionButton: {
            alignItems: 'center',
            marginBottom: 24,
        },
        actionText: {
            color: 'white',
            fontSize: 12,
            marginTop: 4,
            fontWeight: '500',
        },
        bottomInfo: {
            position: 'absolute',
            left: 16,
            right: 80,
            bottom: 100,
        },
        authorName: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        videoTitle: {
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
        },
        videoDescription: {
            color: 'white',
            fontSize: 14,
            lineHeight: 20,
        },
        // 评论模态框样式
        commentModal: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        commentContainer: {
            backgroundColor: theme.backgroundColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: height * 0.7,
            paddingTop: 16,
        },
        commentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        commentTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textPrimary,
        },
        commentList: {
            flex: 1,
            paddingHorizontal: 16,
        },
        commentItem: {
            flexDirection: 'row',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        commentAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        commentAvatarText: {
            fontSize: 16,
        },
        commentContent: {
            flex: 1,
        },
        commentUserName: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.textPrimary,
            marginBottom: 4,
        },
        commentText: {
            fontSize: 14,
            color: theme.textPrimary,
            lineHeight: 20,
            marginBottom: 8,
        },
        commentFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        commentTime: {
            fontSize: 12,
            color: theme.textLight,
        },
        commentLike: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        commentLikeText: {
            fontSize: 12,
            color: theme.textLight,
            marginLeft: 4,
        },
        commentInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.backgroundColor,
        },
        commentInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 12,
            color: theme.textPrimary,
            backgroundColor: theme.cardBackground,
        },
        commentSendButton: {
            backgroundColor: theme.primaryColor,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        commentSendText: {
            color: 'white',
            fontWeight: '600',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />

            <FlatList
                ref={flatListRef}
                data={videos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
            />

            {/* 评论模态框 */}
            <Modal
                visible={showComments}
                animationType="slide"
                transparent
                onRequestClose={() => setShowComments(false)}
            >
                <View style={styles.commentModal}>
                    <View style={styles.commentContainer}>
                        <View style={styles.commentHeader}>
                            <Text style={styles.commentTitle}>
                                {formatNumber(videos[currentIndex]?.stats.comments || 0)} 条评论
                            </Text>
                            <TouchableOpacity onPress={() => setShowComments(false)}>
                                <Icon name="close" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.commentList}
                            showsVerticalScrollIndicator={false}
                        >
                            {comments.map((item) => (
                                <View key={item.id} style={styles.commentItem}>
                                    <View style={styles.commentAvatar}>
                                        <Text style={styles.commentAvatarText}>👤</Text>
                                    </View>
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentUserName}>{item.userName}</Text>
                                        <Text style={styles.commentText}>{item.content}</Text>
                                        <View style={styles.commentFooter}>
                                            <Text style={styles.commentTime}>{item.timestamp}</Text>
                                            <TouchableOpacity style={styles.commentLike}>
                                                <Icon
                                                    name={item.isLiked ? 'favorite' : 'favorite-border'}
                                                    size={14}
                                                    color={item.isLiked ? '#ff4757' : theme.textLight}
                                                    tvParallaxProperties={{}}
                                                />
                                                <Text style={styles.commentLikeText}>{item.likes}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="说点什么..."
                                placeholderTextColor={theme.textLight}
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                            />
                            <TouchableOpacity
                                style={styles.commentSendButton}
                                onPress={handleComment}
                            >
                                <Text style={styles.commentSendText}>发送</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default VideoScreen;