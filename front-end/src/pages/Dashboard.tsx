import { Button } from "@mui/material";
import { useAuth } from "../utils";

const Dashboard = () => {
  const auth = useAuth();

  return (
    <>
      <div>Dashboard</div>
      <Button onClick={auth.logout} variant="contained">
        Log Out!
      </Button>
    </>
  );
};

export default Dashboard;
