import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Modal,
    Alert,
    Image,
    Platform,
} from 'react-native';
import { VideoView, useVideoPlayer, VideoPlayer } from 'expo-video';
import { Icon } from 'react-native-elements';
import { useTheme } from '@/styles/ThemeProvider';
import { useFocusEffect } from '@react-navigation/native';
import videoData from '@/mock/video-contents.json';
import commentsData from '@/mock/video-comments.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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

const parseCount = (countStr: string | number): number => {
    if (typeof countStr === 'number') {
        return countStr;
    }
    if (typeof countStr !== 'string') {
        return 0;
    }
    if (countStr.includes('万')) {
        return parseFloat(countStr.replace('万', '')) * 10000;
    }
    return parseInt(countStr, 10) || 0;
};

const VideoItemComponent = React.memo(({
    item,
    isActive,
    player,
    onLike,
    onFollow,
    onShare,
    onComment,
    formatNumber,
    containerHeight,
}: {
    item: VideoItem;
    isActive: boolean;
    player: VideoPlayer | null;
    onLike: (id: string) => void;
    onFollow: (id: string) => void;
    onShare: (item: VideoItem) => void;
    onComment: () => void;
    formatNumber: (num: number) => string;
    containerHeight: number;
}) => {
    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        videoContainer: {
            width: width,
            height: containerHeight,
            backgroundColor: 'black',
        },
        video: {
            ...StyleSheet.absoluteFillObject,
        },
        thumbnail: {
            ...StyleSheet.absoluteFillObject,
        },
        rightActions: {
            position: 'absolute',
            right: 16,
            bottom: 80,
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
            borderWidth: 2,
            borderColor: 'white',
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
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        bottomInfo: {
            position: 'absolute',
            left: 16,
            right: 80,
            bottom: 80,
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
    });

    return (
        <View style={styles.videoContainer}>
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
            {isActive && player && (
                <VideoView
                    style={styles.video}
                    player={player}
                    nativeControls={false}
                    allowsFullscreen={false}
                />
            )}
            <View style={[styles.rightActions, { bottom: 80 + insets.bottom }]}>
                <TouchableOpacity style={styles.avatarContainer} onPress={() => onFollow(item.author.id)}>
                    <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
                    {!item.author.isFollowed && (
                        <View style={styles.followButton}>
                            <Icon name="add" size={16} color="white" tvParallaxProperties={{}} />
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onLike(item.id)}>
                    <Icon name={item.isLiked ? 'favorite' : 'favorite-border'} size={32} color={item.isLiked ? '#ff4757' : 'white'} tvParallaxProperties={{}} />
                    <Text style={styles.actionText}>{formatNumber(item.stats.likes)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onComment}>
                    <Icon name="chat-bubble-outline" size={32} color="white" tvParallaxProperties={{}} />
                    <Text style={styles.actionText}>{formatNumber(item.stats.comments)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onShare(item)}>
                    <Icon name="share" size={32} color="white" tvParallaxProperties={{}} />
                    <Text style={styles.actionText}>{formatNumber(item.stats.shares)}</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.bottomInfo, { bottom: 80 + insets.bottom }]}>
                <Text style={styles.authorName}>@{item.author.name}</Text>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDescription} numberOfLines={2}>{item.description}</Text>
            </View>
        </View>
    );
});

