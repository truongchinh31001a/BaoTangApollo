import { handleLogin } from "@/controllers/admin.controller";

export async function POST(req) {
  return await handleLogin(req);
}
