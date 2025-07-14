import { handleResetPassword } from "@/controllers/admin.controller";

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return new Response(JSON.stringify({ error: 'Thiếu token hoặc mật khẩu mới' }), { status: 400 });
        }

        const result = await handleResetPassword(token, newPassword);

        if (!result.success) {
            return new Response(JSON.stringify({ error: result.error }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "Mật khẩu đã được đặt lại thành công!" }));
    } catch (error) {
        console.error("Reset password failed:", error);
        return new Response(JSON.stringify({ error: "Lỗi máy chủ!" }), { status: 500 });
    }
}