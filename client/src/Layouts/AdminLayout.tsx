import React from 'react';
import { Route,Routes } from 'react-router-dom';

import AdminDashboard from '../Pages/Admin/AdminDashboard';
import {  Menu,  Typography, Layout} from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import {Link,useNavigate } from "react-router-dom";

import AttendanceHistory from '../Pages/AttendanceHistory';
import Payroll from '../Pages/Payroll';


const { Sider } = Layout;
const { Title } = Typography;

const UserLayout: React.FC = () => {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  return (
    <div className='flex'>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: "#fff" }}>
              <div className="dashboard-logo">
                <Title level={4} style={{ textAlign: "center", padding: "16px 0" }}>
                  User Dashboard
                </Title>
              </div>
              <Menu mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                  Profile
                </Menu.Item>
                <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/history">Attendance History</Link>
            </Menu.Item>
                <Menu.Item key="3" icon={<DollarOutlined />}>
                  Payroll
                </Menu.Item>
                <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
            </Sider>
      <Routes>
        {/* Define your routes here */}
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path="/history" element={<AttendanceHistory/>} />
        <Route path="/payroll" element={<Payroll />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}
export default UserLayout;