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

export interface PostArtistIn {
  name: string;
  bio?: string;
}

export interface PatchUpdateArtistIn {
  name?: string;
  bio?: string;
}

export async function createArtist(token: string, data: PostArtistIn): Promise<ArtistProfile> {
  const response = await fetch(`${API_URL}/v1/artist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create artist');
  }

  return response.json();
}

export async function updateArtist(token: string, id: number, data: PatchUpdateArtistIn): Promise<ArtistProfile> {
  const response = await fetch(`${API_URL}/v1/artist/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // The test expects artistID to be passed in body too based on Swagger
    body: JSON.stringify({ artistID: id, ...data })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update artist');
  }

  return response.json();
}

export async function updateArtistAvatar(token: string, id: number, file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_URL}/v1/artist/${id}/avatar`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update artist avatar');
  }

  return response.json();
}

export async function getArtistById(id: number, limit: number = 20, offset: number = 0): Promise<ArtistProfile | null> {
  const url = new URL(`${API_URL}/v1/artist/${id}`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString(), {
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
