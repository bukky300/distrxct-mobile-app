export interface ConversationPreview {
  id: string;
  name: string;
  avatarUri: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
  read?: boolean;
}

// Mock data — replace with a real conversations query/subscription when available.
export const MOCK_CONVERSATIONS: ConversationPreview[] = [
  {
    id: '1',
    name: 'Ologwu Samuel',
    avatarUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    online: true,
    lastMessage: 'Hello I just sent in an update on the task, please review and share some feedback...',
    timestamp: '12:00 PM',
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Segun Obi',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    online: false,
    lastMessage: 'Hello I just sent in an update on the task, please review and share some feedback...',
    timestamp: '12:00 PM',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Kelly Johnson',
    avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    online: false,
    lastMessage: 'Hello I just sent in an update on the task, please review and share some feedback...',
    timestamp: 'Yesterday',
    unreadCount: 0,
  },
];

export function getConversationById(id: string): ConversationPreview | undefined {
  return MOCK_CONVERSATIONS.find(c => c.id === id);
}

// Mock thread — same demo thread for every conversation, replace with a real query.
export const MOCK_THREAD: ChatMessage[] = [
  { id: 'm1', text: 'Hello John!, Good morning!', fromMe: true, timestamp: '05:23 AM', read: true },
  {
    id: 'm2',
    text: 'Texting to know our plans concerning the food',
    fromMe: true,
    timestamp: '05:23 AM',
    read: true,
  },
  {
    id: 'm3',
    text: 'Thank you for letting me know, will get back soon',
    fromMe: false,
    timestamp: '08:15 PM',
  },
  { id: 'm4', text: 'Okay sure, will be expecting champ. 🙌', fromMe: true, timestamp: '05:23 AM', read: true },
];