const VideoScreen = () => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height);

    const [videos, setVideos] = useState<VideoItem[]>(() =>
        videoData
            .filter(item => item.type === 'video' && item.video_url)
            .map((item): VideoItem => ({
                id: item.note_id,
                title: item.title,
                description: item.desc,
                videoUrl: item.video_url,
                thumbnailUrl: item.image_list.split(',')[0],
                author: {
                    id: item.user_id,
                    name: item.nickname,
                    avatar: item.avatar,
                    isFollowed: false,
                },
                stats: {
                    likes: parseCount(item.liked_count),
                    comments: parseCount(item.comment_count),
                    shares: parseCount(item.share_count),
                    views: 0,
                },
                isLiked: false,
            }))
    );

    const [comments, setComments] = useState<Comment[]>([]);

    const player = useVideoPlayer(videos[0]?.videoUrl || '', player => {
        player.loop = true;
        player.muted = false;
    });

    useEffect(() => {
        const currentVideo = videos[currentIndex];
        if (currentVideo && player) {
            player.replace(currentVideo.videoUrl);
            const videoComments = commentsData
                .filter(c => c.note_id === currentVideo.id)
                .map(c => ({
                    id: c.comment_id,
                    userId: c.user_id,
                    userName: c.nickname,
                    userAvatar: c.avatar,
                    content: c.content,
                    timestamp: new Date(c.create_time).toLocaleTimeString(),
                    likes: parseCount(c.like_count),
                    isLiked: false,
                }));
            setComments(videoComments);
        }
    }, [currentIndex, videos, player]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            player?.play();
            return () => {
                player?.pause();
            };
        }, [player])
    );

    const handleLike = useCallback((videoId: string) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId
                    ? { ...video, isLiked: !video.isLiked, stats: { ...video.stats, likes: video.isLiked ? video.stats.likes - 1 : video.stats.likes + 1 } }
                    : video
            )
        );
    }, []);

    const handleFollow = useCallback((authorId: string) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.author.id === authorId
                    ? { ...video, author: { ...video.author, isFollowed: !video.author.isFollowed } }
                    : video
            )
        );
    }, []);

    const handleShare = useCallback((video: VideoItem) => Alert.alert('分享', `分享视频: ${video.title}`), []);

    const handleComment = () => {
        if (commentText.trim()) {
            Alert.alert('评论', `发表评论: ${commentText}`);
            setCommentText('');
            setShowComments(false);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
        return num.toString();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

    const renderItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => (
        <VideoItemComponent
            item={item}
            isActive={index === currentIndex}
            player={player}
            onLike={handleLike}
            onFollow={handleFollow}
            onShare={handleShare}
            onComment={() => setShowComments(true)}
            formatNumber={formatNumber}
            containerHeight={containerHeight}
        />
    ), [currentIndex, player, handleLike, handleFollow, handleShare, containerHeight]);

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: 'black' },
        commentModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        commentContainer: { backgroundColor: theme.backgroundColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: Dimensions.get('window').height * 0.7, paddingTop: 16 },
        commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.border },
        commentTitle: { fontSize: 18, fontWeight: 'bold', color: theme.textPrimary },
        commentList: { paddingHorizontal: 16 },
        commentItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
        commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
        commentContent: { flex: 1 },
        commentUserName: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginBottom: 4 },
        commentText: { fontSize: 14, color: theme.textPrimary, lineHeight: 20, marginBottom: 8 },
        commentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        commentTime: { fontSize: 12, color: theme.textLight },
        commentLike: { flexDirection: 'row', alignItems: 'center' },
        commentLikeText: { fontSize: 12, color: theme.textLight, marginLeft: 4 },
        commentInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.backgroundColor },
        commentInput: { flex: 1, borderWidth: 1, borderColor: theme.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, color: theme.textPrimary, backgroundColor: theme.cardBackground },
        commentSendButton: { backgroundColor: theme.primaryColor, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
        commentSendText: { color: 'white', fontWeight: '600' },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <FlatList
                onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: containerHeight,
                    offset: containerHeight * index,
                    index,
                })}
                removeClippedSubviews={Platform.OS === 'android'}
                windowSize={5}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
            />
            <Modal visible={showComments} animationType="slide" transparent onRequestClose={() => setShowComments(false)}>
                <View style={styles.commentModal}>
                    <View style={styles.commentContainer}>
                        <View style={styles.commentHeader}>
                            <Text style={styles.commentTitle}>{formatNumber(videos[currentIndex]?.stats.comments || 0)} 条评论</Text>
                            <TouchableOpacity onPress={() => setShowComments(false)}>
                                <Icon name="close" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            style={styles.commentList}
                            data={comments}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.commentItem}>
                                    <Image source={{ uri: item.userAvatar }} style={styles.commentAvatar} />
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentUserName}>{item.userName}</Text>
                                        <Text style={styles.commentText}>{item.content}</Text>
                                        <View style={styles.commentFooter}>
                                            <Text style={styles.commentTime}>{item.timestamp}</Text>
                                            <TouchableOpacity style={styles.commentLike}>
                                                <Icon name={item.isLiked ? 'favorite' : 'favorite-border'} size={14} color={item.isLiked ? '#ff4757' : theme.textLight} tvParallaxProperties={{}} />
                                                <Text style={styles.commentLikeText}>{item.likes}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="说点什么..."
                                placeholderTextColor={theme.textLight}
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                            />
                            <TouchableOpacity style={styles.commentSendButton} onPress={handleComment}>
                                <Text style={styles.commentSendText}>发送</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default VideoScreen;
