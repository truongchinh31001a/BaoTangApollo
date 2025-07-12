import { deleteMapZone, getAllMapZones, getMapZoneById, insertMapZone, updateMapZone } from "@/models/map-zone.model";


export async function getMapZoneList() {
    return await getAllMapZones();
}

export async function getMapZoneDetail(id) {
    return await getMapZoneById(id);
}

export async function createMapZone(data) {
    return await insertMapZone(data);
}

export async function modifyMapZone(id, data) {
    await updateMapZone(id, data);
}

export async function removeMapZone(id) {
    await deleteMapZone(id);
}