// Rewritten Admin Dashboard with MUI, DataGrid, and Axios

import React, { useState, useEffect } from "react";
import {
  Box, Tabs, Tab, Typography, Button,Dialog,DialogTitle,DialogContent, Modal, TextField, Select, MenuItem, InputLabel,
  FormControl,DialogActions, IconButton, Avatar, Snackbar, Alert, CircularProgress, Stack, Paper, Grid
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AttendanceRecord {
  _id: string;
  employee_id: { name: string } | string;
  date: string;
  shift_type: string;
  sign_in_time: string;
  sign_out_time?: string;
  status: string;
}

type SidebarProps = {
  tabValue: number;
  setTabValue: (key: number) => void;
};

const AdminDashboard: React.FC<SidebarProps> = ({ tabValue, setTabValue }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

 

  useEffect(() => {
    if (tabValue === 2) fetchFilteredAttendance();
  }, [selectedYear, userName]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user_management", { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const currentUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/user_management/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setLoggedInUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [filter,setFilter] = useState([])

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/attendance", { withCredentials: true });
      setFilter(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  };

   useEffect(() => {
    fetchUsers();
    fetchAttendance();
    currentUser();
  }, []);

  const fetchFilteredAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/attendance/filter", {
        params: {
          year: selectedYear,
          userName: userName.trim(),
        },
        withCredentials: true,
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name!] : value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/auth/signup", formValues, { withCredentials: true });
      setUsers([res.data.user, ...users]);
      setSnackbar({ open: true, message: "User added successfully", severity: "success" });
      setOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to add user", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/auth/${id}`, { withCredentials: true });
      fetchUsers();
      setSnackbar({ open: true, message: "User deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    }
  };

  const deleteAttendance = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/attendance/${id}`, { withCredentials: true });
      fetchAttendance();
      setSnackbar({ open: true, message: "Record deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete record", severity: "error" });
    }
  };

  const userColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => deleteUser(params.row._id)}>
          <DeleteOutlined size={15} color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  const attendanceColumns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Employee",
      flex: 1,
      renderCell: (params) =>
        typeof params.row.employee_id === "string"
          ? params.row.employee_id
          : params.row.employee_id?.name || "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      valueFormatter: ({ value }) => moment(value).format("YYYY-MM-DD"),
      flex: 1,
    },
    { field: "shift_type", headerName: "Shift", flex: 1 },
    {
      field: "location",
      headerName: "Location",
      renderCell: ({ value }) => (value ? value : "-"),
      flex: 1,
    },
    {
      field: "sign_in_time",
      headerName: "Sign In",
      valueFormatter: ({ value }) => moment(value).format("hh:mm A"),
      flex: 1,
    },
    {
      field: "sign_out_time",
      headerName: "Sign Out",
      renderCell: ({ value }) => (value ? moment(value).format("hh:mm A") : "N/A"),
      flex: 1,
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => deleteAttendance(params.row._id)}>
          <DeleteOutlined color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];


  const generateMonthlyData = (data: AttendanceRecord[]) => {
  const monthlySummary: { [key: string]: any } = {};

  data.forEach(record => {
    const month = moment(record.date).format("MMM");

    if (!monthlySummary[month]) {
      monthlySummary[month] = { month, present: 0, late: 0, absent: 0 };
    }

    const status = record.status.toLowerCase();
    if (status === "present") monthlySummary[month].present += 1;
    else if (status === "late") monthlySummary[month].late += 1;
    else if (status === "absent") monthlySummary[month].absent += 1;
  });

  // Sort months correctly (Jan–Dec)
  const monthOrder = moment.monthsShort();
  return monthOrder
    .map((m) => monthlySummary[m] || { month: m, present: 0, late: 0, absent: 0 });
};


  return (
    <Box sx={{ width: "100%"}}>
      {/* Header */}
      <header className="flex justify-between items-center sticky bg-white z-2 border-b-4 border-stone-200 top-0 right-0 w-full h-[70px] px-[10px]" style={{ paddingInline: "5%" }}>
        <div className="flex items-center">
          <img src="/truck.jpg" alt="logo" className="w-[60px] translate-y-[-5px]" />
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Admin Dashboard</h1>
        </div>
        <Paper elevation={1} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '999px', bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.300', width: 'fit-content' }}>
          <Typography variant="body2" color="text.primary">{loggedInUser}</Typography>
          <Avatar sx={{ width: 32, height: 32, ml: 1.5, bgcolor: 'white', color: 'primary.dark', fontWeight: 600, border: '2px solid', borderColor: 'primary.dark' }}>{loggedInUser?.[0] ?? ''}</Avatar>
        </Paper>
      </header>

      <Tabs sx={{ marginLeft:"5%",marginTop:"20px"}} value={tabValue} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Attendance" />
        <Tab label="Reports" />
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
        {tabValue === 0 && (
          <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ marginBottom: 2 ,marginLeft:"5%"}}>Add User</Button>
            <Box sx={{width:"90%",marginInline:"auto"}}>
              <DataGrid 
                rows={users.map((u) => ({ ...u, id: u._id }))} 
                columns={userColumns} 
                autoHeight 
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]} 
                 
              />
            </Box>
          </>
        )}

        {tabValue === 1 && (
          <Box sx={{width:"90%",marginInline:"auto"}}>
          <DataGrid rows={filter.map((a) => ({ ...a, id: a._id }))} columns={attendanceColumns} autoHeight pageSize={5} rowsPerPageOptions={[5]} />
          </Box>
        )}

        {tabValue === 2 && (
  <Box p={3} sx={{marginLeft:"5%"}}>
    <Typography variant="h5"  gutterBottom>Monthly User Report</Typography>
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Username"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          InputProps={{ startAdornment: <SearchOutlined /> }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Year"
          fullWidth
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          InputProps={{ startAdornment: <CalendarOutlined /> }}
        />
      </Grid>
    </Grid>

    {/* Report Graph */}
    <ResponsiveContainer width="90%" height={300}>
      <BarChart
        data={generateMonthlyData(attendanceData)}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="present" fill="#4caf50" name="Present" />
        <Bar dataKey="late" fill="#ff9800" name="Late" />
        <Bar dataKey="absent" fill="#f44336" name="Absent" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
)}

      </Box>


      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formValues.role}
            onChange={handleInputChange}
            margin="normal"
            required
          >
            {["admin", "worker"].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
