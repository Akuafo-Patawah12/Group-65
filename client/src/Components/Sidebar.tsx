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
import { MenuOutlined, UserOutlined, CalendarOutlined, BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "../Hooks/Logout";

type SidebarProps = {
  tabValue: number;
  setTabValue: (key: number) => void;
};

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ tabValue, setTabValue }) => {
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
          <MenuOutlined />
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
          <ListItemButton selected={tabValue === 0} onClick={() => setTabValue(0)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <UserOutlined />
            </ListItemIcon>
            {open && <ListItemText primary="Users" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={tabValue === 1} onClick={() => setTabValue(1)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <CalendarOutlined />
            </ListItemIcon>
            {open && <ListItemText primary="Attendance" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={tabValue === 2} onClick={() => setTabValue(2)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <BarChartOutlined />
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
          startIcon={<LogoutOutlined />}
          onClick={logout}
        >
          {open && "Logout"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
