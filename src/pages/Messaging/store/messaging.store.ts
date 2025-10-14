import { create } from 'zustand';
import { mockConversations, mockContacts } from '../data/mockData';
import type { Conversation, Contact, Channel } from '../types';

interface MessagingState {
  conversations: Conversation[];
  contacts: Contact[];
  searchTerm: string;
  activeFilters: {
    channels: Channel[];
    tags: string[];
  };
}

interface MessagingActions {
  getConversationById: (id: string) => (Conversation & { contact: Contact }) | undefined;
  getConversationsWithContact: () => (Conversation & { contact: Contact })[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<MessagingState['activeFilters']>) => void;
  getAvailableTags: () => string[];
}

export const useMessagingStore = create<MessagingState & MessagingActions>((set, get) => ({
  conversations: mockConversations,
  contacts: mockContacts,
  searchTerm: '',
  activeFilters: {
    channels: [],
    tags: [],
  },

  getConversationById: (id) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (!conversation) return undefined;

    const contact = get().contacts.find(c => c.id === conversation.contactId);
    if (!contact) return undefined; // Should not happen with consistent data

    return { ...conversation, contact };
  },

  getConversationsWithContact: () => {
    const { conversations, contacts, searchTerm, activeFilters } = get();
    const lowercasedSearch = searchTerm.toLowerCase();

    const mapped = conversations.map(convo => {
      const contact = contacts.find(c => c.id === convo.contactId) as Contact;
      return { ...convo, contact };
    });

    const filtered = mapped.filter(convo => {
      const searchMatch = convo.contact.name.toLowerCase().includes(lowercasedSearch);
      const channelMatch = activeFilters.channels.length === 0 || activeFilters.channels.includes(convo.channel);
      const tagMatch = activeFilters.tags.length === 0 || activeFilters.tags.some(tag => convo.contact.tags.includes(tag));
      return searchMatch && channelMatch && tagMatch;
    });

    return filtered.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (newFilters) => set(state => ({
    activeFilters: { ...state.activeFilters, ...newFilters }
  })),

  getAvailableTags: () => {
    const allTags = new Set(get().contacts.flatMap(c => c.tags));
    return Array.from(allTags);
  }
}));