import React, { useEffect, useState } from "react";
import { Table, DatePicker, Card, Typography, Spin, Alert ,Input, Button, Select, Form, Modal} from "antd";
import SignInModal from "../Components/SignInModal";
import { ColumnsType } from "antd/es/table";
import moment from 'moment';
import { Moment } from 'moment';
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Attendance {
  _id: string;
  employee_id: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  shift_type: "Regular" | "Overtime";
  sign_in_time: string;
  sign_out_time?: string;
  status: "Present" | "Late";
  createdAt: string;
}


const AttendanceHistory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [shiftType, setShiftType] = useState<'Regular' | 'Overtime'>('Regular');
  const [status, setStatus] = useState<'Present' | 'Late'>('Present');
  const [showSignInModal, setShowSignInModal] = useState(false);




  


  

  // Function to handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  

  const attendanceColumns: ColumnsType<Attendance> = [
    {
      title: "Employee Name",
      dataIndex: ["employee_id", "name"],
      key: "employee_name",
    },
    {
      title: "Email",
      dataIndex: ["employee_id", "email"],
      key: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Shift Type",
      dataIndex: "shift_type",
      key: "shift_type",
    },
    {
      title: "Sign In Time",
      dataIndex: "sign_in_time",
      key: "sign_in_time",
      render: (text) => moment(text).format("HH:mm:ss"),
    },
    {
      title: "Sign Out Time",
      dataIndex: "sign_out_time",
      key: "sign_out_time",
      render: (text) =>
        text ? moment(text).format("HH:mm:ss") : <i>Not signed out</i>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

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

  // Fetch attendance data from the server
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/attendance/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      setAttendanceData(data);
      setFilteredData(data); // Initialize filtered data with all attendance records
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data when the component mounts
  }, []);


  return (
    <div>
    <div style={{ padding: '20px' }}>
    <Button onClick={() => setShowSignInModal(true)}>Sign In</Button>

      
    </div>

    <SignInModal
  visible={showSignInModal}
  setAttendanceData={setAttendanceData}
  onClose={() => setShowSignInModal(false)}
  onSuccess={() => {
    // Refresh attendance data or show notification
  }}
/>

    <Card>
      <Title level={2}>Attendance History</Title>
      <RangePicker onChange={()=>handleDateFilter} style={{ marginBottom: "16px" }} />

      {loading ? (
        <Spin tip="Loading attendance history..." size="large">
          <Alert message="Fetching records" type="info" />
        </Spin>
      ) : (
        <Table columns={attendanceColumns} dataSource={filteredData} rowKey="id" />
      )}
    </Card>
    </div>
  );
};

export default AttendanceHistory;
