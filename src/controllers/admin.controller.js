import { signToken } from '@/lib/auth.js';
import { authenticate, createAdmin, forgotAdminPassword, resetAdminPassword } from '@/services/admin.service.js';
import { NextResponse } from 'next/server';

export async function handleLogin(req) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await authenticate(username, password);
    if (!user) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken(user);

    const res = NextResponse.json({
        message: 'Đăng nhập thành công',
        role: user.Role,
        username: user.Username
    });

    // ✅ Gắn token vào cookie
    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
        path: '/',
        sameSite: 'lax'
    });

    return res;
}

export async function handleCreateAdmin(req) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    await createAdmin({ username, password, role: 'editor' });
    return NextResponse.json({ success: true });
}

export async function handleForgotPassword(username) {
    if (!username) {
        return null;
    }

    const result = await forgotAdminPassword(username);

    return result;
}

export async function handleResetPassword(token, newPassword) {
    return await resetAdminPassword(token, newPassword);
}