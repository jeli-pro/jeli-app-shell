import React from 'react';
import { ContactProfile } from './ContactProfile';

interface MessagingContentProps {
  conversationId?: string;
}

export const MessagingContent: React.FC<MessagingContentProps> = ({ conversationId }) => {
  return (
    <ContactProfile conversationId={conversationId} />
  );
};