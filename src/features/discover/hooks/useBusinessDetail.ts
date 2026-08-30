import { useQuery, gql } from '@apollo/client';
import { PLACEHOLDER_STORE } from '../utils/placeholderStore';
import { relativeTime } from '@features/friends/utils/relativeTime';
import { fullName } from '@features/friends/utils/formatName';
import type { Business, BusinessReview } from '../types';

const GET_BUSINESS_DETAIL = gql`
  query GetBusinessDetail($storeIdStr: String!, $storeIdUuid: UUID!, $limit: Int!, $offset: Int!, $timeRange: TimeRange!) {
    get_store_by_id(store_id: $storeIdStr) {
      id
      name
      description
      whatsapp_number
      average_rating
      review_count
      is_bookmarked
      logo {
        original
      }
      media_url {
        original
      }
      location {
        formattedAddress
      }
      store_type {
        name
      }
      rating_distribution {
        one_star
        two_star
        three_star
        four_star
        five_star
        total_reviews
      }
    }
    get_reviews_by_store_id(store_id: $storeIdUuid, limit: $limit, offset: $offset, time_range: $timeRange) {
      id
      content_title
      content_message
      rating
      help_count
      created_at
      author {
        first_name
        last_name
        profile_picture {
          thumbnail
        }
      }
    }
  }
`;

interface RawMediaItem {
  original: string | null;
}

interface RawReview {
  id: string;
  content_title: string | null;
  content_message: string | null;
  rating: number;
  help_count: number;
  created_at: string;
  author: { first_name: string | null; last_name: string | null; profile_picture: { thumbnail: string | null } | null } | null;
}

interface RawStoreDetail {
  id: string;
  name: string;
  description: string | null;
  whatsapp_number: string | null;
  average_rating: number | null;
  review_count: number;
  is_bookmarked: boolean | null;
  logo: RawMediaItem | null;
  media_url: RawMediaItem[] | null;
  location: { formattedAddress: string | null } | null;
  store_type: { name: string } | null;
  rating_distribution: {
    one_star: number;
    two_star: number;
    three_star: number;
    four_star: number;
    five_star: number;
    total_reviews: number;
  } | null;
}

const REVIEWS_PAGE_SIZE = 20;

function toBusinessReview(review: RawReview): BusinessReview {
  const name = fullName(review.author?.first_name, review.author?.last_name) || 'Distrxct user';
  const title = review.content_title?.trim();
  const message = review.content_message ?? '';

  return {
    id: review.id,
    user: { name, avatarUri: review.author?.profile_picture?.thumbnail ?? undefined },
    timestamp: relativeTime(review.created_at),
    rating: review.rating,
    comment: title ? `${title}\n${message}` : message,
    helpfulCount: review.help_count,
  };
}

function toBusinessDetail(store: RawStoreDetail, reviews: RawReview[]): Business {
  const images = (store.media_url ?? [])
    .filter(m => m.original)
    .map(m => ({ uri: m.original! }));
  const logo = store.logo?.original ? { uri: store.logo.original } : PLACEHOLDER_STORE;
  const dist = store.rating_distribution;
  const total = dist?.total_reviews ?? 0;
  const recommended = dist ? dist.four_star + dist.five_star : 0;

  return {
    id: store.id,
    name: store.name,
    category: store.store_type?.name ?? '',
    // Backend doesn't expose live open/closed state via this query; assume open rather
    // than guessing wrong from open_hour/close_hour without a timezone-aware "now".
    isOpen: true,
    address: store.location?.formattedAddress ?? '',
    rating: store.average_rating ?? 0,
    ratingCount: store.review_count,
    isBookmarked: store.is_bookmarked ?? false,
    coverImage: images[0] ?? logo,
    logo,
    images: images.length > 0 ? images : [logo],
    description: store.description ?? '',
    phone: store.whatsapp_number ?? undefined,
    reviewSummary: {
      average: store.average_rating ?? 0,
      total,
      percentRecommended: total > 0 ? Math.round((recommended / total) * 100) : 0,
      breakdown: dist
        ? [
            { star: 5, count: dist.five_star },
            { star: 4, count: dist.four_star },
            { star: 3, count: dist.three_star },
            { star: 2, count: dist.two_star },
            { star: 1, count: dist.one_star },
          ]
        : [],
    },
    reviews: reviews.map(toBusinessReview),
  };
}

export function useBusinessDetail(businessId: string | undefined) {
  const { data, loading, error, refetch } = useQuery<{
    get_store_by_id: RawStoreDetail | null;
    get_reviews_by_store_id: RawReview[] | null;
  }>(GET_BUSINESS_DETAIL, {
    variables: {
      storeIdStr: businessId,
      storeIdUuid: businessId,
      limit: REVIEWS_PAGE_SIZE,
      offset: 0,
      timeRange: 'ALL_TIME',
    },
    skip: !businessId,
    fetchPolicy: 'network-only',
  });

  const business = data?.get_store_by_id
    ? toBusinessDetail(data.get_store_by_id, data.get_reviews_by_store_id ?? [])
    : null;

  return { business, loading, error, refetch };
}
