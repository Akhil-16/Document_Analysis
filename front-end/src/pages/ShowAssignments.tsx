import { useEffect, useState } from "react";
import { FetchedAssignment } from "../types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth, useMessage } from "../utils";
import { db } from "../firebase";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ShowAssignments = () => {
  const [assignemnts, setAssignments] = useState<FetchedAssignment[]>([]);

  const auth = useAuth();
  const navigate = useNavigate();
  const showMessage = useMessage();

  useEffect(() => {
    const q = query(
      collection(db, "assignments"),
      where("createdBy", "==", auth.user!.uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const _assingments: FetchedAssignment[] = [];
      snap.docs.forEach((doc) => {
        _assingments.push({ ...doc.data(), uid: doc.id } as FetchedAssignment);
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
            <th className="border border-black">action</th>
            <th className="border border-black">link</th>
          </tr>
        </thead>
        <tbody>
          {assignemnts.map((assignment) => {
            return (
              <tr key={assignment.uid}>
                <th className="border border-black">{assignment.name}</th>
                <th className="border border-black">{assignment.uid}</th>
                <th className="border border-black">
                  <Button
                    onClick={() => {
                      const url = `/view/assignment?uid=${assignment.uid}`;
                      navigate(url);
                    }}
                  >
                    View
                  </Button>
                </th>
                <th className="border border-black">
                  <Button
                    onClick={() => {
                      const currentUrl = window.location.href;
                      const exp = new RegExp(
                        /https?:\/\/([a-zA-Z0-9.]+:[0-9]+)/,
                      );
                      const curr = `http://${exp.exec(currentUrl)![1]}/submit/assignment?uid=${assignment.uid}`;
                      navigator.clipboard.writeText(curr).then(() => {
                        showMessage("Copied to clipboard!");
                      });
                    }}
                  >
                    Copy
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

export default ShowAssignments;
