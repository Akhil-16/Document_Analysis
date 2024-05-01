import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchedAssignment } from "../types";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import { addDoc, doc, getDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";
import { Button, Divider, Typography } from "@mui/material";
import { ref, uploadBytes } from "firebase/storage";
import { ImageBg } from "../components/ImageBg";
import { Form } from "../components/Form";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: "100%",
  margin: "2rem",
});

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
  const navigate = useNavigate();

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

  const handleOnSubmit = async ({ name, email }: Record<string, string>) => {
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
        graded: false,
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
        <section className="relative flex h-screen w-[calc(100%)] flex-col items-center justify-center bg-bgColor">
          <ImageBg />
          <div className="z-10 flex w-11/12 lg:max-w-[25%] mx-auto flex-col justify-center rounded-md bg-white p-4 text-black">
            <div className="border border-black p-2">
              <Typography variant="h4" className="text-center">
                Submitted!
              </Typography>
              <Typography variant="h6" className="text-center">
                You'll be notified by a mail whenever it's graded!
              </Typography>
              You can view your result after the grading is done on{" "}
              <Button
                onClick={() => {
                  navigate(`/view/assignment?uid=${uid}`);
                }}
              >
                here
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative flex h-screen w-[calc(100%)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex w-11/12 lg:max-w-[25%] mx-auto flex-col rounded-md bg-white p-4 text-black">
          <Typography variant="h4" className="text-center">
            Submit Assignment
          </Typography>
          <Divider className="my-4 -mb-2" />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Form
              loading={loading}
              buttonText="Submit"
              onSubmit={handleOnSubmit}
              initialValues={{
                email: "",
                password: "",
              }}
              formFields={[
                {
                  label: "Enter your name",
                  name: "name",
                  type: "text",
                },
                {
                  label: "Enter your email",
                  name: "email",
                  type: "text",
                },
              ]}
              extendForm={
                <>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      accept="application/pdf"
                      className="my-4"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <br />
                  {file && <div className="my-2 font-bold">{file.name}</div>}
                </>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SubmitAssignment;
