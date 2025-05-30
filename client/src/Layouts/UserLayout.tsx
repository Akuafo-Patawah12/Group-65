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
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import { MenuOutlined } from "@ant-design/icons";

import { UserOutlined, CalendarOutlined, LogoutOutlined } from "@ant-design/icons";



const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const drawerWidth = 240; // Adjust if needed
const collapsedWidth = 60;
const currentYear = new Date().getFullYear();

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


            const navItems = [
    {
      label: "Dashboard",
      icon: <UserOutlined />,
      path: "/dashboard",
    },
    {
      label: "Attendance History",
      icon: <CalendarOutlined />,
      path: "/history",
    },
  ];
 
   

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
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          borderRight: "none",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              letterSpacing: "0.5px",
            }}
          >
            AR Dashboard
          </Typography>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "white",
            transition: "transform 0.3s",
            "&:hover": { transform: "rotate(90deg)" },
          }}
        >
          <MenuOutlined />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "#ffffff33" }} />

      {/* Navigation Items */}
      <List>
        {navItems.map(({ label, icon, path }) => (
          <Tooltip key={label} title={collapsed ? label : ""} placement="right">
            <ListItem
              button
              component={Link}
              to={path}
              sx={{
                "&:hover": {
                  backgroundColor: "#1677ff",
                  color: "white",
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={label} />}
            </ListItem>
          </Tooltip>
        ))}

        {/* Logout */}
        <Tooltip title={collapsed ? "Logout" : ""} placement="right">
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "#ff4d4f",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <LogoutOutlined />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItem>
        </Tooltip>
      </List>

      {/* Footer */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography
          variant="caption"
          color="white"
          sx={{ textAlign: "center", display: "block" }}
        >
          © {currentYear} AR Transport
        </Typography>
      </Box>
    </Drawer>

  <Box
    component="main"
    sx={{
      flexGrow: 1,
     
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
