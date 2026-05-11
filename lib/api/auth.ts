const API_URL = 'http://localhost:8080/v1';

export interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string;
  reputation_score: number;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserInfo;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  
  return response.json();
}

export async function signUp(username: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  
  return response.json();
}

export async function signOut(token: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/sign-out`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Sign out failed');
  }
  
  return true;
}
