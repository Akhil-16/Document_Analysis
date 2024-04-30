import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";
import { auth } from "../firebase";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
  const [firestoreLoading, setFirestoreLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as null);
    });

    return unsub;
  }, []);

  const loading = firebaseLoading || firestoreLoading;
  const isLoggedIn = currentUser !== null;

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {loading && <LoadingPage />}
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
