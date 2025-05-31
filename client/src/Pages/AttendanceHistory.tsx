import React, { useEffect, useState } from "react";
import {
  Box,
 
  Card,
  Divider,
  CircularProgress,
 
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
    <Box sx={{ p: { xs: 2, md: 4 }, mt: 6, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* Sign In Modal */}
      <SignInModal
        visible={showSignInModal}
        setAttendanceData={setAttendanceData}
        onClose={() => setShowSignInModal(false)}
        onSuccess={() => {}}
      />

      {/* Main Content Card */}
      <Card
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: 4,
          maxWidth: '100%',
          mx: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Attendance History
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Attendance Table or Loader */}
        {loading ? (
          <Box mt={6} display="flex" flexDirection="column" alignItems="center">
            <CircularProgress size={40} />
            <Alert severity="info" sx={{ mt: 3 }}>
              Fetching attendance records...
            </Alert>
          </Box>
        ) : (
          <Box sx={{ height: 520, width: '100%', mt: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                border: '1px solid #e0e0e0',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f1f5f9',
                  fontWeight: 'bold',
                  fontSize: '15px',
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
