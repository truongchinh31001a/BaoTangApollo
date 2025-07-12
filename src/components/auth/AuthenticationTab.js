"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import { Tabs } from "antd";
import { LoginForm } from "./LoginForm";
import ForgotPasswordForm from "./ForgotPassword";
import { RegisterForm } from "./RegisterForm";

export default function AuthenticationTab() {
  const [activeTab, setActiveTab] = useState("login");

  const items = [
    {
      key: "login",
      label: "Đăng nhập",
      children: <LoginForm />,
    },
    // {
    //   key: "register",
    //   label: "Đăng ký",
    //   children: <RegisterForm switchToLogin={() => setActiveTab("login")} />, // Truyền hàm chuyển tab vào RegisterForm
    // },
    {
      key: "forget",
      label: "Quên mật khẩu",
      children: <ForgotPasswordForm switchToLogin={() => setActiveTab("login")} />,
    },
  ];

  return (
    <div className="w-96 bg-white p-6 rounded-lg shadow-md">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
}
