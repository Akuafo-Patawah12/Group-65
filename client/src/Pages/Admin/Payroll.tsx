import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Typography, Alert } from "antd";
import { fetchPayrollData } from "../Services/AdminPayrollServices"; // Import the service function

const { Title } = Typography;

const Payroll: React.FC = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPayrollData(); // Fetch payroll data
        setPayrollData(response); // Set the payroll data
      } catch (err) {
        console.error("Error fetching payroll data:", err); // Log the error
        setError("Failed to load payroll data."); // Handle error
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchData(); // Call fetch data on component mount
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
    },
    {
      title: "Deductions",
      dataIndex: "deductions",
      key: "deductions",
    },
    {
      title: "Net Pay",
      dataIndex: "netPay",
      key: "netPay",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={3}>Payroll Information</Title>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={payrollData}
            rowKey="date"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default Payroll;
