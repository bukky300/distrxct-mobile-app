import { z } from 'zod';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500MB
export const MAX_VIDEO_DURATION_MS = 60_000; // 60s

const imageMediaSchema = z.object({
  kind: z.literal('image'),
  uri: z.string(),
  mimeType: z.string(),
  fileName: z.string(),
  base64: z.string(),
  fileSize: z.number().max(MAX_IMAGE_BYTES, 'Image must be 5MB or smaller.'),
});

const videoMediaSchema = z.object({
  kind: z.literal('video'),
  uri: z.string(),
  mimeType: z.string(),
  fileName: z.string(),
  fileSize: z.number().max(MAX_VIDEO_BYTES, 'Video must be 500MB or smaller.'),
  durationMs: z.number().max(MAX_VIDEO_DURATION_MS, 'Video must be 60 seconds or shorter.'),
});

export type ImageMediaValue = z.infer<typeof imageMediaSchema>;
export type VideoMediaValue = z.infer<typeof videoMediaSchema>;
export type PostMediaValue = ImageMediaValue | VideoMediaValue;

export const postFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),
    content: z.string().trim().min(1, 'Description is required.'),
    media: z.union([imageMediaSchema, videoMediaSchema]).nullable(),
    tag: z.object({ store_id: z.string(), store_name: z.string() }).nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.media) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['media'], message: 'Add a photo or video to post.' });
    }
  });

export type PostFormValues = z.infer<typeof postFormSchema>;
