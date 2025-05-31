import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from "moment";
import UserHeader from "../Components/UserHeader";
import SessionExpiredDialog from "../Components/SessionExpiredModal";

interface ShiftStatus {
  Regular: { signedIn: boolean; signedOut: boolean };
  Overtime: { signedIn: boolean; signedOut: boolean };
}

interface AttendanceEntry {
  _id: string;
  employee_id: string | { _id: string; name: string }; // if populated
  shift_type: "Regular" | "Overtime" | string;
  status: "Present" | "Late"  | string;
  location: string;
  date: string; // ISO date string (e.g. "2025-05-14T00:00:00.000Z")
  createdAt: string;
  sign_in_time: string;
  sign_out_time?: string;
}


const Dashboard: React.FC = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const employeeId = watch("employee_id");
  const shiftType = watch("shift_type");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>({
    Regular: { signedIn: false, signedOut: false },
    Overtime: { signedIn: false, signedOut: false },
  });

    const [reportOpen, setReportOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
   axios.defaults.withCredentials = true;
   
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
                if (res.status === 401) {
                  setSessionExpired(true);
                  return;
                }
           }catch(error){
              console.log(error)
              
           }
        }
      
        useEffect(() => {
          currentUser()
        },[])

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
  };

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    placeName: null,
    error: null,
  });

  const getLocationName = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLocation((prev: any) => ({ ...prev, latitude: lat, longitude: lon }));

          const accessToken = "pk.eyJ1IjoiYWt1YWZvLTEiLCJhIjoiY200MXhxNnJrMDQzNjJrcjAzbXg4cTliMCJ9.6cwG6dff4E2UjnQz7q963A";
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`
            );
            const data = await response.json();
            if (data.features.length > 0) {
              setLocation((prev) => ({
                ...prev,
                placeName: data.features[0].place_name,
              }));
            } else {
              setLocation((prev: any) => ({ ...prev, placeName: "Location not found" }));
            }
          } catch (error) {
            setLocation((prev: any) => ({ ...prev, error: "Failed to fetch location name" }));
          }
        },
        (error) => {
          setLocation((prev: any) => ({ ...prev, error: error.message }));
        }
      );
    } else {
      setLocation((prev: any) => ({ ...prev, error: "Geolocation is not supported" }));
    }
  };

  const fetchShiftStatus = async (employee_id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/attendance/status/${employee_id}`,
        { withCredentials: true }
      );
      setShiftStatus(res.data);
    } catch (err) {
      console.error("Error fetching shift status:", err);
    }
  };

 

  const handleSignOut = async () => {
   

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/attendance/signOut"
        
      );

      if (res.status === 200) {
        alert("Signed out successfully!");
        reset();
        getUserAttendanceThisMonth()
        
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sign-out failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationName();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchShiftStatus(employeeId);
    }
  }, [employeeId]);

  const rows = [
  {
    id: 1,
    name: "John Simons",
    shift: "Regular",
    signIn: "2025-05-13T08:15:00",
    signOut: "2025-05-13T17:00:00",
  },
  {
    id: 2,
    name: "Jane Doe",
    shift: "Overtime",
    signIn: "2025-05-13T18:00:00",
    signOut: "2025-05-13T21:30:00",
  },
];

