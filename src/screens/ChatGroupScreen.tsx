import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@/styles/ThemeProvider';
import { RootStackScreenProps } from '@/types/navigation';
import { RootState } from '@/store';
import { addMessage } from '@/store/slices/chatSlice';
import i18n from '@/i18n/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatGroupScreen = ({ route, navigation }: RootStackScreenProps<'ChatGroup'>) => {
  const { groupId } = route.params || { groupId: null };
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Get chat group from store
  const chatGroups = useSelector((state: RootState) => state.chat.groups);
  const activeGroup = chatGroups.find(group => group.id === groupId) || chatGroups[0];
  const userProfile = useSelector((state: RootState) => state.user.profile);
  
  useEffect(() => {
    if (activeGroup && activeGroup.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [activeGroup]);

  const sendMessage = () => {
    if (!message.trim() || !activeGroup || !userProfile) return;
    
    const newMessage = {
      id: Date.now().toString(),
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      text: message.trim(),
      timestamp: Date.now(),
    };
    
    dispatch(addMessage({
      groupId: activeGroup.id,
      message: newMessage,
    }));
    
    setMessage('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = userProfile && item.userId === userProfile.id;
    const showAvatar = index === 0 || 
      (activeGroup.messages[index - 1] && 
       activeGroup.messages[index - 1].userId !== item.userId);
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && showAvatar && (
          <Image 
            source={{ uri: item.userAvatar || 'https://via.placeholder.com/40' }} 
            style={styles.avatar} 
          />
        )}
        
        {!isCurrentUser && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser 
            ? [styles.currentUserBubble, { backgroundColor: theme.primaryColor }]
            : [styles.otherUserBubble, { backgroundColor: theme.cardBackground }]
        ]}>
          {!isCurrentUser && showAvatar && (
            <Text style={[styles.userName, { color: theme.textSecondary }]}>
              {item.userName}
            </Text>
          )}
          
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? 'white' : theme.textPrimary }
          ]}>
            {item.text}
          </Text>
          
          <Text style={[
            styles.messageTime,
            { color: isCurrentUser ? 'rgba(255,255,255,0.7)' : theme.textLight }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!activeGroup) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={{ color: theme.textPrimary }}>{i18n.t('common.noData')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.backgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {activeGroup.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {activeGroup.memberCount} {i18n.t('livestream.viewers')}
          </Text>
        </View>
        
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color={theme.textPrimary} tvParallaxProperties={{}} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={activeGroup.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="add-circle-outline" size={24} color={theme.primaryColor} tvParallaxProperties={{}} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { color: theme.textPrimary, backgroundColor: theme.backgroundColor }]}
            placeholder={i18n.t('chat.typeMessage')}
            placeholderTextColor={theme.textLight}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.primaryColor }]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Icon name="send" size={20} color="white" tvParallaxProperties={{}} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 40,
    marginRight: 8,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatGroupScreen;