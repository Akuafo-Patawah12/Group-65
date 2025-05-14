import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  IconButton,
  Divider,
  Box,
  Button
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as UserIcon,
  CalendarToday as CalendarIcon,
  BarChart as ReportIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { useLogout } from "../Hooks/Logout";

type SidebarProps = {
  activeTab: number;
  setActiveTab: (key: number) => void;
};

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(true);
  const logout = useLogout();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 72,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          backgroundColor: "#1e1e2f",
          color: "#fff"
        }
      }}
    >
      <Toolbar>
        <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
            AR Transport
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={activeTab === 1} onClick={() => setActiveTab(1)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <UserIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Users" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={activeTab === 2} onClick={() => setActiveTab(2)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <CalendarIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Attendance" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={activeTab === 3} onClick={() => setActiveTab(3)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ReportIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Reports" />}
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box p={2}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          {open && "Logout"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
