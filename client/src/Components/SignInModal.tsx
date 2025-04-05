
import React, { useState } from 'react';
import { Modal, Input, Select, Button, Form, message } from 'antd';

interface SignInModalProps {
  visible: boolean;
  setAttendanceData: (data: any) => void;
  onClose: () => void;
  onSuccess?: () => void;
}

const { Option } = Select;

const SignInModal: React.FC<SignInModalProps> = ({ visible, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { employee_id: string; shift_type: string; status: string }) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/attendance/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      

      if (!res.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      message.success('Attendance signed in successfully!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      message.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Attendance Sign In"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Employee ID"
          name="employee_id"
          rules={[{ required: true, message: 'Please enter employee ID' }]}
        >
          <Input placeholder="Enter employee ID" />
        </Form.Item>

        <Form.Item
          label="Shift Type"
          name="shift_type"
          initialValue="Regular"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="Regular">Regular</Option>
            <Option value="Overtime">Overtime</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="Present"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="Present">Present</Option>
            <Option value="Late">Late</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignInModal;
