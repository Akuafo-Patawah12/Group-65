import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

interface ShiftStatus {
  Regular: { signedIn: boolean; signedOut: boolean };
  Overtime: { signedIn: boolean; signedOut: boolean };
}

const Dashboard: React.FC = () => {
  const [form] = Form.useForm();
  const employeeId = Form.useWatch("employee_id", form);
  const shiftType = Form.useWatch("shift_type", form);

  const [loading, setLoading] = useState(false);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>({
    Regular: { signedIn: false, signedOut: false },
    Overtime: { signedIn: false, signedOut: false },
  });

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

  const fetchShiftStatus = async (employee_id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/attendance/status/${employee_id}`,
        { withCredentials: true }
      );
      setShiftStatus(res.data);
    } catch (err) {
      console.error("Error fetching shift status:", err);
    }
  };

  const handleSignIn = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/attendance/signIn",
        values,
        { withCredentials: true }
      );

      if (res.status === 201) {
        message.success("Signed in successfully!");
        form.resetFields();
        setShiftStatus((prev) => ({
          ...prev,
          [values.shift_type]: { ...prev[values.shift_type], signedIn: true },
        }));
        fetchShiftStatus(values.employee_id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!employeeId || !shiftType) {
      return message.warning("Fill in all fields");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/attendance/signOut",
        { employee_id: employeeId, shift_type: shiftType },
        { withCredentials: true }
      );

      if (res.status === 200) {
        message.success("Signed out successfully!");
        form.resetFields();
        setShiftStatus((prev: any) => ({
          ...prev,
          [shiftType]: { ...prev[shiftType], signedOut: true },
        }));
        fetchShiftStatus(employeeId);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Sign-out failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationName();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchShiftStatus(employeeId);
    }
  }, [employeeId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full ">
      <header className="flex justify-between items-center h-[50px] sticky z-2 border-b-4 border-stone-200 top-0 right-0 w-full px-[10px]">
          <h2 className="ml-3">AR Transport</h2>
          <div className="ml-3 flex gap-2 items-center justify-center">
              <p>Manuel</p>
              <div className="w-7 h-7 flex items-center justify-center border-2 border-blue-950 rounded-full">M</div>
          </div>
      </header>
      
      <div style={{paddingInline:"20px"}} className=" w-[400px] backdrop-blur-lg bg-white/50 rounded-xl shadow-xl p-6 m-4">
        <Title level={3} className="text-center mb-6 text-gray-800">
          AR Transport Attendance
        </Title>

        <div className="mt-6 text-center px-4 py-3 rounded-xl bg-white/60 backdrop-blur shadow-md border p-2 border-gray-200 w-fit mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
            📍 Current Location:
          </h3>
          <p className="text-sm text-gray-700 mt-1">{location.placeName}</p>
        </div>

        <Form layout="vertical" form={form} onFinish={handleSignIn}>
          <Form.Item
            name="employee_id"
            label="Employee ID"
            rules={[{ required: true, message: "Please enter your ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="shift_type"
            label="Shift Type"
            rules={[{ required: true, message: "Please select shift type" }]}
          >
            <Select placeholder="Select shift">
              <Option
                value="Regular"
                disabled={shiftStatus.Regular.signedOut}
              >
                Regular
              </Option>
              <Option
                value="Overtime"
                disabled={
                  !shiftStatus.Regular.signedOut ||
                  shiftStatus.Overtime.signedOut
                }
              >
                Overtime
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Present">Present</Option>
              <Option value="Late">Late</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={
                !!shiftType &&
                shiftStatus[shiftType]?.signedIn &&
                !shiftStatus[shiftType]?.signedOut
              }
            >
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              onClick={handleSignOut}
              block
              disabled={
                !shiftType ||
                !shiftStatus[shiftType]?.signedIn ||
                shiftStatus[shiftType]?.signedOut ||
                loading
              }
            >
              Sign Out
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="w-[400px] h-[300px] rounded-xl overflow-hidden shadow-lg m-4">
        <div id="map" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Dashboard;
