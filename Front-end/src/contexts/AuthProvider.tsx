import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase.config';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';
import type { User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      
      if (user) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const permission = userDoc.data().permission || 'operador';
            localStorage.setItem(`user_permission_${user.uid}`, permission);
          }
        } catch (error) {
          console.error('Erro ao buscar permissão do usuário:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
