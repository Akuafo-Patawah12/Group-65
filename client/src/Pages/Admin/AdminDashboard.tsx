import {  Card, Row, Col, Statistic } from "antd";

const Dashboard: React.FC = () => {
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic title="Total Employees" value={1128} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Present Today" value={1024} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Late Today" value={50} />
            </Card>
          </Col>
        </Row>
  
        <Row gutter={16} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Recent Attendance" bordered={false}>
              {/* You can use a Table or List here */}
              <p>List of recent attendance records...</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Upcoming Shifts" bordered={false}>
              {/* You can use a Table or List here */}
              <p>List of upcoming shifts...</p>
            </Card>
          </Col>
        </Row>
      </div>
    )
}
    export default Dashboard;