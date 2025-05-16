import React,{useState} from 'react';
import { Route,Routes } from 'react-router-dom';

import AdminDashboard from '../Pages/Admin/AdminDashboard';

import Sidebar from "../Components/Sidebar"
import AttendanceHistory from '../Pages/AttendanceHistory';





const UserLayout: React.FC = () => {

   const [tabValue, setTabValue] = useState(0);
    
  return (
    <div className='flex'>
     <Sidebar tabValue={tabValue} setTabValue={setTabValue}/>
      <Routes>
        {/*  routes  */}
        <Route path="/admin_dashboard" element={<AdminDashboard tabValue={tabValue} setTabValue={setTabValue}/>} />
        <Route path="/attendance_history" element={<AttendanceHistory/>} />
        
        
      </Routes>
    </div>
  );
}
export default UserLayout;