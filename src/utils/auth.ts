'use client';

import { useRouter } from 'next/navigation';
import { useStore } from './zustand/store';


/**
 * Signs out the current user by calling the logout API
 * @returns {Promise<void>} A promise that resolves when sign out is complete
 */
export const signOut = async (): Promise<void> => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error during sign out:', error);
  }
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * React hook for signing out
 * @returns {() => Promise<void>} A function that signs out the user when called
 */
export const useSignOut = () => {
  const router = useRouter();
  const { resetUser } = useStore((state) => state.user);
  
  return async () => {
    // Reset user state in Zustand store
    resetUser();
    
    // Call the API to invalidate the session and clear cookies
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    
    // Redirect to login page
    router.push('/login');
  };
}; 