import { insertScanLog, queryScanLogs, queryScanLogsByTicket } from '@/models/scan-log.model.js';

export async function addScanLog(data) {
  return await insertScanLog(data);
}

export async function getScanLogList() {
  return await queryScanLogs();
}

export async function getScanLogsByTicketId(ticketId) {
  return await queryScanLogsByTicket(ticketId);
}