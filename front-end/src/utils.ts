import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { MessageContext } from "./contexts/MessageContext";

export const useAuth = () => useContext(AuthContext)!;
export const useMessage = () => useContext(MessageContext)!.showMessage;

export const calcGrade = (arr: number[]) => {
  return (
    arr[0] * 0.15 + arr[1] * 0.4 + arr[2] * 0.25 + arr[3] * 0.1 + arr[4] * 0.1
  );
};
