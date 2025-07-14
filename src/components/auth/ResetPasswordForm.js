// components/ResetPasswordForm.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify"; 
import '@ant-design/v5-patch-for-react-19';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ newPassword }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể đặt lại mật khẩu!");

      toast.success("✅ Mật khẩu đã được đặt lại. Hãy đăng nhập lại!");
      setTimeout(() => {
        window.location.href = "/"; // Hoặc chuyển sang tab Login
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
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={["newPassword"]}
        hasFeedback
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading}>
        Đặt lại mật khẩu
      </Button>
    </Form>
  );
}
