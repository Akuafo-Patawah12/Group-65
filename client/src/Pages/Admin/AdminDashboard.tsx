import React,{useState,useEffect} from "react";
import { Tabs,Table,Space, Button, Modal, Form, Input, Select, Card,message,Popconfirm } from "antd";
import { UserOutlined,SearchOutlined, DollarOutlined, CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLogout } from "../../Hooks/Logout";
import { toast } from "react-toastify";
  import type { ColumnsType } from "antd/es/table";

  const { Search } = Input;
 
  import {Moment} from 'moment';
  import moment from 'moment';
  import axios from "axios"
  
 
  
const { TabPane } = Tabs;

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
  }

  const roles = ["user", "admin"];

  type DashboardTabsProps = {
    activeTab: string;
    setActiveTab: (key: string) => void;
  };

  interface AttendanceRecord {
    _id: string;
    employee_id: { name: string }; // or string if populated manually
    date: string;
    shift_type: string;
    sign_in_time: string;
    sign_out_time?: string;
    status: string;
  }

const AdminDashboard: React.FC <DashboardTabsProps> = ({ activeTab, setActiveTab }) => {

    const [users, setUsers] = useState<User[]>([]);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>(attendanceData);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [form] = Form.useForm();
  

  axios.defaults.withCredentials= true

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:4000/api/user_management"); // Adjust API URL if necessary
      if (response.status !==200 ) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.data;
      setUsers(data.users);
    } catch (err) {
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


  
  const currentUser = async()=>{
     try{
        const res = await fetch("http://localhost:4000/api/user_management/me", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setLoggedInUser(data);
          console.log(data)
     }catch(error){
        console.log(error)
        
     }
  }

  useEffect(() => {
    currentUser()
  },[])
  
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
 
      const [searchUsers, setSearchUsers] = useState("");
     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
      const handleSearch1 = (value: string) => {
        setSearchUsers(value.toLowerCase());
      
        const filtered = users.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.role.toLowerCase().includes(value.toLowerCase())
        );
      
        setFilteredUsers(filtered);
      };

      useEffect(() => {
        setFilteredUsers(users);
      }, [users]);
      

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


  const [searchText, setSearchText] = useState("");

const handleSearch = (value: string) => {
  setSearchText(value.toLowerCase());

  const filtered = attendanceData.filter((record) => {
      const name = typeof record.employee_id === "string"
          ? record.employee_id
          : record.employee_id.name;
      return name.toLowerCase().includes(value.toLowerCase());
    })
    .sort((a, b) => {
      const nameA =
        typeof a.employee_id === "string"
          ? a.employee_id
          : a.employee_id.name;
      const nameB =
        typeof b.employee_id === "string"
          ? b.employee_id
          : b.employee_id.name;
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    });

  setFilteredData(filtered);
};


  useEffect(() => {
    setFilteredData(attendanceData); // set initially
  }, [attendanceData]);
  


  const handleDeleteAttendance = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/${id}`, {
        method: "DELETE",
        credentials: "include", // if you're using cookies for auth
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete attendance record");
      }
  
      toast.success("Attendance record deleted successfully");
      
      // Re-fetch attendance data here
      fetchData(); // You must define this function to update your table data
  
    } catch (error) {
      console.error(error);
      message.error("Error deleting attendance record");
    }
  };


  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/${id}`, {
        method: "DELETE",
        credentials: "include", // if you're using cookies for auth
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete user record");
      }
  
      toast.success("User record deleted successfully");
      
      // Re-fetch user data here
      fetchUsers(); // You must define this function to update your table data
  
    } catch (error) {
      console.error(error);
      message.error("Error deleting attendance record");
    }
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
        render: (_, record) => (
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDeleteAttendance(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        ),
      }
  ];

 



  return (
    <div style={{ paddingBottom: 24 }} className="w-full flex  justify-center items-center flex-col">
      <header style={{paddingInline:"5%"}} className="flex justify-between items-center sticky bg-white z-2 border-b-4 border-stone-200 top-0 right-0 w-full h-[70px] px-[10px]">

                <div className="flex items-center">
                <img src="/truck.jpg" alt="logo" className="w-[60px] translate-y-[-5px]"/>
                <h1 style={{ fontSize: "24px",fontWeight:"600",  }} >Admin Dashboard</h1>
              </div>
              <div className="flex items-center justify-between bg-stone-100 border border-stone-300 rounded-full px-4 py-1 w-fit shadow-sm">
                <span className="text-sm text-stone-700">{loggedInUser}</span>
                <div className="ml-3 w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-900 bg-white text-blue-900 font-semibold">
                  {loggedInUser?.[0] ?? ""}
                </div>
              </div>

              
                
              
          
    
      </header>

     <div style={{marginTop:"40px"}} className="w-[90%] mx-auto mt-5">
      <Tabs  activeKey={activeTab} onChange={setActiveTab} type="card">
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
          <div className="w-full">
            <div className="flex h-[40px] justify-between items-center w-full">
            <Button type="primary" style={{height:"100%"}} onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>

            
      <Search
        placeholder="Search by name or email"
        allowClear
        onSearch={handleSearch1}
        
        enterButton={<span><SearchOutlined /> Search</span>}
        size="large"
        
        style={{
          maxWidth: 400,
          
          borderRadius: '8px',
        }}
      />
    
            </div>
      

            <Table
  dataSource={filteredUsers}
  rowKey="_id"
  columns={[
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    }
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
              <CalendarOutlined />
              Attendance
            </span>
          }
          key="2"
        >
          {/* Attendance management content goes here */}
          <Card title="Attendance Records">
          <Space direction="vertical" style={{ width: '100%' }}>
          <Search
  placeholder="Search attendance by name or email"
  allowClear
  enterButton={<span><SearchOutlined /> Search</span>}
  size="large"
  onSearch={handleSearch}
  style={{
    maxWidth: 400,
    margin: '0 auto',
    borderRadius: '8px',
  }}
/>

    </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
        </TabPane>
      </Tabs>

      <TabPane
          tab={
            <span>
              <CalendarOutlined />
              Reports
            </span>
          }
          key="2"
        >
          {/* Attendance management content goes here */}
          <Card title="Monthly reports">
          
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
        </TabPane>
    </div>
    </div>
  );
};

export default AdminDashboard;
