import React, { useEffect, useState } from "react";
import { Table, DatePicker, Card, Typography, Spin, Alert ,Input, Button, Select, Form, Modal} from "antd";

import { ColumnsType } from "antd/es/table";
import moment from 'moment';
import { Moment } from 'moment';
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface AttendanceRecord {
  id: string;
  date: string;
  shift: string;
  status: string;
  clockIn: string;
  clockOut: string;
}

const AttendanceHistory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [shiftType, setShiftType] = useState<'Regular' | 'Overtime'>('Regular');
  const [status, setStatus] = useState<'Present' | 'Late'>('Present');

  const handleSignIn = async () => {
    const response = await fetch('http://localhost:3001/api/attendance/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: employeeId,
        shift_type: shiftType,
        status,
      }),
    });

    const data = await response.json();
    alert(data.message || 'Signed in!');
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  

  useEffect(() => {
    // Simulating fetching attendance data from API
    setTimeout(() => {
      const mockData: AttendanceRecord[] = [
        { id: "1", date: "2025-03-01", shift: "Morning", status: "Present", clockIn: "08:00 AM", clockOut: "05:00 PM" },
        { id: "2", date: "2025-03-02", shift: "Evening", status: "Absent", clockIn: "-", clockOut: "-" },
        { id: "3", date: "2025-03-03", shift: "Night", status: "Present", clockIn: "10:00 PM", clockOut: "06:00 AM" },
      ];
      setAttendanceData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle date range filter
  const handleDateFilter = (dates:[Moment | null, Moment | null]) => {
    if (!dates) {
      setFilteredData(attendanceData);
      return;
    }

    const [start, end] = dates;
    const filtered = attendanceData.filter((record) =>
      moment(record.date).isBetween(start, end, undefined, "[]")
    );

    setFilteredData(filtered);
  };

  const columns: ColumnsType<AttendanceRecord> = [
    { title: "Date", dataIndex: "date", key: "date", render: (date) => moment(date).format("MMM DD, YYYY") },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => 
        <span style={{ color: status === "Present" ? "green" : "red" }}>{status}</span> 
    },
    { title: "Clock In", dataIndex: "clockIn", key: "clockIn" },
    { title: "Clock Out", dataIndex: "clockOut", key: "clockOut" },
  ];

  return (
    <div>
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={showModal}>
        Sign In
      </Button>

      <Modal
        title="Sign In"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form layout="vertical" onFinish={handleSignIn}>
          <Form.Item label="Employee ID" required>
            <Input
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Shift Type" required>
            <Select
              value={shiftType}
              onChange={(value) => setShiftType(value)}
              placeholder="Select Shift Type"
            >
              <Option value="Regular">Regular</Option>
              <Option value="Overtime">Overtime</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" required>
            <Select
              value={status}
              onChange={(value) => setStatus(value)}
              placeholder="Select Status"
            >
              <Option value="Present">Present</Option>
              <Option value="Late">Late</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    <Card>
      <Title level={2}>Attendance History</Title>
      <RangePicker onChange={()=>handleDateFilter} style={{ marginBottom: "16px" }} />

      {loading ? (
        <Spin tip="Loading attendance history..." size="large">
          <Alert message="Fetching records" type="info" />
        </Spin>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      )}
    </Card>
    </div>
  );
};

export default AttendanceHistory;
