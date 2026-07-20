export interface NotificationItem {
  id: string;
  avatarUri: string;
  title: string;
  body: string;
  read: boolean;
}

// Mock data — replace with a real notifications query when available.
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    title: 'Welcome to Distrxct 🎉',
    body: 'Your account is all set up. Start exploring local businesses near you.',
    read: false,
  },
  {
    id: '2',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    title: 'You have a message',
    body: '@dbranddr sent you a message about a place you both follow — take a look.',
    read: false,
  },
  {
    id: '3',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    title: 'You have a message',
    body: '@dbranddr replied to your review — check what they had to say.',
    read: false,
  },
  {
    id: '4',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    title: 'New follower',
    body: '@dbranddr started following you on Distrxct.',
    read: false,
  },
  {
    id: '5',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    title: 'Your review got noticed',
    body: 'Your review of Kilimanjaro Restaurant just crossed 20 helpful votes.',
    read: true,
  },
];
