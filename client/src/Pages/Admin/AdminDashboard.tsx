import React,{useState,useEffect} from "react";
import { Tabs,Table, Button, Modal, Form, Input, Select,DatePicker, Card,message } from "antd";
import { UserOutlined, DollarOutlined, CalendarOutlined, DeleteOutlined } from "@ant-design/icons";


  import type { ColumnsType } from "antd/es/table";
  const { RangePicker } = DatePicker;
 
  import {Moment} from 'moment';
  import moment from 'moment';
  
 
  
const { TabPane } = Tabs;

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
  }

  const roles = ["user", "admin"];

  interface AttendanceRecord {
    _id: string;
    employee_id: { name: string }; // or string if populated manually
    date: string;
    shift_type: string;
    sign_in_time: string;
    sign_out_time?: string;
    status: string;
  }

const AdminDashboard: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/user_management"); // Adjust API URL if necessary
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (values: User) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to add user");
      const newUser = await res.json();
      setUsers([newUser.user,...users ]);
      message.success("User added successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to add user");
      console.log(error)
    }
  };

  
    const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch("http://localhost:4000/api/attendance");
          if (!res.ok) {
            throw new Error("Failed to fetch attendance data");
          }
          const data = await res.json();
          setAttendanceData(data);
          setFilteredData(data); // If you want to set the filtered data as well
        } catch (error) {
          setError("There was an error fetching the attendance data. Please try again later.");
          message.error("Error: " + error.message); // Use Ant Design's message to show the error globally
        } finally {
          setLoading(false); // Always set loading to false once the request is completed
        }
      };
    
      useEffect(() => {
        fetchData(); // Fetch attendance data when the component mounts
      }, []);
 

  const handleDateFilter = (dates: [Moment | null, Moment | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      setFilteredData(attendanceData);
      return;
    }

    const [start, end] = dates;
    const filtered = attendanceData.filter((record) =>
      moment(record.date).isBetween(start, end, "day", "[]")
    );
    setFilteredData(filtered);
  };

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: "Employee",
      dataIndex: "employee_id",
      key: "employee_id",
      render: (value) => typeof value === "object" ? value.name : value,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Shift",
      dataIndex: "shift_type",
    },
    {
      title: "Sign In",
      dataIndex: "sign_in_time",
      render: (text) => moment(text).format("hh:mm A"),
    },
    {
      title: "Sign Out",
      dataIndex: "sign_out_time",
      render: (text) => text ? moment(text).format("hh:mm A") : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
        title: "Actions",
        key: "actions",
        render: (_,record) => (
            <Button
                type="link"
                onClick={() => {
                // Handle action here (e.g., edit or delete attendance record)
                console.log("Action clicked for:", record);
                }}
            >
                <DeleteOutlined style={{ color: "red" }} />
            </Button>
        ),
      },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Admin Dashboard</h1>

      <Tabs defaultActiveKey="1" type="card">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Users
            </span>
          }
          key="1"
        >
          {/* User management content goes here */}
          <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>

      <Table
        dataSource={users}
        rowKey="_id"
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          { title: "Role", dataIndex: "role" },
        ]}
        style={{ marginTop: "20px" }}
      />

      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleAddUser}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" initialValue="user">
            <Select>
              {roles.map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Payroll
            </span>
          }
          key="2"
        >
          {/* Payroll content goes here */}
          <p>Payroll history, add salary records, etc.</p>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              Attendance
            </span>
          }
          key="3"
        >
          {/* Attendance management content goes here */}
          <Card title="Attendance Records">
      <RangePicker
        onChange={()=>handleDateFilter}
        style={{ marginBottom: "16px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
