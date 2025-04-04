import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import AttendanceHistory from '../Pages/AttendanceHistory';
import Payroll from '../Pages/Payroll';


const UserLayout: React.FC = () => {
  return (
    <div>
      <Routes>
        {/* Define your routes here */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/history" element={<AttendanceHistory/>} />
        <Route path="/payroll" element={<Payroll />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}
export default UserLayout;