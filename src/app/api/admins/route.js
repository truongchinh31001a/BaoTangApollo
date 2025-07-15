import { handleCreateAdmin } from '@/controllers/admin.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function POST(req) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  return await handleCreateAdmin(req);
}
