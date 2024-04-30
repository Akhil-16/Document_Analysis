import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { appTheme } from "./constants.ts";
import AuthProvider from "./providers/AuthProvider.tsx";
import { MessageProvider } from "./providers/MessageProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider theme={appTheme}>
      <AuthProvider>
        <BrowserRouter>
          <MessageProvider>
            <App />
          </MessageProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </>,
);
