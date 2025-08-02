import { api } from './base';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message: Message;
  unread_count: number;
}

export const chatApi = {
  getConversations: () => 
    api.get<Conversation[]>('/mobile/api/chat/conversations/'),
    
  getMessages: (conversationId: string) =>
    api.get<Message[]>(`/mobile/api/chat/messages/${conversationId}/`),
    
  sendMessage: (conversationId: string, content: string) =>
    api.post<Message>('/mobile/api/chat/send-message/', {
      conversation_id: conversationId,
      content
    }),

  // WebSocket connection helper
  createWebSocketConnection: (userId: string) => {
    const ws = new WebSocket(`ws://your-api-url/ws/chat/${userId}/`);
    return ws;
  }
};
