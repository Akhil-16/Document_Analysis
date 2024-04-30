import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useAuth } from "./utils";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ViewAssignment from "./pages/ViewAssignment";
import SubmitAssignment from "./pages/SubmitAssignment";
import ViewSubmission from "./pages/ViewSubmission";
import CreateAssignemnt from "./pages/CreateAssignemnt";
import ShowAssignments from "./pages/ShowAssignments";

function App() {
  const auth = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={auth.isLoggedIn ? <Dashboard /> : <Navigate to={"/login"} />}
        />
        <Route path="/view/assignment" element={<ViewAssignment />} />
        <Route path="/view/submission" element={<ViewSubmission />} />
        <Route path="/create/assignment" element={<CreateAssignemnt />} />
        <Route path="/view/assignments" element={<ShowAssignments />} />
        <Route path="/submit/assignment" element={<SubmitAssignment />} />
        <Route
          path="/login"
          element={
            auth.isLoggedIn ? (
              <Navigate to={"/view/assignments"} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/sign-up"
          element={
            auth.isLoggedIn ? (
              <Navigate to={"/view/assignments"} />
            ) : (
              <SignUpPage />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
