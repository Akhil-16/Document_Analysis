import { Button } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(email, password);
      showMessage("User Logged In Successfully!", "success");
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
          value={email}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setEmail(e.currentTarget.value);
          }}
        />
        <br />
        <input
          type="password"
          value={password}
          className="border border-black"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setPassword(e.currentTarget.value);
          }}
        />
        <br />
        <br />
        <Button type="submit" variant="contained" disabled={loading}>
          Login
        </Button>
      </form>
      <Link to={"/sign-up"}>Sign Up here!</Link>
    </>
  );
};

export default LoginPage;
