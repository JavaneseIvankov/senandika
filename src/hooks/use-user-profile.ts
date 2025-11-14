"use client";

import { useSession } from "@/lib/auth-client";

/**
 * Custom hook for managing user profile data from Better Auth session
 * 
 * @returns User profile data with loading state
 */
export function useUserProfile() {
  const { data: session, isPending, error } = useSession();

  const user = session?.user;

  return {
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      : null,
    isLoading: isPending,
    error: error,
    session,
  };
}
