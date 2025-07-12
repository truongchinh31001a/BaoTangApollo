import { handleScansByDate } from '@/controllers/analytics.controller.js';
export async function GET() {
    return await handleScansByDate();
}
