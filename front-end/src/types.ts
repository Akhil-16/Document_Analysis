import { UserCredential } from "firebase/auth";

export type SMAuthContext = {
  isLoggedIn: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
};

export type SMMessageContext = {
  showMessage(
    message: string,
    messageType?: "error" | "info" | "success" | "warning",
    messageDuration?: number,
  ): void;
};
