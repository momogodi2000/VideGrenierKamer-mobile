import { chatApi, Message, Conversation } from '@/services/api/chat';
import { Analytics, EventType } from '@/services/analytics';

export class ChatViewModel {
  private chatWebSocket: WebSocket | null = null;
  private userId: string | null = null;

  constructor(userId?: string) {
    if (userId) {
      this.setUserId(userId);
    }
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public async getConversations(): Promise<Conversation[]> {
    try {
      const response = await chatApi.getConversations();
      
      await Analytics.trackEvent(EventType.CHAT_SEND, {
        action: 'fetch_conversations',
        count: response.data.length
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'fetch_conversations',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await chatApi.getMessages(conversationId);

      await Analytics.trackEvent(EventType.CHAT_SEND, {
        action: 'fetch_messages',
        conversationId,
        count: response.data.length
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'fetch_messages',
        conversationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await chatApi.sendMessage(conversationId, content);

      await Analytics.trackEvent(EventType.CHAT_SEND, {
        action: 'send_message',
        conversationId,
        messageLength: content.length,
        hasImage: content.includes('data:image/')
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'send_message',
        conversationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public connectWebSocket() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      this.chatWebSocket = chatApi.createWebSocketConnection(this.userId);

      this.chatWebSocket.onopen = () => {
        Analytics.trackEvent(EventType.CHAT_SEND, {
          action: 'websocket_connected',
          userId: this.userId
        });
      };

      this.chatWebSocket.onclose = () => {
        Analytics.trackEvent(EventType.CHAT_SEND, {
          action: 'websocket_disconnected',
          userId: this.userId
        });
      };

      this.chatWebSocket.onerror = (error) => {
        Analytics.trackEvent(EventType.ERROR, {
          action: 'websocket_error',
          userId: this.userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      };

      return this.chatWebSocket;
    } catch (error) {
      Analytics.trackEvent(EventType.ERROR, {
        action: 'websocket_connect',
        userId: this.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public disconnectWebSocket() {
    if (this.chatWebSocket) {
      this.chatWebSocket.close();
      this.chatWebSocket = null;

      Analytics.trackEvent(EventType.CHAT_SEND, {
        action: 'websocket_disconnect',
        userId: this.userId
      });
    }
  }
}
