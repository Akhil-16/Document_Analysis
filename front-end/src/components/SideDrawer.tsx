import {
  Assignment,
  CancelOutlined,
  CheckCircleOutline,
  Logout,
} from "@mui/icons-material";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";

const SideDrawer = () => {
  const authContext = useContext(AuthContext)!;
  const { showMessage } = useContext(MessageContext)!;
  const navigator = useNavigate();

  return (
    <Drawer
      sx={{
        width: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem>
          <Typography
            variant="h6"
            component="div"
            className="w-full flex-grow cursor-pointer text-center text-2xl"
            onClick={() => navigator("/")}
          >
            U-Drive
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <div className="h-full flex flex-col justify-between">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigator("/create/assignment")}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText
                className="text-center"
                primary={"Create a new Assignment"}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigator("/view/assignments")}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText
                className="text-center"
                primary={"View Assignments"}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
        <List>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                showMessage("User Logged out successfully!", "info");
                authContext.logout();
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SideDrawer;
