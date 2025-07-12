import { handleAnalyticsOverview } from '@/controllers/analytics.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req) {
    const user = requireAuth(req);
    if (user instanceof Response) return user;

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return await handleAnalyticsOverview();
}