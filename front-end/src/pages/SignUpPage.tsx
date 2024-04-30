import { Button } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.signUp(email, password);
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found") {
          showMessage("User Not Found", "error");
        }
        if (err.code === "auth/wrong-password") {
          showMessage("Wrong Password", "error");
        }
        if (err.code === "auth/too-many-requests") {
          showMessage("Too Many Request. Please try again later.", "error");
        } else {
          showMessage(err.message, "error");
        }
        console.trace(err.code);
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
          value={password}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setPassword(e.currentTarget.value);
          }}
        />
        <br />
        <input
          type="text"
          value={subjectName}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setSubjectName(e.currentTarget.value);
          }}
        />
        <br />
        <Button type="submit" variant="contained" disabled={loading}>
          Sign Up!
        </Button>
      </form>
      <Link to={"/login"}>Login here!</Link>
    </>
  );
};

export default SignUpPage;
