
export interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
}

export const formSchema = {
  email: {
    required: "Email is required",
    email: "Invalid email format"
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters"
    }
  }
};
