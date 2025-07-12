import { handleActivateTicket } from "@/controllers/ticket.controller.js";

export async function POST(req) {
  return await handleActivateTicket(req);
}