import { updateTicketActivatedAt } from '@/models/ticket.model';
import {
    getTicket,
    getTicketList,
    createTicket,
    removeTicket
} from '@/services/ticket.service.js';
import { NextResponse } from 'next/server';

export async function handleGetTicket(req, { ticketId }) {
    const ticket = await getTicket(ticketId);
    if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(ticket);
}

export async function handleListTickets() {
    const data = await getTicketList();
    return NextResponse.json(data);
}

export async function handleCreateTicket(req) {
    const { languageCode } = await req.json();
    if (!languageCode) {
        return NextResponse.json({ error: 'Missing languageCode' }, { status: 400 });
    }

    const id = await createTicket(languageCode);
    return NextResponse.json({ ticketId: id });
}

export async function handleDeleteTicket({ ticketId }) {
    await removeTicket(ticketId);
    return NextResponse.json({ deleted: true });
}


export async function handleActivateTicket(req) {
  const { TicketId } = await req.json();
  if (!TicketId) return NextResponse.json({ error: 'TicketId is required' }, { status: 400 });

  const ticket = await getTicket(TicketId);
  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

  if (!ticket.ActivatedAt) {
    const lang = await updateTicketActivatedAt(TicketId);
    return NextResponse.json({ activated: true, lang });
  }

  return NextResponse.json({ activated: false, message: 'Already activated', lang: ticket.LanguageCode });
}