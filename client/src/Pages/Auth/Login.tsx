import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  AppBar,
  Toolbar,
} from "@mui/material";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", formValues);
      const data = res.data;

      if (res.status === 200) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/protect/admin_dashboard");
      } else if (res.status === 201) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || "An error occurred. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Top Bar */}
      <AppBar position="fixed" color="transparent" elevation={1} sx={{background:"white", backdropFilter: "blur(10px)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 4 }}>
          <Box display="flex" alignItems="center">
            <img src="/truck.jpg" alt="logo" style={{ width: 70, marginRight: 12 }} />
            <Typography variant="h6" fontStyle="italic" fontWeight="bold" color="textPrimary">
              AR Transport
            </Typography>
          </Box>
          <Button variant="contained" color="primary" size="small">
            Terms & Conditions
          </Button>
        </Toolbar>
      </AppBar>

      {/* Login Card */}
      <Card
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          p: 3,
          width: 360,
          mt: 8,
        }}
        elevation={6}
      >
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            AR Transport Attendance System
          </Typography>
          <Box component="form" onSubmit={handleLogin} mt={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              type="password"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Log In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
