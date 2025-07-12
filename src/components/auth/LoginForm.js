"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { GoogleOutlined } from "@ant-design/icons";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  // Xử lý đăng nhập email + password
  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại!");

      toast.success("🎉 Đăng nhập thành công! Đang chuyển hướng...");

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập bằng Google OAuth
  const handleGoogleLogin = () => {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect_uri = "http://localhost:3000/api/auth/callback";
    const scope = "openid email profile";
    const response_type = "code";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&access_type=offline`;

    window.location.href = googleAuthUrl;
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

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Đăng nhập
      </Button>

      <Button
        icon={<GoogleOutlined />}
        className="mt-2 w-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded"
        onClick={handleGoogleLogin}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Đăng nhập bằng Google
      </Button>
    </Form>
  );
}
