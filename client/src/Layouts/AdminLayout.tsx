import React from 'react';
import { Route,Routes } from 'react-router-dom';

import AdminDashboard from '../Pages/Admin/AdminDashboard';


import AttendanceHistory from '../Pages/AttendanceHistory';
import Payroll from '../Pages/Payroll';




const UserLayout: React.FC = () => {

  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  return (
    <div>
     
      <Routes>
        {/* Define your routes here */}
        <Route path="/admin_dashboard" element={<AdminDashboard/>} />
        <Route path="/attendance_history" element={<AttendanceHistory/>} />
        <Route path="/admin_payroll" element={<Payroll />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}
export default UserLayout;