import {
  handleListStories,
  handleCreateStory
} from '@/controllers/story.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req) {
  return await handleListStories(req);
}

export async function POST(req) {
  const user = requireAuth(req);
  if (user instanceof Response) return user;

  // Optional: chỉ admin/editor được tạo
  if (!['admin', 'editor'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  return await handleCreateStory(req);
}
