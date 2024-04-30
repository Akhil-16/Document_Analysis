import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchedSubmission } from "../types";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { calcGrade, roundOff } from "../utils";
import { getDownloadURL, ref } from "firebase/storage";
import { Button, Divider, Typography } from "@mui/material";
import { ImageBg } from "../components/ImageBg";

const ViewSubmission = () => {
  const params = useLocation();
  const uid: string = new URLSearchParams(params.search).get("uid") as string;

  const [loading, setloading] = useState(false);
  const [details, setDetails] = useState<FetchedSubmission | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setloading(true);
      const submission = await getDoc(doc(db, "submissions", uid));
      if (submission.exists()) {
        const resp = {
          ...submission.data(),
          uid: submission.id,
        } as FetchedSubmission;
        resp.file = await getDownloadURL(ref(storage, resp.file));
        setDetails(resp);
      }
      setloading(false);
    };

    fetch();
    console.log(uid);
  }, [uid]);

  if (loading) {
    return <LoadingPage />;
  }

  if (details === null) {
    return <NotFound />;
  }

  if (!details.graded) {
    return (
      <>
        <div>
          This submission is being graded. You will get an email once it has
          been graded
        </div>
      </>
    );
  }

  return (
    <>
      <section className="relative flex h-screen w-[calc(100%)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex h-[94%] w-11/12 flex-col justify-center rounded-md bg-white p-4 text-black overflow-y-auto">
          <Typography variant="h4" className="text-center">
            View Submission
          </Typography>
          <Divider className="my-4" />
          <table className="w-full">
            <tr>
              <th className="border border-black w-[15%] p-2">Name</th>
              <td className="border border-black p-2 text-center">
                {details.name}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-2">Email</th>
              <td className="border border-black p-2 text-center">
                {details.email}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-2">Original Submission</th>
              <td className="border border-black p-2 text-center">
                <a href={details.file} target="_blank">
                  <Button>Download</Button>
                </a>
              </td>
            </tr>
            <tr>
              <th className="border border-black p-2">
                Over All Grade ( out of 100 )
              </th>
              <td className="border border-black p-2 text-center">
                {roundOff(calcGrade(details.grades!))}
              </td>
            </tr>
            {[...new Array(5)].map((_, index) => {
              return (
                <Fragment key={index}>
                  <tr>
                    <th className="border border-black p-2" rowSpan={2}>
                      {details.metrics![index]}
                    </th>
                    <td className="border border-black p-2 text-center">
                      {details.grades![index]}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">
                      {details.remarks![index]}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </table>
        </div>
      </section>
      <div>ViewSubmission</div>
    </>
  );
};

export default ViewSubmission;
