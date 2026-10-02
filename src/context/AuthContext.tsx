import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  MANAGEMENT_ADMIN_EMAIL,
  MANAGEMENT_ADMIN_PASSWORD,
  handleFirestoreError,
  OperationType,
  type FirebaseUser
} from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aura_client_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const checkIsAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    return clean === MANAGEMENT_ADMIN_EMAIL.toLowerCase() || 
           clean === '01ivannicholomeneses@gmail.com';
  };

  useEffect(() => {
    // Ensure anonymous Firebase Auth is initiated if no user is signed in yet
    // to provide valid request.auth in Firestore queries
    const ensureFirebaseAuth = async () => {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (anonErr) {
          console.warn('Anonymous auth notice:', anonErr);
        }
      }
    };
    ensureFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !fbUser.isAnonymous) {
        const isAdminUser = checkIsAdmin(fbUser.email);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const profile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: data.displayName || fbUser.displayName || (isAdminUser ? 'Executive Management' : 'Client Member'),
              phone: data.phone || '',
              role: isAdminUser ? 'admin' : (data.role || 'customer'),
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              photoURL: fbUser.photoURL || undefined
            };
            setUser(profile);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || (isAdminUser ? 'Executive Management' : 'Client Member'),
              phone: '',
              role: isAdminUser ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
              photoURL: fbUser.photoURL || undefined
            };
            try {
              await setDoc(userDocRef, {
                ...newProfile,
                serverCreatedAt: serverTimestamp()
              });
            } catch (writeErr) {
              console.warn('Profile write notice:', writeErr);
            }
            setUser(newProfile);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
          }
        } catch (err) {
          const fallbackProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (isAdminUser ? 'Executive Management' : 'Client Member'),
            role: isAdminUser ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
            photoURL: fbUser.photoURL || undefined
          };
          setUser(fallbackProfile);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProfile));
        }
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdminCreds = cleanEmail === MANAGEMENT_ADMIN_EMAIL.toLowerCase() && pass === MANAGEMENT_ADMIN_PASSWORD;

    if (isAdminCreds) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/user-not-found') {
          try {
            await createUserWithEmailAndPassword(auth, email, pass);
            return;
          } catch {
            // fallback
          }
        }
      }
      const adminProfile: UserProfile = {
        uid: auth.currentUser?.uid || 'admin_management_001',
        email: MANAGEMENT_ADMIN_EMAIL,
        displayName: 'Aura Executive Management',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(adminProfile));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/invalid-credential') {
        const fallbackClient: UserProfile = {
          uid: auth.currentUser?.uid || `client_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: cleanEmail,
          displayName: cleanEmail.split('@')[0],
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        setUser(fallbackClient);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackClient));
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdminUser = checkIsAdmin(cleanEmail);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        const userDocRef = doc(db, 'users', cred.user.uid);
        try {
          await setDoc(userDocRef, {
            id: cred.user.uid,
            email: cleanEmail,
            displayName: name,
            phone: phone || '',
            role: isAdminUser ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
            serverCreatedAt: serverTimestamp()
          });
        } catch (err) {
          console.warn('Could not write user profile to firestore:', err);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        const clientProfile: UserProfile = {
          uid: auth.currentUser?.uid || `client_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: cleanEmail,
          displayName: name,
          phone: phone || '',
          role: isAdminUser ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        setUser(clientProfile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clientProfile));
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut notice:', err);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Re-authenticate anonymously in background for guest session
    try {
      await signInAnonymously(auth);
    } catch {
      // ignore
    }
  };

  const isAdmin = user?.role === 'admin' || checkIsAdmin(firebaseUser?.email || user?.email);

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isAdmin,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
