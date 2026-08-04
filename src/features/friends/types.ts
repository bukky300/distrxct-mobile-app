export interface MediaSet {
  original: string | null;
  thumbnail: string | null;
  medium: string | null;
}

export interface FriendUserSummary {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: MediaSet | null;
}

// Backend field coverage varies by which operation populated this object — e.g. the
// followers/following list query never returns location or reviewsCount for nested
// entries, only the single-user detail query does. Keep everything beyond the
// summary optional and let callers fall back gracefully (matches web's own behavior).
export interface FriendUser extends FriendUserSummary {
  location?: { formatted_address: string | null } | null;
  followers?: FriendUserSummary[];
  following?: FriendUserSummary[];
  reviewsCount?: number;
  relatedFriendsCount?: number;
}

export interface ConnectionStatus {
  is_following: boolean;
  is_followed_by: boolean;
  is_mutual: boolean;
}
