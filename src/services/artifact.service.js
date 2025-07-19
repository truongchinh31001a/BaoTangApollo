import {
  queryArtifactWithTranslation,
  queryAllArtifacts,
  insertArtifact,
  deleteArtifact,
  updateArtifactTranslation,
  updateArtifact
} from '@/models/artifact.model.js'

export async function getArtifactList(lang) {
  return await queryAllArtifacts(lang);
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

export async function modifyArtifact(id, data){
  return await updateArtifact(id, data);
} 