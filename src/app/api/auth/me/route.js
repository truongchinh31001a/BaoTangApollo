import { requireAuth } from '@/lib/auth.js';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const user = await requireAuth();
    if (user instanceof Response) return user;

    return NextResponse.json({
        adminId: user.userId,
        username: user.username,
        role: user.role
    });
}
