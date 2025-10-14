import type { LucideIcon } from "lucide-react";

export type Channel = 'whatsapp' | 'instagram' | 'facebook';

export interface ChannelIcon {
  Icon: LucideIcon;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  tags: string[];
  email: string;
  phone: string;
  lastSeen: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact';
  read: boolean;
}

export interface AISummary {
  sentiment: 'positive' | 'negative' | 'neutral';
  summaryPoints: string[];
  suggestedReplies: string[];
}

export interface Conversation {
  id: string;
  contactId: string;
  channel: Channel;
  unreadCount: number;
  lastMessage: Message;
  messages: Message[];
  aiSummary: AISummary;
}