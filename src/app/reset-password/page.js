// app/reset-password/page.jsx
"use client";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";


export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded p-6 w-96">
        <h1 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
