import {
    handleListArtifacts,
    handleCreateArtifact
} from '@/controllers/artifact.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req) {
    const lang = req.nextUrl.searchParams.get('lang') || 'vi';
    return await handleListArtifacts(lang);
}

export async function POST(req) {
    const user = await requireAuth();

    if (user instanceof Response) return user; // nếu token sai trả về lỗi

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return await handleCreateArtifact(req);
}
