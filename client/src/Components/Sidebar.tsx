import { useState } from "react"
import {Layout,Menu,Typography} from "antd"
import { useLogout } from "../Hooks/Logout"
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";


const { Sider, Content } = Layout;

type SidebarProps = {
  activeTab: string;
  setActiveTab: (key: string) => void;
};

const { Title } = Typography;
const Sidebar: React.FC <SidebarProps>=({ activeTab, setActiveTab })=>{

  const logout = useLogout(); // Call the hook at the top level

  const handleLogout =  () => {
    logout(); // Now you can call it like this
   
  };


  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
    return(
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ color: "white", padding: "16px" }}>
           <h6>AR Transport</h6>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <button onClick={()=> setActiveTab('1')}>Users</button>
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
          <button onClick={()=> setActiveTab('2')}>Attendance</button>
          </Menu.Item>
          <Menu.Item key="3" icon={<CalendarOutlined />}>
          <button onClick={()=> setActiveTab('3')}>Reports</button>
          </Menu.Item>
        </Menu>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white  font-medium w-full py-4 px-4 rounded-lg shadow transition duration-200 ease-in-out"
        >
          Logout
        </button>

       
      </Sider>
    )
}

export default Sidebar