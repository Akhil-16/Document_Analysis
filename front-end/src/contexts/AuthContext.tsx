import { createContext } from "react";
import { SMAuthContext } from "../types";

export const AuthContext = createContext<SMAuthContext | null>(null);
