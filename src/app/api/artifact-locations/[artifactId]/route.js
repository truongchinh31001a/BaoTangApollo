// src/app/api/artifact-locations/[artifactId]/route.js

import {
    handleGetLocation,
    handleUpdateLocationPosition,
    handleDeleteLocation
} from '@/controllers/artifact-location.controller.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(req, context) {
  const { artifactId } = await context.params;
  return await handleGetLocation(req, { artifactId });
}

export async function PUT(req, context) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  if (!['admin', 'editor'].includes(user.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const { artifactId } = await context.params;
  return await handleUpdateLocationPosition(req, { artifactId });
}

export async function DELETE(req, context) {
  const user = await requireAuth();
  if (user instanceof Response) return user;

  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Only admin can delete' }), { status: 403 });
  }

  const { artifactId } = await context.params;
  return await handleDeleteLocation({ artifactId });
}
