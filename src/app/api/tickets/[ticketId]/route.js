import {
    handleGetTicket,
    handleDeleteTicket
} from '@/controllers/ticket.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req, context) {
    const { ticketId } = await context.params;
    return await handleGetTicket(req, { ticketId });
}

export async function DELETE(req, context) {
    const user = await requireAuth();
    if (user instanceof Response) return user;

    if (user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Only admin can delete' }), { status: 403 });
    }
    
    const { ticketId } = await context.params;
    return await handleDeleteTicket({ ticketId });
}