const [attendance,setAttendance] = useState<AttendanceEntry[]>([]);
const getUserAttendanceThisMonth = async () => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/attendance/thisMonthRecords`,
      { withCredentials: true }
    );
    setAttendance(response.data);
    console.log("thisMonthRecords",response.data);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch attendance"
    );
  }
};

useEffect(() => {
  getUserAttendanceThisMonth()
}, []);

// Define the columns
const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 180 },
  { field: "shift_type", headerName: "Shift", width: 120 },
  {
    field: "sign_in_time",
    headerName: "Sign In",
    width: 180,
    renderCell: (params) =>
      params.value ? moment(params.value).format("YYYY-MM-DD HH:mm") : "",
  },
  {
    field: "sign_out_time",
    headerName: "Sign Out",
    width: 180,
    renderCell: (params) =>
      params.value ? moment(params.value).format("YYYY-MM-DD HH:mm") : "—",
  },
  { field: "location", headerName: "Location", width: 120 },
  { field: "createdAt", headerName: "Date", width: 120 },
];


const reportData = Object.entries(
  attendance.reduce((acc, attends) => {
    const date = moment(attends.sign_in_time).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([date, count]) => ({ date, signIns: count }));


const handleSignIn = async (data) => {
  setLoading(true);
  if ( !data.shift_type || !data.status) {
    toast.error("Fill in all fields");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/api/attendance/signIn",
      {
        shift_type: data.shift_type,
        status: data.status,
        location: location.placeName,
      },
      {
        withCredentials: true,
      }
    );

    getUserAttendanceThisMonth()

    toast.success("Signed in successfully");

    setShiftStatus((prev) => ({
      ...prev,
      [data.shift_type]: {
        signedIn: true,
        signedOut: false,
      },
    }));

   
  } catch (err) {
    setLoading(false);
    const message = err.response?.data?.message || "Sign-in failed";
    toast.error(message);
  }
};



  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-4">
  {/* Action Buttons */}
  <div style={{marginBlock:"40px"}} className="mb-6">
    <div className="flex flex-wrap  gap-4">
      <Button variant="contained" sx={{ backgroundColor: '#3b82f6' }} onClick={() => setOpen(true)}>
        Check In
      </Button>
      <Button variant="contained" sx={{ backgroundColor: '#3b82f6' }} onClick={handleSignOut}>
        Check Out
      </Button>
      <Button variant="contained" sx={{ backgroundColor: '#3b82f6' }} onClick={() => setReportOpen(true)}>
        Personal Report
      </Button>
    </div>
  </div>

  {/* Data Grid */}
  <Box sx={{ height: 500, width: '90%', backgroundColor: '#fff', borderRadius: 2, boxShadow: 3, p: 2 }}>
    <DataGrid
      rows={attendance}
      getRowId={(row) => row._id}
      columns={columns}
      autoHeight
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
    />
  </Box>

  {/* Check-In Modal */}
  <Modal open={open} onClose={() => setOpen(false)}>
    <Box
      sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 400, bgcolor: "background.paper", boxShadow: 24, borderRadius: 3, p: 4
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        AR Transport Attendance
      </Typography>

      {/* Location Box */}
      <Box
        sx={{
          mt: 2, p: 2, borderRadius: 2, backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb", textAlign: "center", mb: 3,
        }}
      >
        <Typography fontWeight="bold">Current Location:</Typography>
        <Typography variant="body2" color="text.secondary">
          {location.placeName || "Fetching..."}
        </Typography>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(handleSignIn)}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Shift Type</InputLabel>
          <Select
            defaultValue=""
            {...register("shift_type", { required: true })}
            label="Shift Type"
          >
            <MenuItem value="Regular" disabled={shiftStatus.Regular.signedOut}>
              Regular
            </MenuItem>
            <MenuItem
              value="Overtime"
              disabled={!shiftStatus.Regular.signedOut || shiftStatus.Overtime.signedOut}
            >
              Overtime
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            defaultValue=""
            {...register("status", { required: true })}
            label="Status"
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={
            !!shiftType &&
            shiftStatus[shiftType]?.signedIn &&
            !shiftStatus[shiftType]?.signedOut
          }
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignOut}
          
        >
          Sign Out
        </Button>
      </form>
    </Box>
  </Modal>

  {/* Report Modal */}
  <Modal open={reportOpen} onClose={() => setReportOpen(false)}>
    <Box sx={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", width: 600,
      bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 3,
    }}>
      <Typography variant="h6" gutterBottom align="center">
        Personal Monthly Sign-In Report
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="signIns" fill="#3b82f6" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Modal>

  {/* Session Expired Dialog */}
  <SessionExpiredDialog open={sessionExpired} onReload={() => window.location.href = "/"} />

 
</div>

  );
};

export default Dashboard;