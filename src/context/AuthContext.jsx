import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { logLogin, logLogout } from '../utils/auditLog';

const AuthContext = createContext();

// Session timeout: 30 minutes of inactivity
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Session timeout - auto logout after inactivity
  useEffect(() => {
    if (!user) return;

    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Auto logout after inactivity
        logout(true); // true = auto logout
        // Alert removed to prevent annoying popups on public pages
        // The user will simply be redirected to login next time they try to access admin
      }, SESSION_TIMEOUT);
    };

    // Events that reset the timeout
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, resetTimeout, { passive: true });
    });

    // Start the timeout
    resetTimeout();

    // Cleanup
    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Log successful login
      try {
        await logLogin(userCredential.user);
      } catch (logError) {
        console.error('Failed to log login:', logError);
        // Don't throw - logging failure shouldn't prevent login
      }

      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (isAutoLogout = false) => {
    try {
      // Log logout before signing out
      if (user) {
        try {
          await logLogout(user);
        } catch (logError) {
          console.error('Failed to log logout:', logError);
        }
      }

      await signOut(auth);

      if (!isAutoLogout) {
        // Only show message for manual logout
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
