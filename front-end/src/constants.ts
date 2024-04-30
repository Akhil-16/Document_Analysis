import { createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";

export const appTheme = createTheme({
  palette: {
    primary: purple,
  },
});

export const backendUri = import.meta.env.VITE_BACKEND_URI;
