export interface MediaUrls {
  original: string | null;
  thumbnail: string | null;
  medium: string | null;
}

export interface MediaMetadata {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  size_bytes: number;
  cdn_url: string;
  thumbnail_url: string | null;
  medium_url: string | null;
  bunny_stream_id: string | null;
  status: string;
  created_at: string;
}

export interface PostAuthor {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: MediaUrls | null;
}

export interface PostTag {
  id: string;
  store: { id: string; name: string };
}

export interface Post {
  id: string;
  post_title: string | null;
  post_content: string | null;
  created_at: string;
  updated_at: string | null;
  tag: PostTag | null;
  media_url: MediaUrls[] | null;
  media_metadata: MediaMetadata[] | null;
  helpful_count: number;
  comment_count: number;
  is_helpful_by_current_user: boolean;
  author: PostAuthor | null;
}

export interface VideoStatus {
  video_id: string;
  status: string;
  error_message: string | null;
  media_metadata: MediaMetadata | null;
}

export interface CreatePostResult {
  success: boolean;
  error_message: string | null;
  post: Post | null;
  video_statuses: VideoStatus[];
}

export interface StoreOption {
  id: string;
  name: string;
}

export type FeedType = 'HOME' | 'FOLLOWING';

export interface FeedItem {
  post: Post | null;
}

export interface FeedEdge {
  node: FeedItem;
  cursor: string;
}

export interface FeedPageInfo {
  has_next_page: boolean;
  end_cursor: string | null;
}

export interface FeedConnection {
  edges: FeedEdge[];
  page_info: FeedPageInfo;
}

export interface CommentAuthor {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: MediaUrls | null;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: CommentAuthor;
}

export interface CommentConnection {
  comments: Comment[];
  total_count: number;
  has_next_page: boolean;
}
