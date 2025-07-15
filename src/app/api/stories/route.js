import {
  handleListStories,
  handleCreateStory
} from '@/controllers/story.controller.js';
import { requireAuth } from '@/lib/auth.js';

function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Có thể chỉ định domain thay vì '*'
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Xử lý preflight request
export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}

export async function GET(req) {
  const res = await handleListStories(req);
  return withCors(res);
}

export async function POST(req) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  // Optional: chỉ admin/editor được tạo
  if (!['admin', 'editor'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  return await handleCreateStory(req);
}
