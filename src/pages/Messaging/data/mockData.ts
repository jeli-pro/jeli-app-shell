import type { Contact, Task, Message, ActivityEvent, Note, Assignee, TaskStatus, TaskPriority, Channel, JourneyPointType } from '../types';
import { faker } from '@faker-js/faker';

// --- ASSIGNEES ---
export const mockAssignees: Assignee[] = [
  { id: 'user-1', name: 'You', avatar: `https://avatar.vercel.sh/you.png`, type: 'human' },
  { id: 'user-2', name: 'Alex Johnson', avatar: `https://avatar.vercel.sh/alex.png`, type: 'human' },
  { id: 'user-3', name: 'Samira Kumar', avatar: `https://avatar.vercel.sh/samira.png`, type: 'human' },
  { id: 'user-4', name: 'Casey Lee', avatar: `https://avatar.vercel.sh/casey.png`, type: 'human' },
  { id: 'user-5', name: 'Jordan Rivera', avatar: `https://avatar.vercel.sh/jordan.png`, type: 'human' },
  { id: 'user-ai-1', name: 'AI Assistant', avatar: `https://avatar.vercel.sh/ai.png`, type: 'ai' },
];

// --- HELPERS ---
const generateNotes = (contactName: string): Note[] => [
  { id: `note-${faker.string.uuid()}`, content: `Initial discovery call with ${contactName}. Seemed very interested in our enterprise package.`, createdAt: faker.date.past().toISOString() },
  { id: `note-${faker.string.uuid()}`, content: `Followed up via email with pricing details.`, createdAt: faker.date.recent().toISOString() },
];

const generateActivity = (contactName: string): ActivityEvent[] => [
  { id: `act-${faker.string.uuid()}`, type: 'email', content: `Sent follow-up email regarding pricing.`, timestamp: faker.date.past().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'call', content: `Had a 30-minute discovery call with ${contactName}.`, timestamp: faker.date.recent().toISOString() },
  { id: `act-${faker.string.uuid()}`, type: 'meeting', content: `Scheduled a demo for next week.`, timestamp: faker.date.soon().toISOString() },
];

// --- COMPANIES ---
const mockCompanies = Array.from({ length: 25 }, () => faker.company.name());

// --- CONTACTS ---
export const mockContacts: Contact[] = Array.from({ length: 80 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const company = faker.helpers.arrayElement(mockCompanies);
    return {
        id: `contact-${i + 1}`,
        name,
        avatar: `https://avatar.vercel.sh/${firstName.toLowerCase()}${lastName.toLowerCase()}.png`,
        online: faker.datatype.boolean(),
        tags: faker.helpers.arrayElements(['VIP', 'New Lead', 'Returning Customer', 'Support Request', 'High Value'], { min: 1, max: 3 }),
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        lastSeen: faker.datatype.boolean() ? 'online' : `${faker.number.int({ min: 2, max: 59 })} minutes ago`,
        company,
        role: faker.person.jobTitle(),
        activity: generateActivity(name),
        notes: generateNotes(name),
    };
});

