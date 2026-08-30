export interface ReviewBusiness {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  rating: number;
  ratingCount: number;
  imageUri?: string;
}

export interface Review {
  id: string;
  content_title: string;
  content_message: string;
  store_id: string;
  store_name: string;
  rating: number;
  created_at: string;
}

export interface CreateReviewResult {
  success: boolean;
  error_message: string | null;
  review: Review | null;
}
