
import { handleDeleteStory, handleGetStory, handleUpdateStory } from '@/controllers/story.controller';
import { requireAuth } from '@/lib/auth.js';

function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// 👇 Bắt buộc có để xử lý preflight từ trình duyệt
export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function GET(req, context) {
  const { id } = context.params;
  const lang = req.nextUrl.searchParams.get('lang') || 'vi';

  const res = await handleGetStory(req, { id, lang });
  return withCors(res);
}

export async function PUT(req, context) {
    const user = await requireAuth();
    if (user instanceof Response) return user;

    if (!['admin', 'editor'].includes(user.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { id } = await context.params;
    const lang = req.nextUrl.searchParams.get('lang') || 'vi';
    return await handleUpdateStory(req, { id, lang });
}

export async function DELETE(req, context) {
    const user = await requireAuth();
    if (user instanceof Response) return user;

    if (user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Only admin can delete' }), { status: 403 });
    }

    const { id } = await context.params;
    return await handleDeleteStory(id);
}
