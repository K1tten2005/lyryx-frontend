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

// Re-exporting common types if needed, or keeping it clean
