import { NextResponse } from 'next/server';
import {
    getMapZoneList,
    getMapZoneDetail,
    createMapZone,
    modifyMapZone,
    removeMapZone
} from '@/services/map-zone.service.js';

export async function handleListMapZones() {
    const data = await getMapZoneList();
    return NextResponse.json(data);
}

export async function handleGetMapZone(req, { id }) {
    const data = await getMapZoneDetail(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
}

export async function handleCreateMapZone(req) {
    const body = await req.json();
    const id = await createMapZone(body);
    return NextResponse.json({ id });
}

export async function handleUpdateMapZone(req, { id }) {
    const body = await req.json();
    await modifyMapZone(id, body);
    return NextResponse.json({ updated: true });
}

export async function handleDeleteMapZone(id) {
    await removeMapZone(id);
    return NextResponse.json({ deleted: true });
}
