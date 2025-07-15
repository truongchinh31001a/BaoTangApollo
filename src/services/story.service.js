import { deleteStory, insertStory, queryStories, queryStoryWithTranslation, updateStoryTranslation } from '@/models/story.model.js';

export async function getStoryList(filter = {}) {
  const { artifactId = null, languageCode = 'vi' } = filter;
  return await queryStories({ artifactId, languageCode });
}

export async function getStoryDetail(id, lang) {
    return await queryStoryWithTranslation(id, lang);
}

export async function createStory(data) {
    return await insertStory(data);
}

export async function modifyStoryTranslation(id, lang, data) {
    return await updateStoryTranslation(id, lang, data);
}

export async function removeStory(id) {
    return await deleteStory(id);
}
