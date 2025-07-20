import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: number;
  attachments?: {
    type: 'image' | 'video' | 'recipe';
    url: string;
    thumbnailUrl?: string;
    id?: string;
  }[];
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  memberCount: number;
  isJoined: boolean;
  tags: string[];
  createdAt: number;
  lastActivity: number;
  messages: Message[];
}

interface ChatState {
  groups: ChatGroup[];
  activeGroupId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  groups: [],
  activeGroupId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<ChatGroup[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<ChatGroup>) => {
      state.groups.push(action.payload);
    },
    joinGroup: (state, action: PayloadAction<string>) => {
      const groupIndex = state.groups.findIndex(group => group.id === action.payload);
      if (groupIndex !== -1) {
        state.groups[groupIndex].isJoined = true;
        state.groups[groupIndex].memberCount += 1;
      }
    },
    leaveGroup: (state, action: PayloadAction<string>) => {
      const groupIndex = state.groups.findIndex(group => group.id === action.payload);
      if (groupIndex !== -1) {
        state.groups[groupIndex].isJoined = false;
        state.groups[groupIndex].memberCount -= 1;
      }
    },
    setActiveGroup: (state, action: PayloadAction<string | null>) => {
      state.activeGroupId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ groupId: string; message: Message }>) => {
      const { groupId, message } = action.payload;
      const groupIndex = state.groups.findIndex(group => group.id === groupId);
      if (groupIndex !== -1) {
        state.groups[groupIndex].messages.push(message);
        state.groups[groupIndex].lastActivity = Date.now();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setGroups, 
  addGroup, 
  joinGroup, 
  leaveGroup, 
  setActiveGroup, 
  addMessage, 
  setLoading, 
  setError 
} = chatSlice.actions;

export default chatSlice.reducer;