"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Form, Input, Button, Spin } from "antd";
import { toast } from "react-toastify";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setCheckingToken(false);
      return;
    }

    // Gọi API xác minh token
    fetch(`/api/auth/verify-reset?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("❌ Token không hợp lệ hoặc đã hết hạn!");
          setValidToken(false);
        } else {
          setValidToken(true);
        }
      })
      .catch(() => {
        toast.error("❌ Lỗi hệ thống, vui lòng thử lại sau!");
        setValidToken(false);
      })
      .finally(() => setCheckingToken(false));
  }, [token]);

  const onFinish = async (values) => {
    setLoading(true);
    const { newPassword } = values;

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể đổi mật khẩu!");

      toast.success("🎉 Mật khẩu đã được đổi thành công!");
      setTimeout(() => {
        window.location.href = "/auth"; // Chuyển về trang đăng nhập
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spin size="large" />
      </div>
    );
  }

  if (!token) {
    return <p className="text-red-500 text-center">❌ Không tìm thấy token!</p>;
  }

  if (!validToken) {
    return <p className="text-red-500 text-center">❌ Token không hợp lệ hoặc đã hết hạn!</p>;
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu mới!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password placeholder="********" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Đổi Mật Khẩu
      </Button>
    </Form>
  );
}
