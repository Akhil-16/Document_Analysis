import { Button } from "@mui/material";
import { useAuth } from "../utils";
import CreateAssignemnt from "./CreateAssignemnt";

const Dashboard = () => {
  const auth = useAuth();

  return (
    <>
      <div>Dashboard</div>
      <CreateAssignemnt />
      <Button onClick={auth.logout} variant="contained">
        Log Out!
      </Button>
    </>
  );
};

export default Dashboard;
