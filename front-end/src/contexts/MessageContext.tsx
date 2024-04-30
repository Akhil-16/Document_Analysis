import { createContext } from "react";
import { SMMessageContext } from "../types";

export const MessageContext = createContext<SMMessageContext | null>(null);
