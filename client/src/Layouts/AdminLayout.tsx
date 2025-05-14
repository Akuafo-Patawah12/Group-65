import React,{useState} from 'react';
import { Route,Routes } from 'react-router-dom';

import AdminDashboard from '../Pages/Admin/AdminDashboard';

import Sidebar from "../Components/Sidebar"
import AttendanceHistory from '../Pages/AttendanceHistory';





const UserLayout: React.FC = () => {

  const [activeTab, setActiveTab] = useState<number>(1);
    
  return (
    <div className='flex'>
     <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
      <Routes>
        {/*  routes  */}
        <Route path="/admin_dashboard" element={<AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab}/>} />
        <Route path="/attendance_history" element={<AttendanceHistory/>} />
        
        
      </Routes>
    </div>
  );
}
export default UserLayout;