import type { ImageSourcePropType } from 'react-native';

export interface Friend {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  friendsCount: number;
  reviewsCount: number;
  /** Do you follow this person? */
  isFollowing: boolean;
  /** Do they follow you? */
  followsYou: boolean;
}
