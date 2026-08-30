import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { CreateReviewResult, Review } from '../types';

const CREATE_REVIEW_MUTATION = gql`
  mutation Create_review($input: ReviewCreateInput!) {
    create_review(input: $input) {
      success
      error_message
      review {
        id
        content_title
        content_message
        store_id
        store_name
        rating
        created_at
      }
    }
  }
`;

interface CreateReviewArgs {
  storeId: string;
  rating: number;
  title: string;
  content: string;
}

export function useCreateReview() {
  const [createReviewMutation] = useMutation(CREATE_REVIEW_MUTATION);
  const [submitting, setSubmitting] = useState(false);

  const createReview = async ({ storeId, rating, title, content }: CreateReviewArgs): Promise<Review> => {
    setSubmitting(true);
    try {
      const { data } = await createReviewMutation({
        variables: {
          input: {
            store_id: storeId,
            rating,
            review_title: title,
            review_content: content,
          },
        },
      });
      const result: CreateReviewResult | undefined = data?.create_review;
      if (!result?.success || !result.review) {
        throw new Error(result?.error_message || 'Could not submit your review. Please try again.');
      }
      return result.review;
    } finally {
      setSubmitting(false);
    }
  };

  return { createReview, submitting };
}
