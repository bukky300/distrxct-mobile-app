import { useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { PostReport, ReportReason } from '../types';

const REPORT_POST = gql`
  mutation Report_post($input: PostReportInput!) {
    report_post(input: $input) {
      status
      reporter_user_id
      reason
      post_id
      id
      details
      created_at
    }
  }
`;

type ReportResult = { ok: true } | { ok: false; message: string };

export function useReportPost(postId: string) {
  const [mutate, { loading }] = useMutation<{ report_post: PostReport }>(REPORT_POST);

  const reportPost = useCallback(
    async (reason: ReportReason, details: string): Promise<ReportResult> => {
      try {
        const { data } = await mutate({
          variables: { input: { post_id: postId, reason, details: details.trim() } },
        });
        // report_post is schema non-null, but a resolver error under errorPolicy handling
        // can still surface as an empty payload — don't treat "didn't throw" as success.
        if (!data?.report_post) {
          return { ok: false, message: "Couldn't submit your report. Try again." };
        }
        return { ok: true };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : "Couldn't submit your report. Try again." };
      }
    },
    [mutate, postId],
  );

  return { reportPost, submitting: loading };
}
