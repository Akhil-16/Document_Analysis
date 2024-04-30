import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <AppBar position="fixed" color="secondary" className="z-20">
        <Toolbar className="flex justify-center">
          <Link to={"/"}>
            <Typography
              variant="h6"
              component="div"
              className="flex-grow text-3xl"
            >
              ScoreMaster
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </>
  );
};
