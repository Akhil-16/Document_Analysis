import { UserCredential } from "firebase/auth";

export type SMAuthContext = {
  isLoggedIn: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
};

export type SMMessageContext = {
  showMessage(
    message: string,
    messageType?: "error" | "info" | "success" | "warning",
    messageDuration?: number,
  ): void;
};
