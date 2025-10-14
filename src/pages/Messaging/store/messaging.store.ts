import { create } from 'zustand';
import { mockConversations, mockContacts } from '../data/mockData';
import type { Conversation, Contact } from '../types';

interface MessagingState {
  conversations: Conversation[];
  contacts: Contact[];
}

interface MessagingActions {
  getConversationById: (id: string) => (Conversation & { contact: Contact }) | undefined;
  getConversationsWithContact: () => (Conversation & { contact: Contact })[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((_set, get) => ({
  conversations: mockConversations,
  contacts: mockContacts,

  getConversationById: (id) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (!conversation) return undefined;
    
    const contact = get().contacts.find(c => c.id === conversation.contactId);
    if (!contact) return undefined; // Should not happen with consistent data

    return { ...conversation, contact };
  },

  getConversationsWithContact: () => {
    const { conversations, contacts } = get();
    return conversations.map(convo => {
      const contact = contacts.find(c => c.id === convo.contactId) as Contact;
      return { ...convo, contact };
    }).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  },
}));