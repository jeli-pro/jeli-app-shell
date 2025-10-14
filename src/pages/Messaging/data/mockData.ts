import type { Contact, Conversation, Message, ActivityEvent, Note } from '../types';

// --- HELPERS ---
const generateNotes = (contactName: string): Note[] => [
  { id: `note-${Math.random()}`, content: `Initial discovery call with ${contactName}. Seemed very interested in our enterprise package.`, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `note-${Math.random()}`, content: `Followed up via email with pricing details.`, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const generateActivity = (contactName: string): ActivityEvent[] => [
  { id: `act-${Math.random()}`, type: 'email', content: `Sent follow-up email regarding pricing.`, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `act-${Math.random()}`, type: 'call', content: `Had a 30-minute discovery call with ${contactName}.`, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: `act-${Math.random()}`, type: 'meeting', content: `Scheduled a demo for next week.`, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

// --- CONTACTS ---
export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Elena Rodriguez',
    avatar: `https://avatar.vercel.sh/elenarodriguez.png`,
    online: true,
    tags: ['VIP', 'New Lead'],
    email: 'elena.r@example.com',
    phone: '+1 234 567 8901',
    lastSeen: 'online',
    company: 'Innovate Inc.',
    role: 'CTO',
    activity: generateActivity('Elena Rodriguez'),
    notes: generateNotes('Elena Rodriguez'),
  },
  {
    id: 'contact-2',
    name: 'Marcus Chen',
    avatar: `https://avatar.vercel.sh/marcuschen.png`,
    online: false,
    tags: ['Returning Customer'],
    email: 'marcus.c@example.com',
    phone: '+1 345 678 9012',
    lastSeen: '2 hours ago',
    company: 'Solutions Co.',
    role: 'Product Manager',
    activity: generateActivity('Marcus Chen'),
    notes: generateNotes('Marcus Chen'),
  },
  {
    id: 'contact-3',
    name: 'Aisha Khan',
    avatar: `https://avatar.vercel.sh/aishakhan.png`,
    online: true,
    tags: ['Support Request'],
    email: 'aisha.k@example.com',
    phone: '+1 456 789 0123',
    lastSeen: 'online',
    company: 'Data Dynamics',
    role: 'Data Analyst',
    activity: generateActivity('Aisha Khan'),
    notes: generateNotes('Aisha Khan'),
  },
  {
    id: 'contact-4',
    name: 'Leo Tolstoy',
    avatar: `https://avatar.vercel.sh/leotolstoy.png`,
    online: false,
    tags: [],
    email: 'leo.tolstoy@example.com',
    phone: '+44 20 7946 0958',
    lastSeen: 'yesterday',
    company: 'Classic Reads',
    role: 'Author',
    activity: generateActivity('Leo Tolstoy'),
    notes: generateNotes('Leo Tolstoy'),
  }
];

// --- MESSAGE GENERATOR ---
const generateMessages = (count: number, contactName: string): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const sender = Math.random() > 0.5 ? 'user' : 'contact';
    messages.push({
      id: `msg-${Math.random()}`,
      text: `This is a sample message number ${i} from ${sender === 'user' ? 'me' : contactName}. The time is roughly ${count - i} hours ago.`,
      timestamp: new Date(now.getTime() - i * 60 * 60 * 1000).toISOString(),
      sender,
      read: i < count - 2,
    });
  }
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1].sender = 'contact';
  messages[messages.length - 1].text = `Hey! This is the latest message from ${contactName}.`;
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- CONVERSATIONS ---
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contactId: 'contact-1',
    channel: 'whatsapp',
    unreadCount: 2,
    messages: generateMessages(15, 'Elena Rodriguez'),
    get lastMessage() { return this.messages[this.messages.length - 1]; },
    aiSummary: {
      sentiment: 'positive',
      summaryPoints: [
        'Expressed strong interest in the new feature.',
        'Asked about pricing tiers for enterprise.',
        'Is ready for a follow-up call next week.',
      ],
      suggestedReplies: [
        'Let\'s schedule that call!',
        'Here is the pricing information.',
        'Happy to hear you like it!',
      ],
    },
  },
  {
    id: 'conv-2',
    contactId: 'contact-2',
    channel: 'instagram',
    unreadCount: 0,
    messages: generateMessages(8, 'Marcus Chen'),
    get lastMessage() { return this.messages[this.messages.length - 1]; },
    aiSummary: {
      sentiment: 'neutral',
      summaryPoints: [
        'Reported a minor issue with order #12345.',
        'Was satisfied with the proposed solution.',
        'Inquired about the return policy.',
      ],
      suggestedReplies: [
        'Can I help with anything else?',
        'Here is our return policy.',
      ],
    },
  },
  {
    id: 'conv-3',
    contactId: 'contact-3',
    channel: 'facebook',
    unreadCount: 5,
    messages: generateMessages(20, 'Aisha Khan'),
    get lastMessage() { return this.messages[this.messages.length - 1]; },
    aiSummary: {
      sentiment: 'negative',
      summaryPoints: [
        'Frustrated with login issues.',
        'Unable to reset password via email link.',
        'Threatened to cancel their subscription.',
      ],
      suggestedReplies: [
        'I\'m escalating this to our technical team.',
        'Let\'s try a manual password reset.',
        'We apologize for the inconvenience.',
      ],
    },
  },
  {
    id: 'conv-4',
    contactId: 'contact-4',
    channel: 'whatsapp',
    unreadCount: 0,
    messages: generateMessages(5, 'Leo Tolstoy'),
    get lastMessage() { return this.messages[this.messages.length - 1]; },
    aiSummary: {
      sentiment: 'neutral',
      summaryPoints: [
        'Followed up on a previous conversation.',
        'Confirmed meeting time for Thursday.',
        'No outstanding issues.',
      ],
      suggestedReplies: [
        'Sounds good!',
        'See you then!',
      ],
    },
  },
];