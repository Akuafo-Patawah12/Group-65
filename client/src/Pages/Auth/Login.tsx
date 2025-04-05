import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: 'include'  // Include credentials for CORS requests
      });

      const data = await res.json();

      if (res.status===200) {
        message.success("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/protect/admin_dashboard");
      }else if(res.status===201) {
        navigate("/dashboard");
      }else {
        message.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <Card className="login-card" bordered={false}>
        <Title level={3} style={{ textAlign: "center" }}>
          Payroll & Attendance Login
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
