import React,{useState} from 'react';
import { Route,Routes } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import {  Menu,  Typography, Layout} from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import {Link,useNavigate } from "react-router-dom";

import AttendanceHistory from '../Pages/AttendanceHistory';
import UserHeader from '../Components/UserHeader';



const { Sider } = Layout;
const { Title } = Typography;

const UserLayout: React.FC = () => {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };

     const [collapsed, setCollapsed] = useState(false);
  return (
    <div className='flex'>
      

            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="dashboard-logo">
                <Title level={4} style={{ textAlign: "center",color:'white', padding: "16px 0" }}>
                  User Dashboard
                </Title>
              </div>
              <Menu mode="inline" defaultSelectedKeys={["1"]} style={{background:"transparent",}}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                  <Link to="/dashboard" style={{color:'white'}}>Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<CalendarOutlined />}>
              <Link to="/history" style={{color:'white'}}>Attendance History</Link>
            </Menu.Item>
                
                <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
        <p className="text-white absolute bottom-1 ">2018</p>
      </Sider>
       
      <Routes>
        {/* Define your routes here */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/history" element={<AttendanceHistory/>} />
        
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}
export default UserLayout;