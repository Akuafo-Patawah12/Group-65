import React, { useEffect, useState } from "react";
import { Table, DatePicker, Card, Typography, Spin, Alert ,Input, Button, Select, Form, Modal} from "antd";
import SignInModal from "../Components/SignInModal";
import { ColumnsType } from "antd/es/table";
import moment from 'moment';
import { Moment } from 'moment';
import axios from "axios"
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

  axios.defaults.withCredentials=true
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/attendance/history");

      if (response.status !==200) {
        throw new Error("Failed to fetch attendance data");
      }

      const data =  response.data;
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


  const [location, setLocation] = useState({
      latitude: null,
      longitude: null,
      placeName: null,
      error: null,
    });
  
    const getLocationName = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
  
            setLocation((prev: any) => ({ ...prev, latitude: lat, longitude: lon }));
  
            const accessToken = "pk.eyJ1IjoiYWt1YWZvLTEiLCJhIjoiY200MXhxNnJrMDQzNjJrcjAzbXg4cTliMCJ9.6cwG6dff4E2UjnQz7q963A";
            try {
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`
              );
              const data = await response.json();
              if (data.features.length > 0) {
                setLocation((prev) => ({
                  ...prev,
                  placeName: data.features[0].place_name,
                }));
              } else {
                setLocation((prev: any) => ({ ...prev, placeName: "Location not found" }));
              }
            } catch (error) {
              setLocation((prev: any) => ({ ...prev, error: "Failed to fetch location name" }));
            }
          },
          (error) => {
            setLocation((prev: any) => ({ ...prev, error: error.message }));
          }
        );
      } else {
        setLocation((prev: any) => ({ ...prev, error: "Geolocation is not supported" }));
      }
    };

    useEffect(()=>{
      getLocationName()
    },[])


  return (
    <div>
    <div style={{ padding: '20px' }}>
    <div className="flex justify-between">
      <div className="flex">
      <img src="/truck.jpg" alt="logo" className="w-[60px] translate-y-[-5px]"/>
    <Button className="bg-blue-500" style={{color:"white",marginRight:"3px",background:"oklch(62.3% 0.214 259.815)"}} onClick={() => setShowSignInModal(true)}>Sign In</Button>
    <Button onClick={() => setShowSignInModal(true)}>Sign Out</Button>
    </div>
    <div style={{paddingLeft:"7px",padding:"4px"}} className=" flex gap-2 items-center bg-stone-200 p-2 h-fit rounded-2xl border border-stone-300 justify-between">
              <div className="flex items-center h-7 text-sm">Manuel</div>
              <div className="w-7 h-7 border-2 flex items-center justify-center border-blue-950 rounded-full">M</div>
          </div>
    </div>
      
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
