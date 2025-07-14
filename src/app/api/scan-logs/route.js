import {
  handleCreateScanLog,
  handleListScanLogs
} from '@/controllers/scan-log.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function POST(req) {
  return await handleCreateScanLog(req);
}

export async function GET(req) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  return await handleListScanLogs();
}
