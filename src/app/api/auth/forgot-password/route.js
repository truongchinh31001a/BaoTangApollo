// src/app/api/auth/forgot-password/route.js
import { handleForgotPassword } from "@/controllers/admin.controller";

export async function POST(req) {
  const { username } = await req.json();

  const result = await handleForgotPassword(username);

  if (!result) {
    return new Response(JSON.stringify({ error: 'Username không tồn tại!' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Token reset đã được tạo!', token: result.token }));
}
