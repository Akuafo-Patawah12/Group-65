import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import {toast} from "react-toastify"
const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials=true
  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        values,
        
      );
  
      const data = res.data;
  
      if (res.status === 200) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/protect/admin_dashboard");
      } else if (res.status === 201) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    style={{
      backgroundImage: "url('/wallpaper.jpg')", // replace with your actual image path
    }}
  >
  <div className="fixed top-0 w-full h-[60px] z-10 bg-white backdrop-blur-md shadow-md flex items-center justify-between px-8">
    <div className="flex justify-center items-center">
      <img src="/truck.jpg" alt="logo" className="w-[70px]"/>
  <h3 style={{transform:"translateY(5px)"}} className="text-xl italic font-bold text-gray-800 tracking-wide leading-1 ">AR Transport</h3>
  </div>
  <Button className="text-sm text-white h-full px-3 bg-blue-500 hover:text-blue-800 transition-all duration-200">
    Terms & Conditions
  </Button>
</div>



    {/* Content */}
    <Card className="login-card backdrop-blur-sm bg-white/30" bordered={false}>
        <Title level={3} style={{ textAlign: "center",fontSize:"16px" }}>
           AR Transport Attendance System
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              {loading ? "logging in" : "Log In"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
  </div>
  );
};

export default Login;
