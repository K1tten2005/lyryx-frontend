import { z } from 'zod';

export const SearchResultItemSchema = z.object({
  id: z.number(),
  title: z.string().optional(), // For songs
  name: z.string().optional(), // For artists/users
  username: z.string().optional(), // For users
  cover_url: z.string().optional(), // For songs/artists
  avatar_url: z.string().optional(), // For users
  artist_name: z.string().optional(), // For songs
  lyrics_snippet: z.string().optional(), // For lyrics
});

export const SearchResponseSchema = z.object({
  artists: z.array(SearchResultItemSchema).optional().default([]),
  songs: z.array(SearchResultItemSchema).optional().default([]),
  lyrics: z.array(SearchResultItemSchema).optional().default([]),
  users: z.array(SearchResultItemSchema).optional().default([]),
});

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export async function fetchSearchResults(query: string, limit: number = 20): Promise<SearchResponse> {
  const API_URL = 'http://localhost:8080/v1';
  
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await response.json();
  return SearchResponseSchema.parse(data);
}
