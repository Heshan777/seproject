// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebase/config';

const auth = getAuth(app);
const db = getFirestore(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, userData, userType) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;
    const userDocData = {
      uid: authUser.uid,
      email: authUser.email,
      createdAt: new Date(),
      ...userData,
    };
    await setDoc(doc(db, userType, authUser.uid), userDocData);
    const finalUserData = { ...userDocData, role: userType };
    setUser(finalUserData);
    return finalUserData;
  };

  const login = async (email, password, userType) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;
    const docRef = doc(db, userType, authUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await signOut(auth);
      throw new Error("Login failed: User role does not match or user does not exist.");
    }
    const userData = { uid: authUser.uid, email: authUser.email, role: userType, ...docSnap.data() };
    setUser(userData);
    return userData;
  };
  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          const collections = ['students', 'companies', 'admins'];
          let foundUser = false;
          for (const role of collections) {
            const docSnap = await getDoc(doc(db, role, authUser.uid));
            if (docSnap.exists()) {
              setUser({ uid: authUser.uid, email: authUser.email, role, ...docSnap.data() });
              foundUser = true;
              break;
            }
          }
          if (!foundUser) {
            console.warn("User authenticated but not found in any collection.");
            await signOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
