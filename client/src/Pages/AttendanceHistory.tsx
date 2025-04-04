import React, { useEffect, useState } from "react";
import { Table, DatePicker, Card, Typography, Spin, Alert } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

const { Title } = Typography;
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
  const handleDateFilter = (dates: any) => {
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
    <Card>
      <Title level={2}>Attendance History</Title>
      <RangePicker onChange={handleDateFilter} style={{ marginBottom: "16px" }} />

      {loading ? (
        <Spin tip="Loading attendance history..." size="large">
          <Alert message="Fetching records" type="info" />
        </Spin>
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      )}
    </Card>
  );
};

export default AttendanceHistory;
