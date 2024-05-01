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
import { Button, Divider, Typography } from "@mui/material";
import { calcGrade, roundOff, useMessage } from "../utils";
import SideDrawer from "../components/SideDrawer";
import { ImageBg } from "../components/ImageBg";
import { useHistory } from "react-router-dom";

const ViewAssignment = () => {
  const params = useLocation();
  const uid: string = new URLSearchParams(params.search).get("uid") as string;

  const [loading, setloading] = useState(false);
  const [details, setDetails] = useState<FetchedAssignment | null>(null);
  const [submissions, setsubmissions] = useState<FetchedSubmission[]>([]);

  const navigate = useNavigate();
  const showMessage = useMessage();

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
      <SideDrawer />
      <section className="relative ml-[200px] flex h-screen w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex max-h-[94%] w-11/12 flex-col rounded-md bg-white p-4 text-black overflow-y-auto">
          <Typography variant="h4" className="text-center">
            View Assignments
          </Typography>
          <Divider className="my-4" />
          <table className="w-full overflow-x-hidden overflow-y-scroll">
            <thead className="w-full">
              <tr className="w-full">
                <th className="border border-black w-1/5">#</th>
                <th className="border border-black w-1/5">Name</th>
                <th className="border border-black w-1/5">Email</th>
                <th className="border border-black w-1/5">Grade</th>
                <th className="border border-black w-1/5">action</th>
              </tr>
            </thead>
            <tbody>
              {submissions
                .filter((sub) => sub.graded)
                .map((submission, index) => {
                  return (
                    <tr key={submission.uid}>
                      <td className="border border-black p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {submission.name}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {submission.email}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {roundOff(calcGrade(submission.grades!))}
                      </td>
                      <td className="border border-black p-2 text-center">
                        <Button
                          onClick={() => {
                            const url = `/view/submission?uid=${submission.uid}`;
                            navigate(url);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="mt-4 w-full flex justify-between items-center">
            <Button
              onClick={() => {
                navigate("/view/assignments");
              }}
              variant="outlined"
            >
              Go Back
            </Button>
            <Button
              onClick={() => {
                const currentUrl = window.location.href;
                const exp = new RegExp(/https?:\/\/([a-zA-Z0-9.]+:[0-9]+)/);
                const curr = `http://${exp.exec(currentUrl)![1]}/submit/assignment?uid=${uid}`;
                navigator.clipboard.writeText(curr).then(() => {
                  showMessage("Copied to clipboard!");
                });
              }}
              variant="outlined"
            >
              Copy URL
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewAssignment;
