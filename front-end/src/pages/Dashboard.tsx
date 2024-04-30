import { Navigate } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Navigate to={"/view/assignments"} />
    </>
  );
};

export default Dashboard;
