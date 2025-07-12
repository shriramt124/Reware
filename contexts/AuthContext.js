'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Fetch user data from the server
          const response = await fetch('/api/v1/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            // Since we're using mock data in the API, we need to handle it differently
            // In a real app with proper authentication, this would work correctly
            // For now, we'll use the mock data directly
            if (data.success && data.data) {
              setUser(data.data);
            } else {
              // If token is invalid, clear it
              localStorage.removeItem('token');
              setUser(null);
            }
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, clear token and user state
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token to localStorage
        if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          
          // Set user data
          if (data.data.user) {
            setUser(data.data.user);
          } else {
            // If user data is not included in the response, fetch it
            const userResponse = await fetch('/api/v1/users/profile', {
              headers: {
                'Authorization': `Bearer ${data.data.token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.success && userData.data) {
                setUser(userData.data);
              }
            }
          }
          
          return { success: true };
        } else {
          return { success: false, message: 'Invalid response from server' };
        }
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

 // Register function
  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token to localStorage
        if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          
          // Set user data
          if (data.data.user) {
            setUser(data.data.user);
          } else {
            // If user data is not included in the response, fetch it
            const userResponse = await fetch('/api/v1/users/profile', {
              headers: {
                'Authorization': `Bearer ${data.data.token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.success && userData.data) {
                setUser(userData.data);
              }
            }
          }
          
          return { success: true };
        } else {
          return { success: false, message: 'Invalid response from server' };
        }
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const token = getToken();
      
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }
      
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update user state with the returned data
        if (data.success && data.data && data.data.profile) {
          setUser(prev => ({
            ...prev,
            ...data.data.profile
          }));
          return { success: true, message: 'Profile updated successfully' };
        } else {
          return { success: true, message: 'Profile updated but data not returned' };
        }
      } else {
        return { success: false, message: data.message || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'An error occurred while updating profile' };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    getToken,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}