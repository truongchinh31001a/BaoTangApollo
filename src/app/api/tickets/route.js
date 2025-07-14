import {
  handleListTickets,
  handleCreateTicket
} from '@/controllers/ticket.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET() {
  return await handleListTickets();
}

export async function POST(req) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  if (!['admin', 'editor'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  
  return await handleCreateTicket(req);
}
