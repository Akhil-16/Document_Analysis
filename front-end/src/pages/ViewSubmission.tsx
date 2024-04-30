import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchedSubmission } from "../types";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { calcGrade } from "../utils";
import { getDownloadURL, ref } from "firebase/storage";

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
      <div>ViewSubmission</div>
      <table>
        <tbody>
          <tr>
            <th className="border border-black">Name</th>
            <td className="border border-black">{details.name}</td>
          </tr>
          <tr>
            <th className="border border-black">Email</th>
            <td className="border border-black">{details.email}</td>
          </tr>
          <tr>
            <th className="border border-black">Original Submission</th>
            <td className="border border-black">{details.file}</td>
          </tr>
          <tr>
            <th className="border border-black">
              Over All Grade ( out of 100 )
            </th>
            <td className="border border-black">
              {calcGrade(details.grades!)}
            </td>
          </tr>
          {[...new Array(5)].map((_, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <th className="border border-black" rowSpan={2}>
                    {details.metrics![index]}
                  </th>
                  <td className="border border-black">
                    {details.grades![index]}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black">
                    {details.remarks![index]}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ViewSubmission;
