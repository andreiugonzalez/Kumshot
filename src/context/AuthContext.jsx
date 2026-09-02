import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const ADMIN_EMAIL = 'kum4shot@kumshot.com';
const ADMIN_PASSWORD = 'kum2026';
const INACTIVITY_TIMEOUT_MS = 8 * 60 * 1000; // 8 minutes

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Force inMemoryPersistence so session is never saved to disk and dies on tab close/page refresh
  useEffect(() => {
    setPersistence(auth, inMemoryPersistence).catch((err) => {
      console.warn('Persistence config error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sign out automatically on page unload / tab close
  useEffect(() => {
    const handleUnload = () => {
      signOut(auth).catch(() => {});
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);

  // 3. Auto logout after 8 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    let timer;

    const resetInactivityTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('Inactividad detectada (8 minutos). Cerrando sesión...');
        signOut(auth).catch(() => {});
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetInactivityTimer);
    });

    // Start timer on login/mount
    resetInactivityTimer();

    return () => {
      if (timer) clearTimeout(timer);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetInactivityTimer);
      });
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      // Ensure in-memory persistence before signing in
      await setPersistence(auth, inMemoryPersistence);

      const isAdminAttempt =
        email === ADMIN_EMAIL || email === 'kum4shot';

      let loginEmail = email;
      if (email === 'kum4shot') loginEmail = ADMIN_EMAIL;

      try {
        const result = await signInWithEmailAndPassword(auth, loginEmail, password);
        return { success: true, user: result.user };
      } catch (signInError) {
        const needsAutoCreate =
          isAdminAttempt &&
          password === ADMIN_PASSWORD &&
          (signInError.code === 'auth/user-not-found' ||
            signInError.code === 'auth/invalid-credential');

        if (needsAutoCreate) {
          const createResult = await createUserWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
          );
          return { success: true, user: createResult.user };
        }

        throw signInError;
      }
    } catch (error) {
      let message = 'Error al iniciar sesión';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        message = 'Credenciales incorrectas';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos. Intenta más tarde';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'El usuario ya existe';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Registro deshabilitado. Contacta al administrador';
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
