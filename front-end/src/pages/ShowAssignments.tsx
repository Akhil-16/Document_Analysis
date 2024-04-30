import { useEffect, useState } from "react";
import { FetchedAssignemnt } from "../types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../utils";
import { db } from "../firebase";

const ShowAssignments = () => {
  const [assignemnts, setAssignments] = useState<FetchedAssignemnt[]>([]);

  const auth = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, "assignments"),
      where("createdBy", "==", auth.user!.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const _assingments: FetchedAssignemnt[] = [];
      snap.docs.forEach((doc) => {
        _assingments.push({ ...doc.data(), uid: doc.id } as FetchedAssignemnt);
      });
      setAssignments(_assingments);
    });

    return unsub;
  }, [auth]);

  return (
    <>
      <div>ShowAssignments</div>
      <table>
        <thead>
          <tr>
            <th className="border border-black">Name</th>
            <th className="border border-black">uid</th>
          </tr>
        </thead>
        <tbody>
          {assignemnts.map((assignment) => {
            return (
              <tr key={assignment.uid}>
                <th className="border border-black">{assignment.name}</th>
                <th className="border border-black">{assignment.uid}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ShowAssignments;
