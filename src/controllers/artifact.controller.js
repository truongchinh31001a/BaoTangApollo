import { NextResponse } from 'next/server'
import {
    getArtifactList,
    getArtifactDetail,
    createArtifact,
    removeArtifact,
    modifyArtifactTranslation
} from '@/services/artifact.service.js'

export async function handleListArtifacts() {
    const data = await getArtifactList();
    return NextResponse.json(data);
}

export async function handleGetArtifact(req, { id, lang }) {
    const data = await getArtifactDetail(id, lang);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
}

export async function handleCreateArtifact(req) {
    const body = await req.json();
    const id = await createArtifact(body);
    return NextResponse.json({ id });
}

export async function handleDeleteArtifact(id) {
    await removeArtifact(id);
    return NextResponse.json({ deleted: true });
}

export async function handleUpdateArtifact(req, { id, lang }) {
    const body = await req.json();
    await modifyArtifactTranslation(id, lang, body);
    return NextResponse.json({ updated: true });
}
