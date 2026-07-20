import type { Friend } from '../types';

// Placeholder data — replace with real API call
export const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Kinsley Ekene',
    avatar: require('../../../../assets/images/profile.png'),
    friendsCount: 102,
    reviewsCount: 67,
    isFollowing: false,
    followsYou: true,
  },
  {
    id: '2',
    name: 'Sampato',
    avatar: require('../../../../assets/images/reviewprofile.png'),
    friendsCount: 58,
    reviewsCount: 23,
    isFollowing: true,
    followsYou: true,
  },
  {
    id: '3',
    name: 'Tunde_Lagos',
    avatar: require('../../../../assets/images/profile.png'),
    friendsCount: 14,
    reviewsCount: 4,
    isFollowing: false,
    followsYou: false,
  },
  {
    id: '4',
    name: 'Larry_o9',
    avatar: require('../../../../assets/images/reviewprofile.png'),
    friendsCount: 76,
    reviewsCount: 31,
    isFollowing: true,
    followsYou: false,
  },
];

export function getFriendById(id: string): Friend | undefined {
  return MOCK_FRIENDS.find(f => f.id === id);
}
