export interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatarUri: string;
}

// Mock data — replace with a real blocked-users query/mutation when available.
export const MOCK_BLOCKED_USERS: BlockedUser[] = [
  {
    id: '1',
    name: 'John mark',
    username: '@buno23',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
  {
    id: '2',
    name: 'John mark',
    username: '@buno23',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
];
