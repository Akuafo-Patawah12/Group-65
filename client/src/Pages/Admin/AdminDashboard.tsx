// This is the converted version of your admin dashboard using MUI (Material-UI) components and MUI DataGrid.

import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

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

const roles = ["user", "admin"];

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user_management", { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/attendance", { withCredentials: true });
      setAttendanceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name!]: value }));
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
          <DeleteOutlined color="error" />
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
      field: "sign_in_time",
      headerName: "Sign In",
      valueFormatter: ({ value }) => moment(value).format("hh:mm A"),
      flex: 1,
    },
    {
      field: "sign_out_time",
      headerName: "Sign Out",
      renderCell: ({ value }) => value ? moment(value).format("hh:mm A") : "N/A",
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

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Attendance" />
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
        {tabValue === 0 && (
          <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ marginBottom: 2 }}>
              Add User
            </Button>
            <DataGrid
              rows={users.map((u) => ({ ...u, id: u._id }))}
              columns={userColumns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </>
        )}
        {tabValue === 1 && (
          <DataGrid
            rows={attendanceData.map((a) => ({ ...a, id: a._id }))}
            columns={attendanceColumns}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add User
          </Typography>
          <Stack spacing={2}>
            <TextField label="Name" name="name" fullWidth onChange={handleInputChange} />
            <TextField label="Email" name="email" fullWidth onChange={handleInputChange} />
            <TextField label="Password" name="password" type="password" fullWidth onChange={handleInputChange} />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formValues.role} label="Role" onChange={handleInputChange}>
                {roles.map((role) => (
                  <MenuItem value={role} key={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;