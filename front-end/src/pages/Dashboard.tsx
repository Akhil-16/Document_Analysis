import { Button } from "@mui/material";
import { useAuth } from "../utils";
import CreateAssignemnt from "./CreateAssignemnt";
import ShowAssignments from "./ShowAssignments";

const Dashboard = () => {
  const auth = useAuth();

  return (
    <>
      <div>Dashboard</div>
      <CreateAssignemnt />
      <ShowAssignments />
      <Button onClick={auth.logout} variant="contained">
        Log Out!
      </Button>
    </>
  );
};

export default Dashboard;
