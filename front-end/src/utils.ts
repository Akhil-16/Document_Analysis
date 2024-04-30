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

export const objectLength = <T extends Record<PropertyKey, unknown>>(
  obj: T,
) => {
  return Object.keys(obj).length;
};

export const isUrl = (s: string) => {
  return s.startsWith("https://");
};

export const roundOff = (x: number) => {
  return x.toFixed(2);
};
