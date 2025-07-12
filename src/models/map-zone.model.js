// src/models/map-zone.model.js
import { getDbPool, sql } from '@/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllMapZones() {
  const pool = await getDbPool();
  const result = await pool.request().query('SELECT * FROM MapZones');
  return result.recordset;
}

export async function getMapZoneById(id) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('ZoneId', sql.UniqueIdentifier, id)
    .query('SELECT * FROM MapZones WHERE ZoneId = @ZoneId');
  return result.recordset[0];
}

export async function insertMapZone(data) {
  const pool = await getDbPool();
  const id = uuidv4();
  await pool.request()
    .input('ZoneId', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar, data.Name)
    .input('Floor', sql.Int, data.Floor)
    .input('MapImageUrl', sql.NVarChar, data.MapImageUrl)
    .query('INSERT INTO MapZones (ZoneId, Name, Floor, MapImageUrl) VALUES (@ZoneId, @Name, @Floor, @MapImageUrl)');
  return id;
}

export async function updateMapZone(id, data) {
  const pool = await getDbPool();
  await pool.request()
    .input('ZoneId', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar, data.Name)
    .input('Floor', sql.Int, data.Floor)
    .input('MapImageUrl', sql.NVarChar, data.MapImageUrl)
    .query('UPDATE MapZones SET Name = @Name, Floor = @Floor, MapImageUrl = @MapImageUrl WHERE ZoneId = @ZoneId');
}

export async function deleteMapZone(id) {
  const pool = await getDbPool();
  await pool.request()
    .input('ZoneId', sql.UniqueIdentifier, id)
    .query('DELETE FROM MapZones WHERE ZoneId = @ZoneId');
}
