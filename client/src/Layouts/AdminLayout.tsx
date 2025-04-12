import React from 'react';
import { Route,Routes } from 'react-router-dom';

import AdminDashboard from '../Pages/Admin/AdminDashboard';

import Sidebar from "../Components/Sidebar"
import AttendanceHistory from '../Pages/AttendanceHistory';





const UserLayout: React.FC = () => {

  
    
  return (
    <div className='flex'>
     <Sidebar />
      <Routes>
        {/*  routes  */}
        <Route path="/admin_dashboard" element={<AdminDashboard/>} />
        <Route path="/attendance_history" element={<AttendanceHistory/>} />
        
        
      </Routes>
    </div>
  );
}
export default UserLayout;