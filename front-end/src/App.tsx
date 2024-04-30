import { Button } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useAuth } from "./utils";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const auth = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={auth.isLoggedIn ? <Dashboard /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={auth.isLoggedIn ? <Navigate to={"/"} /> : <LoginPage />}
        />
        <Route
          path="/sign-up"
          element={auth.isLoggedIn ? <Navigate to={"/"} /> : <SignUpPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