// --- MESSAGE GENERATOR ---
const generateMessages = (messageCount: number, contactName: string, journeyPath: JourneyPointType[]): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  const journeyPointsWithIndices = journeyPath.map((point, index) => ({
      point,
      index: Math.floor((messageCount / journeyPath.length) * (index + Math.random() * 0.8))
  }));

  for (let i = 0; i < messageCount; i++) {
    const random = Math.random();
    let sender: Message['sender'] = 'contact';
    let type: Message['type'] = 'comment';
    let text = faker.lorem.sentence();
    let userId: string | undefined = undefined;

    if (random > 0.85) { // Internal Note
      sender = 'user';
      type = 'note';
      const user = faker.helpers.arrayElement(mockAssignees.filter(u => u.type === 'human'));
      userId = user.id;
      text = `Internal note from ${user.name}: ${faker.lorem.sentence()}`;
    } else if (random > 0.7) { // System message
      sender = 'system';
      type = 'system';
      text = faker.helpers.arrayElement(['Task status changed to "in-progress"', 'Task assigned to Alex Johnson', 'User joined the conversation']);
    } else if (random > 0.35) { // User comment
      sender = 'user';
      type = 'comment';
      userId = 'user-1'; // "You"
      text = faker.lorem.sentence();
    }
    
    const journeyPointInfo = journeyPointsWithIndices.find(jp => jp.index === i);

    messages.push({
      id: `msg-${faker.string.uuid()}`,
      text,
      timestamp: new Date(now.getTime() - (messageCount - i) * 60 * 60 * 100).toISOString(),
      sender,
      type,
      read: i < messageCount - faker.number.int({min: 0, max: 5}),
      userId,
      journeyPoint: journeyPointInfo?.point
    });
  }
  
  // Ensure the last message is from the contact for preview purposes
  messages[messages.length - 1] = {
    ...messages[messages.length-1],
    sender: 'contact',
    type: 'comment',
    text: `Hey! This is the latest message from ${contactName}. ${faker.lorem.sentence()}`,
    userId: undefined
  };
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// --- TASK GENERATOR ---
const generateTasks = (count: number): Task[] => {
    const tasks: Task[] = [];
    const statuses: TaskStatus[] = ['open', 'in-progress', 'done', 'snoozed'];
    const priorities: TaskPriority[] = ['none', 'low', 'medium', 'high'];
    const channels: Channel[] = ['whatsapp', 'instagram', 'facebook', 'email'];
    const possibleJourneys: JourneyPointType[][] = [
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Review'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Payment', 'Shipped', 'Delivered', 'Follow-up'],
        ['Inquiry', 'Consult', 'Follow-up'],
        ['Inquiry', 'Consult', 'Quote', 'Order', 'Canceled'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Delivered', 'Complain', 'Refund'],
        ['Consult', 'Order', 'Payment', 'Shipped', 'Complain', 'Follow-up'],
        ['Order', 'Delivered', 'Review', 'Reorder', 'Delivered'],
        ['Complain', 'Follow-up', 'Refund'],
        ['Quote', 'Follow-up', 'Order', 'Payment', 'Shipped', 'Delivered'],
        ['Inquiry', 'Quote', 'Order', 'Payment', 'Shipped', 'Canceled', 'Refund'],
        ['Consult', 'Follow-up'],
        ['Complain'],
        ['Order', 'Delivered'],
    ];

    for (let i = 0; i < count; i++) {
        const contact = faker.helpers.arrayElement(mockContacts);
        const status = faker.helpers.arrayElement(statuses);
        const unreadCount = status === 'open' || status === 'in-progress' ? faker.number.int({ min: 0, max: 8 }) : 0;
        const messageCount = faker.number.int({ min: 10, max: 150 });
        const journey = faker.helpers.arrayElement(possibleJourneys);
        const messages = generateMessages(messageCount, contact.name, journey);
        const assignee = faker.datatype.boolean(0.8) ? faker.helpers.arrayElement(mockAssignees) : null;

        const task: Task = {
            id: `task-${i + 1}`,
            title: faker.lorem.sentence({ min: 3, max: 7 }),
            contactId: contact.id,
            channel: faker.helpers.arrayElement(channels),
            unreadCount,
            messages,
            get lastActivity() { return this.messages[this.messages.length - 1]; },
            status,
            assigneeId: assignee?.id || null,
            dueDate: faker.datatype.boolean() ? faker.date.future().toISOString() : null,
            priority: faker.helpers.arrayElement(priorities),
            tags: faker.helpers.arrayElements(['onboarding', 'pricing', 'bug-report', 'urgent', 'tech-support'], faker.number.int({min: 0, max: 2})),
            aiSummary: {
                sentiment: faker.helpers.arrayElement(['positive', 'negative', 'neutral']),
                summaryPoints: Array.from({ length: 3 }, () => faker.lorem.sentence()),
                suggestedReplies: Array.from({ length: 2 }, () => faker.lorem.words({ min: 3, max: 6})),
            },
            activeHandlerId: faker.helpers.arrayElement([assignee?.id ?? null, null, 'user-ai-1']),
        };
        tasks.push(task);
    }
    return tasks;
}

export const mockTasks: Task[] = generateTasks(200);