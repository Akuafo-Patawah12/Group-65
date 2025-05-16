import React, { useState,useEffect } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import AttendanceHistory from "../Pages/AttendanceHistory";
import UserHeader from "../Components/UserHeader";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { MenuOutlined } from "@ant-design/icons";

import { UserOutlined, CalendarOutlined, LogoutOutlined } from "@ant-design/icons";

const drawerWidth = 240;

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const drawerWidth = 240; // Adjust if needed
const collapsedWidth = 60;

 const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  
         const currentUser = async()=>{
              try{
                 const res = await fetch("http://localhost:4000/api/user_management/me", {
                     method: "GET",
                     headers: { "Content-Type": "application/json" },
                     credentials: "include",
                   });
                   if (!res.ok) throw new Error("Failed to fetch user data");
                   const data = await res.json();
                   setLoggedInUser(data);
                   console.log(data)
                   
              }catch(error){
                 console.log(error)
                 
              }
           }
         
           useEffect(() => {
             currentUser()
           },[])
 
   

  return (
    

<div style={{ display: "flex" }}>
  <Drawer
    variant="permanent"
    open={!collapsed}
    PaperProps={{
      sx: {
        width: collapsed ? collapsedWidth : drawerWidth,
        backgroundColor: "#001529",
        color: "white",
        transition: "width 0.3s",
        overflowX: "hidden",
      },
    }}
  >
    <Box
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      {!collapsed && (
        <Typography variant="h6" color="white">
          User Dashboard
        </Typography>
      )}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{ color: "white", ml: collapsed ? 0 : 1 }}
      >
        <MenuOutlined />
      </IconButton>
    </Box>

    <Divider sx={{ borderColor: "#ffffff33" }} />

    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon sx={{ color: "white" }}>
          <UserOutlined />
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Dashboard" />}
      </ListItem>

      <ListItem button component={Link} to="/history">
        <ListItemIcon sx={{ color: "white" }}>
          <CalendarOutlined />
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Attendance History" />}
      </ListItem>

      <ListItem button onClick={handleLogout}>
        <ListItemIcon sx={{ color: "white" }}>
          <LogoutOutlined />
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Logout" />}
      </ListItem>
    </List>

    <Box sx={{ position: "absolute", bottom: 8, left: 16 }}>
      <Typography variant="body2" color="white">
        2018
      </Typography>
    </Box>
  </Drawer>

  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      ml: `${collapsed ? collapsedWidth : drawerWidth}px`,
      transition: "margin-left 0.3s",
    }}
  >
    <UserHeader loggedInUser={loggedInUser}/>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<AttendanceHistory />} />
    </Routes>
  </Box>
</div>

  );
};

export default UserLayout;
