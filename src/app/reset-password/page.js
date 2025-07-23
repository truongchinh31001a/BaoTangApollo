// app/reset-password/page.jsx
'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded p-6 w-96">
        <h1 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h1>
        <Suspense fallback={<div>Đang tải...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
