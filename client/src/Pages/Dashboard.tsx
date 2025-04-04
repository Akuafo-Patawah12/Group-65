import React from "react";
import { Layout,  Card, Typography} from "antd";



const { Content } = Layout;
const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
  

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      

      {/* Main Content */}
      <Layout>
        

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
