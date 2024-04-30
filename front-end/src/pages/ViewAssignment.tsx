import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchedAssignment, FetchedSubmission } from "../types";
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
import { Button } from "@mui/material";
import { calcGrade } from "../utils";

const ViewAssignment = () => {
  const params = useLocation();
  const uid: string = new URLSearchParams(params.search).get("uid") as string;

  const [loading, setloading] = useState(false);
  const [details, setDetails] = useState<FetchedAssignment | null>(null);
  const [submissions, setsubmissions] = useState<FetchedSubmission[]>([]);

  const navigate = useNavigate();

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
      const _subs: FetchedSubmission[] = [];
      snap.docs.forEach((doc) => {
        _subs.push({ ...doc.data(), uid: doc.id } as FetchedSubmission);
      });
      setsubmissions(_subs);
    });

    return unsub;
  }, [uid, details]);

  if (loading) {
    return <LoadingPage />;
  }

  if (details === null) {
    return <NotFound />;
  }

  return (
    <>
      <div>ViewAssignment</div>
      <table>
        <thead>
          <tr>
            <th className="border border-black">Name</th>
            <th className="border border-black">Email</th>
            <th className="border border-black">Grade</th>
            <th className="border border-black">action</th>
          </tr>
        </thead>
        <tbody>
          {submissions
            .filter((sub) => sub.graded)
            .map((submission) => {
              return (
                <tr key={submission.uid}>
                  <th className="border border-black">{submission.name}</th>
                  <th className="border border-black">{submission.email}</th>
                  <th className="border border-black">
                    {calcGrade(submission.grades!)}
                  </th>
                  <th className="border border-black">
                    <Button
                      onClick={() => {
                        const url = `/view/submission?uid=${submission.uid}`;
                        navigate(url);
                      }}
                    >
                      View
                    </Button>
                  </th>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default ViewAssignment;
