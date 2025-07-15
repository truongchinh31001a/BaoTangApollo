import { NextResponse } from 'next/server';
import {
    getStoryList,
    getStoryDetail,
    createStory,
    modifyStoryTranslation,
    removeStory
} from '@/services/story.service.js';

export async function handleListStories(req) {
    const artifactId = req.nextUrl.searchParams.get('artifactId');
    const languageCode = req.nextUrl.searchParams.get('lang') || 'vi'; // default 'vi'

    const stories = await getStoryList({ artifactId, languageCode });
    return NextResponse.json(stories);
}


export async function handleGetStory(req, { id, lang }) {
    const story = await getStoryDetail(id, lang);
    if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(story);
}

export async function handleCreateStory(req) {
    const body = await req.json();
    const id = await createStory(body);
    return NextResponse.json({ id });
}

export async function handleUpdateStory(req, { id, lang }) {
    const body = await req.json();
    await modifyStoryTranslation(id, lang, body);
    return NextResponse.json({ updated: true });
}

export async function handleDeleteStory(id) {
    await removeStory(id);
    return NextResponse.json({ deleted: true });
}
