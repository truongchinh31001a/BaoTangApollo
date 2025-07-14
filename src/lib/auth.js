import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
    return jwt.sign(
        {
            userId: user.AdminId,
            username: user.Username,   // ✅ thêm username
            role: user.Role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export function requireAuth() {
    const token = cookies().get('token')?.value;

    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return payload;
}