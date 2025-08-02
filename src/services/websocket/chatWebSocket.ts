import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import secureStorage from '../storage/secureStorage';
import { store } from '../../store';
import { addMessage, setOnlineUsers } from '../../store/slices/chatSlice';

class ChatWebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect() {
    try {
      const token = await secureStorage.getSecureItem('access_token');
      if (!token) return;

      this.socket = io(Constants.expoConfig?.extra?.wsUrl || process.env.EXPO_PUBLIC_WS_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('error', this.handleError);
    this.socket.on('message', this.handleMessage);
    this.socket.on('onlineUsers', this.handleOnlineUsers);
  }

  private handleConnect = () => {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
  };

  private handleDisconnect = (reason: string) => {
    console.log('WebSocket disconnected:', reason);
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.connect();
    }
  };

  private handleError = (error: any) => {
    console.error('WebSocket error:', error);
  };

  private handleMessage = (message: any) => {
    store.dispatch(addMessage(message));
  };

  private handleOnlineUsers = (users: string[]) => {
    store.dispatch(setOnlineUsers(users));
  };

  sendMessage(conversationId: string, message: string) {
    if (!this.socket?.connected) return;

    this.socket.emit('message', {
      conversationId,
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  joinConversation(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('joinConversation', { conversationId });
  }

  leaveConversation(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('leaveConversation', { conversationId });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new ChatWebSocketService();
