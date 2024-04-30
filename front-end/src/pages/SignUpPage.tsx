import { Button, Divider, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";
import { Navbar } from "../components/Navbar";
import { ImageBg } from "../components/ImageBg";
import { Form } from "../components/Form";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();
  const navigate = useNavigate();

  const handleOnSubmit = async ({
    email,
    password,
    subjectName,
  }: Record<string, string>) => {
    setLoading(true);
    try {
      const creds = await auth.signUp(email, password);
      await setDoc(doc(db, "users", creds.user.uid), {
        name,
        subjectName,
        email,
      });
      showMessage(
        "Account Created Successfully! Redirecting to login",
        "success",
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
      <Navbar />
      <section className="relative flex h-screen overflow-hidden w-screen flex-col items-center justify-around">
        <ImageBg />
        <div className="container z-10 h-auto w-96 rounded-md bg-white p-4 text-black">
          <Typography variant="h4" className="text-center text-bgColor">
            Create an Account
          </Typography>
          <Divider className="m-4" />
          <Form
            buttonText="Sign Up"
            loading={loading}
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
                label: "Enter your subject's name",
                name: "subjectName",
                type: "text",
              },
              {
                label: "Enter your Email",
                name: "email",
                type: "text",
              },
              {
                label: "Enter your password",
                name: "password",
                type: "password",
              },
            ]}
          />
          <Button color="primary" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </Button>
          <div className="flex items-center justify-center gap-2 text-bgColor">
            Already have an account?{" "}
            <Button onClick={() => navigate("/login")}>Login</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;
