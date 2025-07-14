
import { handleCreateMapZone, handleListMapZones } from '@/controllers/map-zone.controller';
import { requireAuth } from '@/lib/auth.js';

export async function GET() {
    return await handleListMapZones();
}

export async function POST(req) {
    const user = await requireAuth();
    if (user instanceof Response) return user; // nếu token sai trả về lỗi

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return await handleCreateMapZone(req);
}
