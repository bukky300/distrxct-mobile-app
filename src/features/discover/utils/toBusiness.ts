import { PLACEHOLDER_STORE } from './placeholderStore';
import type { Business } from '../types';

export interface RawStore {
  id: string;
  name: string;
  average_rating: number | null;
  review_count: number;
  is_bookmarked: boolean | null;
  location: { formattedAddress: string | null } | null;
  media_url: { original: string | null; thumbnail: string | null; medium: string | null }[] | null;
  store_categories: { id: string; name: string }[];
}

export function toBusiness(store: RawStore): Business {
  // media_url is a list (a store's photo gallery) — use the first image as the card's
  // cover/logo. Previously read as if it were a single object, so every business image
  // silently fell back to the placeholder.
  const firstImage = store.media_url?.[0];
  const image = firstImage?.original ? { uri: firstImage.original } : PLACEHOLDER_STORE;

  return {
    id: store.id,
    name: store.name,
    category: store.store_categories?.[0]?.name ?? '',
    // Backend doesn't expose live open/closed state via this query; assume open rather
    // than guessing wrong from open_hour/close_hour without a timezone-aware "now".
    isOpen: true,
    address: store.location?.formattedAddress ?? '',
    rating: store.average_rating ?? 0,
    ratingCount: store.review_count,
    isBookmarked: store.is_bookmarked ?? false,
    coverImage: image,
    logo: image,
    images: [image],
    description: '',
    reviewSummary: {
      average: store.average_rating ?? 0,
      total: store.review_count,
      percentRecommended: 0,
      breakdown: [],
    },
    reviews: [],
  };
}
