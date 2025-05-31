import React, { useState, FormEvent } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  
  Paper,
  Toolbar,
  AppBar
} from "@mui/material";

import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
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
                  <Link to="/TermsAndConditions">
                  <Button variant="contained" color="primary" size="small">
                    Terms & Conditions
                  </Button>
                  </Link>
                </Toolbar>
              </AppBar>

    <Container maxWidth="sm">
        
      <Paper elevation={3} sx={{ mt: 10, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Enter your email address to receive a password reset link.
        </Typography>

        {submitted ? (
          <Alert severity="success">
            If your email exists in our system, a reset link has been sent.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
            </Button>
          </Box>
        )}

        <Box mt={4} textAlign="center">
          <Link to="/" variant="body2" underline="hover">
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
};

export default ForgotPassword;
