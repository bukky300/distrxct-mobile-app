import type { ImageSourcePropType } from 'react-native';

export interface ReviewBreakdownRow {
  star: 5 | 4 | 3 | 2 | 1;
  count: number;
}

export interface BusinessReview {
  id: string;
  user: { name: string; avatarUri?: string };
  timestamp: string;
  rating: number;
  comment: string;
  helpfulCount: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  percentRecommended: number;
  breakdown: ReviewBreakdownRow[];
}

export interface Business {
  id: string;
  name: string;
  category: string;
  isOpen: boolean;
  address: string;
  rating: number;
  ratingCount: number;
  isBookmarked: boolean;
  /** Card cover image shown in the Discover list */
  coverImage: ImageSourcePropType;
  /** Small square logo shown on the business detail header */
  logo: ImageSourcePropType;
  /** Full photo set used by the detail carousel + gallery */
  images: ImageSourcePropType[];
  description: string;
  website?: string;
  phone?: string;
  reviewSummary: ReviewSummary;
  reviews: BusinessReview[];
}
