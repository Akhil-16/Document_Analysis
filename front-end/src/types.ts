import * as Yup from "yup";
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

export type FetchedAssignment = {
  createdBy: string;
  uid: string;
  name: string;
};

export type FetchedSubmission = {
  uid: string;
  assignment: string;
  name: string;
  email: string;
  file: string;
  graded: boolean;
  grades?: number[];
  metrics?: string[];
  remarks?: string[];
};

export type FormField = {
  name: string;
  label: string;
} & (OtherFormField | OptionFormField);

interface OtherFormField {
  type: "text" | "password";
}

export interface AutoCompleteOption {
  label: string;
  value: string;
}

interface OptionFormField {
  type: "option";
  choices: AutoCompleteOption[];
  defaultValue?: AutoCompleteOption;
}

export type ValidationSchemaInterface = Yup.ObjectSchema<
  { [key: string]: string },
  Yup.AnyObject,
  { [key: string]: undefined },
  ""
>;
