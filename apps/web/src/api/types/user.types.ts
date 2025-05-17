export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profilePic: string;
  settings: Record<string, any>;
  createdAt: string;
}
