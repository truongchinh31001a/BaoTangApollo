// src/models/artifact-location.model.js
import { getDbPool, sql } from '@/lib/db.js';

// Lấy toàn bộ vị trí hiện vật kèm tên zone
export async function getAllArtifactLocations() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT al.ArtifactId, al.ZoneId, z.Name AS ZoneName, al.PosX, al.PosY
    FROM ArtifactLocations al
    JOIN MapZones z ON al.ZoneId = z.ZoneId
  `);
    return result.recordset;
}

// Lấy vị trí theo ArtifactId
export async function getArtifactLocation(artifactId, lang = 'vi') {
    const pool = await getDbPool();
    const result = await pool.request()
        .input('ArtifactId', sql.UniqueIdentifier, artifactId)
        .input('Lang', sql.NVarChar, lang)
        .query(`
            SELECT 
                al.ArtifactId,
                al.ZoneId,
                al.PosX,
                al.PosY,
                at.Name AS ArtifactName,
                z.Name AS ZoneName,
                z.MapImageUrl
            FROM ArtifactLocations al
            JOIN Artifacts a ON al.ArtifactId = a.ArtifactId
            LEFT JOIN ArtifactTranslations at 
                ON at.ArtifactId = a.ArtifactId AND at.LanguageCode = @Lang
            LEFT JOIN MapZones z ON al.ZoneId = z.ZoneId
            WHERE al.ArtifactId = @ArtifactId
        `);
    
    return result.recordset[0];
}

// Thêm hoặc cập nhật vị trí (dựa vào ArtifactId)
export async function upsertArtifactLocation({ artifactId, zoneId, posX, posY }) {
    const pool = await getDbPool();

    const existing = await getArtifactLocation(artifactId);

    if (existing) {
        await pool.request()
            .input('ArtifactId', sql.UniqueIdentifier, artifactId)
            .input('ZoneId', sql.UniqueIdentifier, zoneId)
            .input('PosX', sql.Float, posX)
            .input('PosY', sql.Float, posY)
            .query(`
        UPDATE ArtifactLocations
        SET ZoneId = @ZoneId, PosX = @PosX, PosY = @PosY
        WHERE ArtifactId = @ArtifactId
      `);
    } else {
        await pool.request()
            .input('ArtifactId', sql.UniqueIdentifier, artifactId)
            .input('ZoneId', sql.UniqueIdentifier, zoneId)
            .input('PosX', sql.Float, posX)
            .input('PosY', sql.Float, posY)
            .query(`
        INSERT INTO ArtifactLocations (ArtifactId, ZoneId, PosX, PosY)
        VALUES (@ArtifactId, @ZoneId, @PosX, @PosY)
      `);
    }
}

// Chỉ cập nhật PosX, PosY
export async function updateArtifactLocationPosition(artifactId, { posX, posY }) {
    const pool = await getDbPool();
    await pool.request()
        .input('ArtifactId', sql.UniqueIdentifier, artifactId)
        .input('PosX', sql.Float, posX)
        .input('PosY', sql.Float, posY)
        .query(`
      UPDATE ArtifactLocations
      SET PosX = @PosX, PosY = @PosY
      WHERE ArtifactId = @ArtifactId
    `);
}

// Xoá vị trí theo ArtifactId
export async function deleteArtifactLocation(artifactId) {
    const pool = await getDbPool();
    await pool.request()
        .input('ArtifactId', sql.UniqueIdentifier, artifactId)
        .query(`DELETE FROM ArtifactLocations WHERE ArtifactId = @ArtifactId`);
}

export async function getArtifactsByZoneId(zoneId, lang) {
    const pool = await getDbPool();
    const result = await pool.request()
        .input('ZoneId', sql.UniqueIdentifier, zoneId)
        .input('Lang', sql.NVarChar, lang)
        .query(`
            SELECT
                a.ArtifactId,
                a.ImageUrl,
                at.Name,
                at.Description,
                al.PosX,
                al.PosY,
                z.MapImageUrl AS ZoneImageUrl,     
                z.Name AS ZoneName
            FROM ArtifactLocations al
            JOIN Artifacts a ON al.ArtifactId = a.ArtifactId
            JOIN ArtifactTranslations at ON at.ArtifactId = a.ArtifactId AND at.LanguageCode = @Lang
            JOIN MapZones z ON al.ZoneId = z.ZoneId
            WHERE al.ZoneId = @ZoneId
        `);
    return result.recordset;
}
