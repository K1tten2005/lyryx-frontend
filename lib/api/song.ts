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
  content: z.string(),
  start_index: z.number(),
  end_index: z.number(),
  rating: z.number(),
  my_vote: z.number().nullable().optional(),
  created_at: z.string(),
  user: AnnotationUserSchema,
});

export type Annotation = z.infer<typeof AnnotationSchema>;

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
 * @returns A list of annotations.
 */
export async function getSongAnnotations(songId: number): Promise<Annotation[]> {
  const response = await fetch(`${API_URL}/song/${songId}/annotations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch annotations');
  }

  const data = await response.json();
  return z.array(AnnotationSchema).parse(data.annotations);
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
  token: string
): Promise<Annotation> {
  const response = await fetch(`${API_URL}/song/${songId}/annotation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      songID: songId,
      content,
      start_index: startIndex,
      end_index: endIndex,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create annotation');
  }

  const data = await response.json();
  return AnnotationSchema.parse(data);
}
