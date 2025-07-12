// src/app/api/artifact-locations/route.js

import { handleListLocations, handleSaveLocation } from '@/controllers/artifact-location.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET() {
    return await handleListLocations();
}

export async function POST(req) {
    const user = requireAuth(req);
    if (user instanceof Response) return user;

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return await handleSaveLocation(req);
}
