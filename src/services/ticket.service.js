import {
  findTicketById,
  findAllTickets,
  insertTicket,
  deleteTicket,
  updateTicketActivatedAt,
} from '@/models/ticket.model.js';

export async function getTicket(ticketId) {
  return await findTicketById(ticketId);
}

export async function getTicketList() {
  return await findAllTickets();
}

export async function createTicket(langCode) {
  return await insertTicket(langCode);
}

export async function removeTicket(ticketId) {
  return await deleteTicket(ticketId);
}

export async function ensureTicketIsActiveOrThrow(ticketId) {
  const ticket = await findTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');

  const now = new Date();

  if (!ticket.ActivatedAt) {
    await updateTicketActivatedAt(ticketId);
  } else {
    const activatedTime = new Date(ticket.ActivatedAt);
    const diffHours = (now - activatedTime) / (1000 * 60 * 60);
    if (diffHours > 8) throw new Error('Ticket expired');
  }

  return ticket;
}