
import { UserProfile } from "./types";

/**
 * Generate a random color based on user ID
 */
export const getRandomColor = (id: string) => {
  // Generate a consistent color based on user ID
  const colors = [
    "from-blue-500/60 to-indigo-500/60",
    "from-green-500/60 to-emerald-500/60",
    "from-purple-500/60 to-pink-500/60",
    "from-amber-500/60 to-orange-500/60",
    "from-red-500/60 to-rose-500/60",
    "from-cyan-500/60 to-sky-500/60"
  ];
  
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

/**
 * Extract initials from email (before @)
 */
export const getInitials = (email: string) => {
  const name = email.split('@')[0];
  if (name.length <= 2) return name.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};
