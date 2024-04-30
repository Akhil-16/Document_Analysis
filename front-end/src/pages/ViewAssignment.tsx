import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FetchedAssignment } from "../types";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const ViewAssignment = () => {
  const params = useLocation();
  const uid: string = new URLSearchParams(params.search).get("uid") as string;

  const [loading, setloading] = useState(false);
  const [details, setDetails] = useState<FetchedAssignment | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setloading(true);
      const assignement = await getDoc(doc(db, "assignments", uid));
      if (assignement.exists()) {
        const resp = assignement.data();
        setDetails(resp as FetchedAssignment);
      }
      setloading(false);
    };

    fetch();
    console.log(uid);
  }, [uid]);

  useEffect(() => {
    if (!details) {
      return;
    }

    const q = query(
      collection(db, "submissions"),
      where("assignment", "==", uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      snap.docs.forEach((doc) => {
        console.log(doc);
      });
    });

    return unsub;
  }, [uid, details]);

  if (loading) {
    return <LoadingPage />;
  }

  if (details === null) {
    return <NotFound />;
  }

  return <div>ViewAssignment</div>;
};

export default ViewAssignment;
