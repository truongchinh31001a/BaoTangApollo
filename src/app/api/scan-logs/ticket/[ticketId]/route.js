import { handleGetScanLogsByTicket } from '@/controllers/scan-log.controller.js';

export async function GET(req, context) {
    const { ticketId } = await context.params;
    return await handleGetScanLogsByTicket(req, { ticketId});
}