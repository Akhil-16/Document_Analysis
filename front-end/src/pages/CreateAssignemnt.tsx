import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth, useMessage } from "../utils";
import { Button } from "@mui/material";
import { FirebaseError } from "firebase/app";
import axios from "axios";
import { backendUri } from "../constants";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CreateAssignemnt = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={name}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setName(e.currentTarget.value);
          }}
        />
        <br />
        <Button type="submit" variant="contained" disabled={loading}>
          Create!
        </Button>
      </form>
    </>
  );
};

export default CreateAssignemnt;
