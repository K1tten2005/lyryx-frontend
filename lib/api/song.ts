import { z } from 'zod';

export const SongSchema = z.object({
  id: z.number(),
  title: z.string(),
  lyrics: z.string(),
  release_date: z.string().optional(),
  views: z.number().optional(),
  artist: z.object({
    id: z.number(),
    name: z.string(),
  }),
  cover_url: z.string().optional(),
});

export type Song = z.infer<typeof SongSchema>;

export const AnnotationUserSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  reputation_score: z.number(),
  avatar_url: z.string().optional(),
});

export type AnnotationUser = z.infer<typeof AnnotationUserSchema>;

export const AnnotationSchema = z.object({
  id: z.number(),
  song_id: z.number().optional(),
  content: z.string().default(''),
  start_index: z.number(),
  end_index: z.number(),
  rating: z.number().default(0),
  my_vote: z.number().nullable().optional(),
  created_at: z.string().optional(),
  user: AnnotationUserSchema.optional(),
});

export type Annotation = z.infer<typeof AnnotationSchema>;

export const UpdateAnnotationResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  rating: z.number(),
  updated_at: z.string().optional(),
});

export type UpdateAnnotationResponse = z.infer<typeof UpdateAnnotationResponseSchema>;

export const VoteAnnotationResponseSchema = z.object({
  annotation_id: z.number(),
  my_vote: z.number(),
  new_rating: z.number(),
});

export type VoteAnnotationResponse = z.infer<typeof VoteAnnotationResponseSchema>;

export const AiAnnotationResponseSchema = z.object({
  response: z.string(),
});

export type AiAnnotationResponse = z.infer<typeof AiAnnotationResponseSchema>;

const API_URL = 'http://localhost:8080/v1';

/**
 * Fetches a song by its ID.
 * @param id The song ID.
 * @returns The song data or null if not found.
 * @throws Error if the request fails with a status other than 404.
 */
export async function getSongById(id: number): Promise<Song | null> {
  const response = await fetch(`${API_URL}/song/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch song');
  }

  const data = await response.json();
  return SongSchema.parse(data);
}

/**
 * Fetches all annotations for a given song.
 * @param songId The song ID.
 * @param token The user's authentication token (optional, for getting my_vote).
 * @returns A list of annotations.
 */
export async function getSongAnnotations(songId: number, token?: string): Promise<Annotation[]> {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}/song/${songId}/annotations`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch annotations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Raw annotations data:", data);

  const result = z.array(AnnotationSchema).safeParse(data.annotations);
  if (!result.success) {
    console.error("Annotation validation failed:", result.error.format());
    // Try to return at least some data if possible, or return empty
    return (data.annotations || []) as Annotation[];
  }

  return result.data;
}

/**
 * Creates a new annotation for a song.
 * @param songId The song ID.
 * @param content The annotation content.
 * @param startIndex The start index in the lyrics.
 * @param endIndex The end index in the lyrics.
 * @param token The user's authentication token.
 * @returns The created annotation.
 */
export async function createAnnotation(
  songId: number,
  content: string,
  startIndex: number,
  endIndex: number,
  token?: string
): Promise<Annotation> {
  const authToken = token || localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/song/${songId}/annotation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      songID: songId,
      content,
      start_index: startIndex,
      end_index: endIndex,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create annotation: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return AnnotationSchema.parse(data);
}

/**
 * Updates an annotation's content.
 * @param annotationId The annotation ID.
 * @param content The new content.
 * @param token The user's authentication token.
 * @returns The updated annotation response.
 */
export async function updateAnnotation(
  annotationId: number,
  content: string,
  token?: string
): Promise<UpdateAnnotationResponse> {
  const authToken = token || localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/annotation/${annotationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      annotationID: annotationId,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update annotation: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return UpdateAnnotationResponseSchema.parse(data);
}

/**
 * Deletes an annotation.
 * @param annotationId The annotation ID.
 * @param token The user's authentication token.
 */
export async function deleteAnnotation(annotationId: number, token?: string): Promise<void> {
  const authToken = token || localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/annotation/${annotationId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete annotation: ${response.status} ${response.statusText}`);
  }
}

/**
 * Votes for an annotation (+1 or -1).
 * @param annotationId The annotation ID.
 * @param value The vote value (1 or -1).
 * @param token The user's authentication token.
 * @returns The new vote state.
 */
export async function voteAnnotation(
  annotationId: number,
  value: number,
  token?: string
): Promise<VoteAnnotationResponse> {
  const authToken = token || localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/annotation/${annotationId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      annotationID: annotationId,
      value,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to vote for annotation: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return VoteAnnotationResponseSchema.parse(data);
}

/**
 * Removes a user's vote for an annotation.
 * @param annotationId The annotation ID.
 * @param token The user's authentication token.
 */
export async function deleteVote(annotationId: number, token?: string): Promise<void> {
  const authToken = token || localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/annotation/${annotationId}/vote`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to remove vote: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetches an AI-generated annotation (explanation) for a specific lyrics segment.
 * @param songId The song ID.
 * @param question The user's question about the lyrics.
 * @param startIndex The start index of the selected lyrics.
 * @param endIndex The end index of the selected lyrics.
 * @returns The AI's response.
 */
export async function getAiAnnotation(
  songId: number,
  question: string,
  startIndex: number,
  endIndex: number
): Promise<AiAnnotationResponse> {
  const params = new URLSearchParams({
    question,
    start_index: startIndex.toString(),
    end_index: endIndex.toString(),
  });

  const response = await fetch(`${API_URL}/song/${songId}/ai-annotation?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI annotation: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return AiAnnotationResponseSchema.parse(data);
}

