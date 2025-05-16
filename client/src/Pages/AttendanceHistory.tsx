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
  Avatar
} from "@mui/material";
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

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <img src="/truck.jpg" alt="logo" style={{ width: 60 }} />
          <Button variant="contained" color="primary" onClick={() => setShowSignInModal(true)}>
            Sign In
          </Button>
          <Button variant="outlined" onClick={() => setShowSignInModal(true)}>
            Sign Out
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={1} p={1} bgcolor="#eee" borderRadius={5}>
          <Typography variant="body2">Manuel</Typography>
          <Avatar>M</Avatar>
        </Box>
      </Box>

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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Shift Type</TableCell>
                  <TableCell>Sign In Time</TableCell>
                  <TableCell>Sign Out Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.employee_id.name}</TableCell>
                    <TableCell>{record.employee_id.email}</TableCell>
                    <TableCell>{moment(record.date).format("YYYY-MM-DD")}</TableCell>
                    <TableCell>{record.shift_type}</TableCell>
                    <TableCell>{moment(record.sign_in_time).format("HH:mm:ss")}</TableCell>
                    <TableCell>
                      {record.sign_out_time
                        ? moment(record.sign_out_time).format("HH:mm:ss")
                        : <i>Not signed out</i>}
                    </TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>{moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default AttendanceHistory;
