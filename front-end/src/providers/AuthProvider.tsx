import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";
import { auth } from "../firebase";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<null | User>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setFirebaseLoading(false);
    });

    return unsub;
  }, []);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const loading = firebaseLoading;
  const isLoggedIn = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{ user: currentUser, logout, isLoggedIn, signUp, login }}
    >
      {loading && <LoadingPage />}
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
