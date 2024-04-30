import { User, UserCredential } from "firebase/auth";

export type SMAuthContext = {
  isLoggedIn: boolean;
  user: User | null;
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

export type FetchedAssignemnt = {
  createdBy: string;
  uid: string;
  name: string;
};
