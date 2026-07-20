import { useCallback } from 'react';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import type { FeedConnection, FeedType, Post } from '../types';

const FEED_QUERY = gql`
  query Feed($first: Int!, $feedType: FeedType!, $after: String) {
    feed(first: $first, feed_type: $feedType, after: $after) {
      edges {
        node {
          post {
            id
            post_title
            post_content
            comment_count
            helpful_count
            created_at
            updated_at
            is_helpful_by_current_user
            tag {
              id
              store {
                id
                name
              }
            }
            media_url {
              original
              thumbnail
              medium
            }
            media_metadata {
              id
              file_name
              file_type
              mime_type
              size_bytes
              cdn_url
              thumbnail_url
              medium_url
              bunny_stream_id
              status
              created_at
            }
            author {
              id
              username
              first_name
              last_name
              profile_picture {
                original
                thumbnail
                medium
              }
            }
          }
        }
        cursor
      }
      page_info {
        has_next_page
        end_cursor
      }
    }
  }
`;

// Web's default is 4; a mobile viewport shows less per screen than that would fill,
// which triggers onEndReached almost immediately after load. Bumped for more buffer.
const PAGE_SIZE = 8;

export function useFeed(feedType: FeedType = 'HOME') {
  const { data, error, fetchMore, refetch, networkStatus } = useQuery<{ feed: FeedConnection }>(
    FEED_QUERY,
    {
      variables: { first: PAGE_SIZE, feedType, after: null },
      notifyOnNetworkStatusChange: true,
    },
  );

  const connection = data?.feed;
  const posts: Post[] = (connection?.edges ?? [])
    .map(edge => edge.node.post)
    .filter((post): post is Post => post !== null);
  const hasNextPage = connection?.page_info.has_next_page ?? false;
  const endCursor = connection?.page_info.end_cursor ?? null;

  const loadMore = useCallback(() => {
    if (!hasNextPage || networkStatus === NetworkStatus.fetchMore) return;
    fetchMore({ variables: { first: PAGE_SIZE, feedType, after: endCursor } });
  }, [hasNextPage, networkStatus, fetchMore, feedType, endCursor]);

  const onRefresh = useCallback(() => {
    return refetch({ first: PAGE_SIZE, feedType, after: null });
  }, [refetch, feedType]);

  return {
    posts,
    // Only the very first load with nothing on screen yet — refetch/fetchMore have their own flags.
    loading: networkStatus === NetworkStatus.loading,
    refreshing: networkStatus === NetworkStatus.refetch,
    fetchingMore: networkStatus === NetworkStatus.fetchMore,
    error,
    hasNextPage,
    loadMore,
    onRefresh,
  };
}
