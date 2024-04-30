import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { MessageContext } from "./contexts/MessageContext";

export const useAuth = () => useContext(AuthContext)!;
export const useMessage = () => useContext(MessageContext)!.showMessage;
