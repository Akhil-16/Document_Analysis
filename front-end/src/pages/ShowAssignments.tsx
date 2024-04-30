import { useEffect, useState } from "react";
import { FetchedAssignment } from "../types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth, useMessage } from "../utils";
import { db } from "../firebase";
import { Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";
import { ImageBg } from "../components/ImageBg";

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
      <SideDrawer />
      <section className="relative ml-[200px] flex h-screen w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex h-[94%] w-11/12 flex-col rounded-md bg-white p-4 text-black">
          <Typography variant="h4" className="text-center">
            View Assignments
          </Typography>
          <Divider className="my-4" />
          {assignemnts.length === 0 && (
            <div className="h-full flex flex-col text-center justify-center items-center w-full">
              <Typography className="text-2xl" variant="h3">
                No assignments were found!
              </Typography>
            </div>
          )}
          {assignemnts.length > 0 && (
            <table className="text-black">
              <thead>
                <tr>
                  <th className="border border-black">#</th>
                  <th className="border border-black">Name</th>
                  <th className="border border-black max-w-16">Link</th>
                  <th className="border border-black max-w-16">View</th>
                </tr>
              </thead>
              <tbody>
                {assignemnts.map((assignment, index) => {
                  return (
                    <tr key={assignment.uid}>
                      <td className="border border-black text-center">
                        {index + 1}
                      </td>
                      <th className="border border-black text-center">
                        {assignment.name}
                      </th>
                      <th className="border border-black max-w-16">
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
                          variant="outlined"
                          className="m-2"
                        >
                          Copy
                        </Button>
                      </th>
                      <th className="border border-black max-w-16">
                        <Button
                          onClick={() => {
                            const url = `/view/assignment?uid=${assignment.uid}`;
                            navigate(url);
                          }}
                          variant="contained"
                          className="m-2"
                        >
                          View
                        </Button>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default ShowAssignments;
