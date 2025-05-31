import React, { useState, FormEvent } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Toolbar,
  AppBar
} from '@mui/material';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }

      setMessage(data.message || 'Password reset successful!');
      setError('');

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Try again later.');
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
    <Container maxWidth="sm" >
  <Box
    mt={10}
    p={4}
    sx={{ background: "white" }}
    boxShadow={3}
    borderRadius={2}
  >
    <Typography variant="h5" gutterBottom>
      Reset Password
    </Typography>

    {error && <Alert severity="error">{error}</Alert>}
    {message && <Alert severity="success">{message}</Alert>}

    <Box component="form" mt={2} onSubmit={handleSubmit}>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Reset Password
      </Button>
    </Box>
  </Box>
</Container>

    </Box>
  );
};

export default ResetPassword;
