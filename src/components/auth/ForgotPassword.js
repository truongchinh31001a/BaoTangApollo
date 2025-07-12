"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";

export default function ForgotPasswordForm({ switchToLogin }) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email } = values;

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể gửi yêu cầu!");

      toast.success("📩 Kiểm tra email để đặt lại mật khẩu!");
      setTimeout(() => {
        switchToLogin();
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Gửi Yêu Cầu
      </Button>
    </Form>
  );
}
