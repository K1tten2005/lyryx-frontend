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
