import React from "react";
import { Layout, Menu, Card, Typography, Button } from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
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
            Attendance History
          </Menu.Item>
          <Menu.Item key="3" icon={<DollarOutlined />}>
            Payroll
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ background: "#fff", padding: 16, textAlign: "right" }}>
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Title level={2}>Welcome, John Doe</Title>
          <div className="dashboard-grid">
            <Card title="Attendance Summary" bordered={false}>
              <Text strong>Present: 18 days</Text> <br />
              <Text strong>Absent: 2 days</Text>
            </Card>
            <Card title="Latest Payroll" bordered={false}>
              <Text strong>Salary: $2,500</Text> <br />
              <Text strong>Paid on: March 30, 2025</Text>
            </Card>
            <Card title="Profile" bordered={false}>
              <Text strong>Name: John Doe</Text> <br />
              <Text strong>Email: johndoe@example.com</Text>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
