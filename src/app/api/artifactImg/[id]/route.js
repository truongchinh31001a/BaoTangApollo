import {
    handleUpdateArtifactImage
} from '@/controllers/artifact.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function PUT(req, context) {
    const user = await requireAuth();

    if (user instanceof Response) return user;

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { id } = await context.params;
    return await handleUpdateArtifactImage(req, { id });
}