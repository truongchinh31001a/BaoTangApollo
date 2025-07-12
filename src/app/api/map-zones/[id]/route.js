import { handleDeleteMapZone, handleGetMapZone, handleUpdateMapZone } from '@/controllers/map-zone.controller';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req, context) {
    const { id } = await context.params;
    const lang = req.nextUrl.searchParams.get('lang') || 'vi';
    return await handleGetMapZone(req, { id, lang });
}

export async function PUT(req, context) {
    const user = requireAuth(req);
    if (user instanceof Response) return user;

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { id } = await context.params;
    const lang = req.nextUrl.searchParams.get('lang') || 'vi';
    return await handleUpdateMapZone(req, { id, lang });
}

export async function DELETE(req, context) {
    const user = requireAuth(req);
    if (user instanceof Response) return user;

    if (user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Only admin can delete' }), { status: 403 });
    }

    const { id } = await context.params;
    return await handleDeleteMapZone(id);
}
