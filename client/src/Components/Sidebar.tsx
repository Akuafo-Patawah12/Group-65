import { useState } from "react"
import {Layout,Menu,Typography} from "antd"

import { UserOutlined, CalendarOutlined } from "@ant-design/icons";


const { Sider, Content } = Layout;
const { Title } = Typography;
const Sidebar=()=>{

  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
    return(
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ color: "white", padding: "16px" }}>
           <h6>AR Transport</h6>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            Attendance
          </Menu.Item>
          <Menu.Item key="3" icon={<CalendarOutlined />}>
            Reports
          </Menu.Item>
        </Menu>
       
      </Sider>
    )
}

export default Sidebar