import { handlePopularArtifacts } from '@/controllers/analytics.controller.js';
export async function GET() {
    return await handlePopularArtifacts();
}
