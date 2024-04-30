import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FetchedAssignment } from "../types";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import { addDoc, doc, getDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";
import { Button } from "@mui/material";
import { ref, uploadBytes } from "firebase/storage";

const SubmitAssignment = () => {
  const params = useLocation();
  const uid: string = new URLSearchParams(params.search).get("uid") as string;

  const [file, setFile] = useState<File | null>(null);
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [initLoading, setinitLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [details, setDetails] = useState<FetchedAssignment | null>(null);
  const [submitted, setsubmitted] = useState(false);

  const showMessage = useMessage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      showMessage("Please select a PDF file.");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setinitLoading(true);
      const assignement = await getDoc(doc(db, "assignments", uid));
      if (assignement.exists()) {
        const resp = { ...assignement.data(), uid: assignement.id };
        setDetails(resp as FetchedAssignment);
      }
      setinitLoading(false);
    };

    fetch();
    console.log(uid);
  }, [uid]);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      showMessage("Please select a file to upload.", "error");
      return;
    }

    setloading(true);
    try {
      console.log(details);
      const storageRef = ref(storage, `${details!.uid}/${"assignment"}.pdf`);
      const resp = await uploadBytes(storageRef, file);
      await addDoc(collection(db, "submissions"), {
        assignment: details!.uid,
        file: resp.metadata.fullPath,
        name,
        email,
      });
      showMessage("Uploaded successfully!", "success");
      setsubmitted(true);
    } catch (err) {
      if (err instanceof FirebaseError) {
        showMessage(err.message, "error");
      }
      console.log(err);
    }
    setloading(false);
  };

  if (initLoading) {
    return <LoadingPage />;
  }

  if (!details) {
    return <NotFound />;
  }

  if (submitted) {
    return (
      <>
        <h1>
          You have submitted your assignment! You will get a mail when it has
          been scored!
        </h1>
      </>
    );
  }

  return (
    <>
      <div>SubmitAssignment</div>
      <form onSubmit={handleOnSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={email}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setEmail(e.currentTarget.value);
          }}
        />
        <br />
        <input
          type="text"
          value={name}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setname(e.currentTarget.value);
          }}
        />
        <br />
        <Button type="submit" variant="contained" disabled={loading}>
          Submit Assingment
        </Button>
      </form>
    </>
  );
};

export default SubmitAssignment;
