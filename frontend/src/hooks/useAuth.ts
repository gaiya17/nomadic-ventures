import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../lib/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const storedUser = localStorage.getItem('admin_user');

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse admin_user", e);
          localStorage.removeItem('admin_user');
        }
      }

      try {
        // Ping the backend to ensure the token is actually still valid and not expired
        const response = await fetchApi('/auth/me', { method: 'GET' });
        
        if (response.ok && response.data.user) {
          // Token is valid, update with freshest data from the database
          setUser(response.data.user);
          localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        } else {
          // Token is invalid or expired! API wrapper already clears localStorage, so we just clear state
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (userData: AdminUser) => {
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/admin-dashboard');
  };

  const logout = async () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    router.push('/login');
  };

  // Check auth and redirect if not logged in
  const requireAuth = () => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  };

  // Redirect to dashboard if already logged in (used on login page)
  const redirectIfAuthenticated = () => {
    if (!isLoading && user) {
      router.push('/admin-dashboard');
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    requireAuth,
    redirectIfAuthenticated
  };
}
