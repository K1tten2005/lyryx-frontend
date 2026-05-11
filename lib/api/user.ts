const API_URL = 'http://localhost:8080/v1';

export interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  role: string;
  reputation_score: number;
  bio?: string;
  avatar_url?: string;
}

export interface ArtistInfo {
  id: number;
  name: string;
}

export interface SongInfo {
  id: number;
  title: string;
  cover_url: string;
  artist: ArtistInfo;
}

export interface UserAnnotation {
  id: number;
  content: string;
  rating: number;
  my_vote?: number;
  start_index: number;
  end_index: number;
  snippet?: string;
  created_at: string;
  updated_at: string;
  song: SongInfo;
}

export interface GetUserAnnotationsOut {
  user_id: number;
  annotations: UserAnnotation[];
  total: number;
  has_more: boolean;
}

export async function getUserProfile(userId: number): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return response.json();
}

export async function getUserMe(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/user/me`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch your profile');
  }

  return response.json();
}

export async function getUserAnnotations(
  userId: number,
  limit: number = 20,
  offset: number = 0
): Promise<GetUserAnnotationsOut> {
  const response = await fetch(
    `${API_URL}/user/${userId}/annotations?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user annotations');
  }

  return response.json();
}

export async function updateUserProfile(
  token: string,
  data: Partial<UserProfile & { password?: string }>
): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/user/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user profile');
  }

  return response.json();
}

export async function updateUserAvatar(
  token: string,
  file: File
): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_URL}/user/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user avatar');
  }

  return response.json();
}
