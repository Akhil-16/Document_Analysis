import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useState } from "react";
import { MessageContext } from "../contexts/MessageContext";

interface PropsInterface {
  children: React.ReactNode;
}

export const MessageProvider = ({ children }: PropsInterface) => {
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [messageDuration, setMessageDuration] = useState<number>(6000);

  const showMessage = (
    _message: string,
    _messageType = "",
    _messageDuration = messageDuration,
  ) => {
    setMessage(_message);
    setMessageType(_messageType);
    setMessageDuration(_messageDuration);
  };

  return (
    <>
      <MessageContext.Provider value={{ showMessage }}>
        {children}
        <Snackbar
          open={message.length > 0}
          autoHideDuration={messageDuration}
          onClose={() => {
            setMessage("");
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setMessage("");
            }}
            severity={
              messageType.length > 0 ? (messageType as AlertColor) : "success"
            }
            className="w-80 p-4"
          >
            {message}
          </Alert>
        </Snackbar>
      </MessageContext.Provider>
    </>
  );
};
