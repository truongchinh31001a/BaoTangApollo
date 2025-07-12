import { addScanLog, getScanLogList, getScanLogsByTicketId } from '@/services/scan-log.service.js';
import { NextResponse } from 'next/server';

export async function handleCreateScanLog(req) {
    const body = await req.json();

    const required = ['ArtifactId', 'TicketId', 'LanguageCode'];
    for (const key of required) {
        if (!body[key]) {
            return NextResponse.json({ error: `${key} is required` }, { status: 400 });
        }
    }

    await addScanLog(body);
    return NextResponse.json({ success: true });
}

export async function handleListScanLogs() {
    const data = await getScanLogList();
    return NextResponse.json(data);
}

export async function handleGetScanLogsByTicket(req, { ticketId }) {
  const data = await getScanLogsByTicketId(ticketId);
  return NextResponse.json(data);
}