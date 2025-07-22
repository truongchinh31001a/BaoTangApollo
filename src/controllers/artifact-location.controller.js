// src/controllers/artifact-location.controller.js

import { NextResponse } from 'next/server';
import {
    listArtifactLocations,
    createOrUpdateLocation,
    updateLocationPosition,
    removeArtifactLocation,
    getArtifactLocationbyId,
    getArtifactLocationByZone
} from '@/services/artifact-location.service.js';

// Lấy danh sách tất cả vị trí hiện vật
export async function handleListLocations() {
    const data = await listArtifactLocations();
    return NextResponse.json(data);
}

// Lấy chi tiết vị trí theo ArtifactId
export async function handleGetLocation(req, { artifactId }) {
    const data = await getArtifactLocationbyId(artifactId);
    if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(data);
}

// Tạo hoặc cập nhật vị trí đầy đủ
export async function handleSaveLocation(req) {
    const body = await req.json();

    if (!body.artifactId || !body.zoneId || typeof body.posX !== 'number' || typeof body.posY !== 'number') {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await createOrUpdateLocation(body);
    return NextResponse.json({ success: true });
}

// Cập nhật riêng toạ độ PosX và PosY
export async function handleUpdateLocationPosition(req, { artifactId }) {
    const body = await req.json();

    if (typeof body.posX !== 'number' || typeof body.posY !== 'number') {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    await updateLocationPosition(artifactId, body);
    return NextResponse.json({ updated: true });
}

// Xoá vị trí hiện vật
export async function handleDeleteLocation({ artifactId }) {
    await removeArtifactLocation(artifactId);
    return NextResponse.json({ deleted: true });
}

export async function handleGetLocationsByZone(req, { zoneId }) {
    const lang = req.nextUrl.searchParams.get('lang') || 'vi';
    const data = await getArtifactLocationByZone(zoneId, lang);

    if (!data || data.length === 0) {
        return NextResponse.json({ error: 'No artifacts found in this zone' }, { status: 404 });
    }

    return NextResponse.json(data);
}