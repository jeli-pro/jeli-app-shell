import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority } from '../types';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png`, type: 'human' },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png`, type: 'human' },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png`, type: 'human' },
  { id: 'user-ai-1', name: 'AI Assistant', avatar: `https://avatar.vercel.sh/ai.png`, type: 'ai' },
];

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
  { id: 'contact-1', name: 'Elena Rodriguez', avatar: `https://avatar.vercel.sh/elenarodriguez.png`, online: true, tags: ['VIP', 'New Lead'], email: 'elena.r@example.com', phone: '+1 234 567 8901', lastSeen: 'online', company: 'Innovate Inc.', role: 'CTO', activity: generateActivity('Elena Rodriguez'), notes: generateNotes('Elena Rodriguez'), },
  { id: 'contact-2', name: 'Marcus Chen', avatar: `https://avatar.vercel.sh/marcuschen.png`, online: false, tags: ['Returning Customer'], email: 'marcus.c@example.com', phone: '+1 345 678 9012', lastSeen: '2 hours ago', company: 'Solutions Co.', role: 'Product Manager', activity: generateActivity('Marcus Chen'), notes: generateNotes('Marcus Chen'), },
  { id: 'contact-3', name: 'Aisha Khan', avatar: `https://avatar.vercel.sh/aishakhan.png`, online: true, tags: ['Support Request'], email: 'aisha.k@example.com', phone: '+1 456 789 0123', lastSeen: 'online', company: 'Data Dynamics', role: 'Data Analyst', activity: generateActivity('Aisha Khan'), notes: generateNotes('Aisha Khan'), },
  { id: 'contact-4', name: 'Leo Tolstoy', avatar: `https://avatar.vercel.sh/leotolstoy.png`, online: false, tags: [], email: 'leo.tolstoy@example.com', phone: '+44 20 7946 0958', lastSeen: 'yesterday', company: 'Classic Reads', role: 'Author', activity: generateActivity('Leo Tolstoy'), notes: generateNotes('Leo Tolstoy'), }
];

// --- MESSAGE GENERATOR ---
const generateMessages = (count: number, contactName: string): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const random = Math.random();
    let sender: Message['sender'] = 'contact';
    let type: Message['type'] = 'comment';
    let text = `This is a sample message number ${i} from ${contactName}.`;
    let userId: string | undefined = undefined;

    if (random > 0.85) { // Internal Note
      sender = 'user';
      type = 'note';
      const user = mockAssignees[Math.floor(Math.random() * mockAssignees.length)];
      userId = user.id;
      text = `Internal note from ${user.name}: we should check their account history.`;
    } else if (random > 0.7) { // System message
      sender = 'system';
      type = 'system';
      text = `Task status changed to "in-progress"`;
    } else if (random > 0.35) { // User comment
      sender = 'user';
      type = 'comment';
      userId = 'user-1'; // "You"
      text = `This is a reply from me. Time is roughly ${count - i} hours ago.`;
    }
    
    messages.push({
      id: `msg-${Math.random()}`,
      text,
      timestamp: new Date(now.getTime() - i * 60 * 60 * 1000).toISOString(),
      sender,
      type,
      read: i < count - 2,
      userId,
    });
  }
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1] = {
    ...messages[messages.length-1],
    sender: 'contact',
    type: 'comment',
    text: `Hey! This is the latest message from ${contactName}.`,
    userId: undefined
  };
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- TASKS ---
const statuses: TaskStatus[] = ['open', 'in-progress', 'done', 'snoozed'];
const priorities: TaskPriority[] = ['none', 'low', 'medium', 'high'];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Question about enterprise pricing',
    contactId: 'contact-1',
    channel: 'whatsapp',
    unreadCount: 2,
    messages: generateMessages(15, 'Elena Rodriguez'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'in-progress',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    tags: ['onboarding', 'pricing'],
    aiSummary: { sentiment: 'positive', summaryPoints: ['Expressed strong interest in the new feature.', 'Asked about pricing tiers for enterprise.', 'Is ready for a follow-up call next week.',], suggestedReplies: ['Let\'s schedule that call!', 'Here is the pricing information.', 'Happy to hear you like it!',], },
    activeHandlerId: 'user-2', // Alex is handling this
  },
  {
    id: 'task-2',
    title: 'Minor issue with order #12345',
    contactId: 'contact-2',
    channel: 'instagram',
    unreadCount: 0,
    messages: generateMessages(8, 'Marcus Chen'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'done',
    assigneeId: 'user-1',
    dueDate: null,
    priority: 'medium',
    tags: ['bug-report'],
    aiSummary: { sentiment: 'neutral', summaryPoints: ['Reported a minor issue with order #12345.', 'Was satisfied with the proposed solution.', 'Inquired about the return policy.',], suggestedReplies: ['Can I help with anything else?', 'Here is our return policy.',], },
    activeHandlerId: null,
  },
  {
    id: 'task-3',
    title: 'Login issues, cannot reset password',
    contactId: 'contact-3',
    channel: 'facebook',
    unreadCount: 5,
    messages: generateMessages(20, 'Aisha Khan'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'open',
    assigneeId: null,
    dueDate: null,
    priority: 'high',
    tags: ['urgent', 'tech-support'],
    aiSummary: { sentiment: 'negative', summaryPoints: ['Frustrated with login issues.', 'Unable to reset password via email link.', 'Threatened to cancel their subscription.',], suggestedReplies: ['I\'m escalating this to our technical team.', 'Let\'s try a manual password reset.', 'We apologize for the inconvenience.',], },
    activeHandlerId: 'user-ai-1', // AI Assistant is handling this
  },
  {
    id: 'task-4',
    title: 'Follow-up on previous conversation',
    contactId: 'contact-4',
    channel: 'email',
    unreadCount: 0,
    messages: generateMessages(5, 'Leo Tolstoy'),
    get lastActivity() { return this.messages[this.messages.length - 1]; },
    status: 'snoozed',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    tags: [],
    aiSummary: { sentiment: 'neutral', summaryPoints: ['Followed up on a previous conversation.', 'Confirmed meeting time for Thursday.', 'No outstanding issues.',], suggestedReplies: ['Sounds good!', 'See you then!',], },
    activeHandlerId: null,
  },
];