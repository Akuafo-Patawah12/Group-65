import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';

const TermsAndConditions: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ my: 6 }}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>

      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Effective Date: May 1, 2025
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          1. Introduction
        </Typography>
        <Typography>
          Welcome to AR Transport’s Employee Attendance System. By accessing or using this system, you agree to comply with the terms outlined below. These terms are intended to ensure fair, secure, and responsible use of the platform.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          2. System Purpose
        </Typography>
        <Typography>
          This system is designed for authorized employees of AR Transport to record attendance, monitor shifts, and manage work-related time logs. It helps maintain transparency, punctuality, and proper shift coordination.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          3. User Responsibilities
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Only authorized users may access the system using their assigned credentials.</li>
          <li>Employees must sign in and out accurately during their assigned shifts.</li>
          <li>Any attempt to falsify attendance will lead to disciplinary action.</li>
          <li>Users are responsible for keeping their login credentials confidential.</li>
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          4. Data Usage
        </Typography>
        <Typography>
          Attendance data collected via this system will be used solely for internal management, payroll processing, and compliance purposes. We do not share employee data with unauthorized third parties.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          5. Security and Access
        </Typography>
        <Typography>
          Unauthorized access or misuse of the system is strictly prohibited. AR Transport reserves the right to monitor usage and restrict or revoke access for any violations.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          6. Modifications
        </Typography>
        <Typography>
          AR Transport may update these Terms and Conditions at any time. Users will be notified of significant changes via email or system notifications. Continued use of the system implies acceptance of the revised terms.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          7. Contact Information
        </Typography>
        <Typography>
          If you have questions or concerns about these terms, please contact the IT department or your direct supervisor.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography color="text.secondary">
        © {new Date().getFullYear()} AR Transport. All rights reserved.
      </Typography>
    </Container>
  );
};

export default TermsAndConditions;
