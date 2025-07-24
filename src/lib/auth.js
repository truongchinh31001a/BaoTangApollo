import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

// 👉 Ký token
export function signToken(user) {
    return jwt.sign(
        {
            userId: user.AdminId,
            username: user.Username,
            role: user.Role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// 👉 Xác thực token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error('❌ JWT verification error:', err.message);
        return null;
    }
}

export async function requireAuth(req) {
    let token;

    // ✅ Lấy từ cookie
    try {
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value;
        console.log('🍪 Token from cookie:', token);
    } catch (err) {
        console.error('❌ Error reading cookie:', err.message);
    }

    // ✅ Nếu không có → thử lấy từ header
    if (!token && req?.headers) {
        const authHeader = req.headers.get('authorization');
        console.log('🔍 Authorization header:', authHeader);
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('🎯 Token from header:', token);
        }
    }

    // ✅ Kiểm tra token
    if (!token) {
        return NextResponse.json({ error: 'Token not found in cookie or header' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json({ error: 'Token invalid or expired' }, { status: 401 });
    }

    return payload;
}
