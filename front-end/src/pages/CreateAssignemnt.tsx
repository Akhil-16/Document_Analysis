import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth, useMessage } from "../utils";
import { Button, Divider, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import axios from "axios";
import { backendUri } from "../constants";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import SideDrawer from "../components/SideDrawer";
import { ImageBg } from "../components/ImageBg";
import { Form } from "../components/Form";

const CreateAssignemnt = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();

  const handleOnSubmit = async ({ name }: Record<string, string>) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${backendUri}/generate-random`);
      const meetId = resp.data.uid as string;
      setDoc(doc(db, "assignments", meetId), {
        createdBy: auth.user!.uid,
        name,
      });
      showMessage("Assignment Created Successfully!", "success");
    } catch (err) {
      if (err instanceof FirebaseError) {
        showMessage(err.message, "error");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <SideDrawer />
      <section className="relative ml-[200px] flex h-screen w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex w-11/12 lg:max-w-[25%] flex-col rounded-md bg-white p-4 text-black">
          <Typography variant="h4" className="text-center">
            Create a new Assignments
          </Typography>
          <Divider className="my-4" />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Form
              loading={loading}
              buttonText="Create"
              onSubmit={handleOnSubmit}
              initialValues={{
                email: "",
                password: "",
              }}
              formFields={[
                {
                  label: "Enter the name of assignment",
                  name: "name",
                  type: "text",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateAssignemnt;
