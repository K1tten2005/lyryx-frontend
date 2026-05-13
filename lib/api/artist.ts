const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ArtistSong {
  id: number;
  title: string;
  cover_url: string;
  release_date: string;
  views: number;
}

export interface ArtistProfile {
  id: number;
  name: string;
  bio: string;
  avatar_url: string;
  songs: ArtistSong[];
}

export async function getArtistById(id: number): Promise<ArtistProfile | null> {
  const response = await fetch(`${API_URL}/v1/artist/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch artist');
  }

  return response.json();
}
