import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import * as FileSystem from 'expo-file-system';
import type { PostFormValues } from '../schema/postFormSchema';
import type { CreatePostResult, Post } from '../types';

const CREATE_POST_MUTATION = gql`
  mutation Create_post($input: PostCreateInput!) {
    create_post(input: $input) {
      success
      error_message
      video_statuses {
        video_id
        status
        error_message
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
      }
      post {
        id
        post_title
        post_content
        created_at
        updated_at
        tag {
          id
          store {
            id
            name
          }
        }
        media_url {
          thumbnail
          original
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
        helpful_count
        comment_count
        is_helpful_by_current_user
        author {
          id
          username
          first_name
          last_name
          profile_picture {
            thumbnail
            original
            medium
          }
        }
      }
    }
  }
`;

const REQUEST_VIDEO_UPLOAD_MUTATION = gql`
  mutation RequestVideoUpload($title: String!, $entity_type: String!) {
    request_video_upload(title: $title, entity_type: $entity_type) {
      success
      message
      video_id
      upload_url
      access_key
      library_id
    }
  }
`;

// Streams the file from disk (rather than loading it into a JS Blob first) so large
// videos don't risk memory pressure/crashes, and still reports upload progress.
function uploadVideoToBunny(
  fileUri: string,
  uploadUrl: string,
  accessKey: string,
  mimeType: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const task = FileSystem.createUploadTask(
      uploadUrl,
      fileUri,
      {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: { AccessKey: accessKey, 'Content-Type': mimeType },
      },
      progress => {
        if (progress.totalBytesExpectedToSend > 0) {
          onProgress(Math.round((progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100));
        }
      },
    );

    task
      .uploadAsync()
      .then(result => {
        if (!result || result.status < 200 || result.status >= 300) {
          reject(new Error('Video upload failed. Please try again.'));
          return;
        }
        resolve();
      })
      .catch(() => reject(new Error('Video upload failed. Please try again.')));
  });
}

export function useCreatePost() {
  const [createPostMutation] = useMutation(CREATE_POST_MUTATION);
  const [requestVideoUploadMutation] = useMutation(REQUEST_VIDEO_UPLOAD_MUTATION);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const createPost = async (values: PostFormValues): Promise<Post> => {
    if (!values.media) throw new Error('Add a photo or video to post.');

    setSubmitting(true);
    setUploadProgress(null);
    try {
      const input: Record<string, unknown> = {
        post_title: values.title,
        post_content: values.content,
        tag: values.tag,
      };

      if (values.media.kind === 'image') {
        input.media = [
          {
            mime_type: values.media.mimeType,
            file_name: values.media.fileName,
            file_data: values.media.base64,
          },
        ];
      } else {
        const { data: requestData } = await requestVideoUploadMutation({
          variables: { title: values.title, entity_type: 'post' },
        });
        const uploadRequest = requestData?.request_video_upload;
        if (!uploadRequest?.success || !uploadRequest.upload_url || !uploadRequest.access_key || !uploadRequest.video_id) {
          throw new Error(uploadRequest?.message || 'Could not start video upload.');
        }

        setUploadProgress(0);
        await uploadVideoToBunny(
          values.media.uri,
          uploadRequest.upload_url,
          uploadRequest.access_key,
          values.media.mimeType,
          setUploadProgress,
        );

        input.videos = [
          {
            video_id: uploadRequest.video_id,
            size_bytes: values.media.fileSize,
            mime_type: values.media.mimeType,
            file_name: values.media.fileName,
          },
        ];
      }

      const { data } = await createPostMutation({ variables: { input } });
      const result: CreatePostResult | undefined = data?.create_post;
      if (!result?.success || !result.post) {
        throw new Error(result?.error_message || 'Could not create your post. Please try again.');
      }
      return result.post;
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return { createPost, submitting, uploadProgress };
}
