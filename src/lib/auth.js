import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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

export function requireAuth(req) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return payload;
}
