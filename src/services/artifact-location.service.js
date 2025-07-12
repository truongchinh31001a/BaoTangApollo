import { getAllArtifactLocations, getArtifactLocation, updateArtifactLocationPosition, upsertArtifactLocation, deleteArtifactLocation } from "@/models/artifact-location.model";


export async function listArtifactLocations() {
    return await getAllArtifactLocations();
}

export async function getArtifactLocationbyId(artifactId) {
    return await getArtifactLocation(artifactId);
}

export async function createOrUpdateLocation(data) {
    return await upsertArtifactLocation(data);
}

export async function updateLocationPosition(artifactId, data) {
    return await updateArtifactLocationPosition(artifactId, data);
}

export async function removeArtifactLocation(artifactId) {
    return await deleteArtifactLocation(artifactId);
}
