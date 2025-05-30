import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import moment, { Moment } from "moment";
import axios from "axios";
import SignInModal from "../Components/SignInModal";

interface Attendance {
  _id: string;
  employee_id: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  shift_type: "Regular" | "Overtime";
  sign_in_time: string;
  sign_out_time?: string;
  status: "Present" | "Late";
  createdAt: string;
}

const AttendanceHistory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  axios.defaults.withCredentials = true;

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/attendance/history");
      if (response.status !== 200) throw new Error("Failed to fetch attendance data");
      setAttendanceData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const [start, end] = dateRange;
    if (!start || !end) {
      setFilteredData(attendanceData);
      return;
    }
    const filtered = attendanceData.filter((record) =>
      moment(record.date).isBetween(start, end, undefined, "[]")
    );
    setFilteredData(filtered);
  }, [dateRange, attendanceData]);

  const columns = [
  { field: 'name', headerName: 'Employee Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'date', headerName: 'Date', flex: 1 },
  { field: 'shift_type', headerName: 'Shift Type', flex: 1 },
  { field: 'sign_in_time', headerName: 'Sign In Time', flex: 1 },
  { field: 'sign_out_time', headerName: 'Sign Out Time', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 }
];

const rows = filteredData.map((record, index) => ({
  id: record._id || index,
  name: record.employee_id?.name || "N/A",
  email: record.employee_id?.email || "N/A",
  date: moment(record.date).format("YYYY-MM-DD"),
  shift_type: record.shift_type,
  sign_in_time: moment(record.sign_in_time).format("HH:mm:ss"),
  sign_out_time: record.sign_out_time
    ? moment(record.sign_out_time).format("HH:mm:ss")
    : "Not signed out",
  status: record.status,
  createdAt: moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss"),
}));

  return (
    <Box p={3} sx={{ marginTop: 8 }}>
      

      {/* Sign In Modal */}
      <SignInModal
        visible={showSignInModal}
        setAttendanceData={setAttendanceData}
        onClose={() => setShowSignInModal(false)}
        onSuccess={() => {}}
      />

      {/* Main Card */}
      <Card style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Attendance History
        </Typography>

        {/* Date Range Filters */}
        <Box display="flex" gap={2} mt={2} mb={2}>
          <TextField
            label="Start Date"
            type="date"
            value={dateRange[0] ? moment(dateRange[0]).format("YYYY-MM-DD") : ""}
            onChange={(e) => setDateRange([moment(e.target.value), dateRange[1]])}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={dateRange[1] ? moment(dateRange[1]).format("YYYY-MM-DD") : ""}
            onChange={(e) => setDateRange([dateRange[0], moment(e.target.value)])}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        {/* Attendance Table or Loader */}
        {loading ? (
          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Alert severity="info" sx={{ mt: 2 }}>
              Fetching records...
            </Alert>
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%'}}>
  <DataGrid
    rows={rows}
    columns={columns}
    pageSize={10}
    rowsPerPageOptions={[5, 10, 20]}
    sx={{
      borderRadius: 2,
      boxShadow: 3,
      border: '1px solid #ccc',
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#f3f4f6',
        fontWeight: 'bold',
      },
      '& .MuiDataGrid-cell': {
        fontSize: '14px',
      },
    }}
  />
</Box>

        )}
      </Card>
    </Box>
  );
};

export default AttendanceHistory;
