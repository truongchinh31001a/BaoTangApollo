import {
  queryArtifactWithTranslation,
  queryAllArtifacts,
  insertArtifact,
  deleteArtifact,
  updateArtifactTranslation
} from '@/models/artifact.model.js'

export async function getArtifactList() {
  return await queryAllArtifacts();
}

export async function getArtifactDetail(id, lang) {
  return await queryArtifactWithTranslation(id, lang);
}

export async function createArtifact(data) {
  return await insertArtifact(data);
}

export async function removeArtifact(id) {
  return await deleteArtifact(id);
}

export async function modifyArtifactTranslation(id, lang, data) {
  return await updateArtifactTranslation(id, lang, data);
}
