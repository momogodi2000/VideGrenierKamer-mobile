import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api/chat';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  onlineUsers: [],
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversations();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await chatApi.getMessages(conversationId);
      return { conversationId, messages: response };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }: { conversationId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(conversationId, content);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);

      // Update conversation last message and unread count
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload;
        if (conversationId !== state.activeConversation) {
          conversation.unreadCount++;
        }
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        state.messages[message.conversationId].push(message);
        
        const conversation = state.conversations.find(c => c.id === message.conversationId);
        if (conversation) {
          conversation.lastMessage = message;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveConversation,
  addMessage,
  setOnlineUsers,
  markConversationAsRead,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
