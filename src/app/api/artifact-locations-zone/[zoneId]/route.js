import { handleGetLocationsByZone } from "@/controllers/artifact-location.controller";

export async function GET(req, context) {
  const { zoneId } = await context.params; // KHÔNG cần await!
  return await handleGetLocationsByZone(req, { zoneId });
}
