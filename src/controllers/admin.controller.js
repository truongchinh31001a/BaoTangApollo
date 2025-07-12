import { signToken } from '@/lib/auth.js';
import { authenticate, createAdmin } from '@/services/admin.service.js';
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
    return NextResponse.json({ token, role: user.Role, username: user.Username });
}

export async function handleCreateAdmin(req) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    await createAdmin({ username, password, role: 'editor' });
    return NextResponse.json({ success: true });
}

