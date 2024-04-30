import { Button, Divider, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useMessage } from "../utils";
import { FirebaseError } from "firebase/app";
import { Navbar } from "../components/Navbar";
import { ImageBg } from "../components/ImageBg";
import { Form } from "../components/Form";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const showMessage = useMessage();
  const navigate = useNavigate();

  const handleOnSubmit = async ({
    email,
    password,
  }: Record<string, string>) => {
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
      <Navbar />
      <section className="relative flex h-screen overflow-hidden w-screen flex-col items-center justify-around">
        <ImageBg />
        <div className="container z-10 h-auto w-96 rounded-md bg-white p-4 text-black">
          <Typography variant="h4" className="text-center text-bgColor">
            Login
          </Typography>
          <Divider className="m-4" />
          <Form
            buttonText="Login"
            loading={loading}
            onSubmit={handleOnSubmit}
            initialValues={{
              email: "",
              password: "",
            }}
            formFields={[
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
            Don't have an account already?{" "}
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
