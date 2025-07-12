import { getDbPool, sql } from '@/lib/db.js'
import { v4 as uuidv4 } from 'uuid';

// Trả về hiện vật theo ID và lang
export async function queryArtifactWithTranslation(id, lang) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, id)
    .input('LanguageCode', sql.NVarChar, lang)
    .query(`
      SELECT a.ArtifactId, t.Name, t.Description, a.ImageUrl, a.VideoUrl, t.AudioUrl
      FROM Artifacts a
      JOIN ArtifactTranslations t ON a.ArtifactId = t.ArtifactId
      WHERE a.ArtifactId = @ArtifactId AND t.LanguageCode = @LanguageCode
    `);
  return result.recordset[0];
}

// Danh sách toàn bộ hiện vật
export async function queryAllArtifacts() {
  const pool = await getDbPool();
  const result = await pool.request().query(`
    SELECT a.ArtifactId, a.ImageUrl, a.VideoUrl, MAX(t.Name) AS Name
    FROM Artifacts a
    LEFT JOIN ArtifactTranslations t ON a.ArtifactId = t.ArtifactId
    GROUP BY a.ArtifactId, a.ImageUrl, a.VideoUrl
  `);
  return result.recordset;
}

// Thêm mới hiện vật và bản dịch đầu tiên
export async function insertArtifact(data) {
  const pool = await getDbPool();
  const artifactId = uuidv4();

  // Insert vào bảng Artifacts
  await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, artifactId)
    .input('ImageUrl', sql.NVarChar, data.ImageUrl)
    .input('VideoUrl', sql.NVarChar, data.VideoUrl)
    .query(`
      INSERT INTO Artifacts (ArtifactId, ImageUrl, VideoUrl)
      VALUES (@ArtifactId, @ImageUrl, @VideoUrl)
    `);

  // Insert tất cả bản dịch
  for (const t of data.Translations) {
    await pool.request()
      .input('ArtifactId', sql.UniqueIdentifier, artifactId)
      .input('LanguageCode', sql.NVarChar, t.LanguageCode)
      .input('Name', sql.NVarChar, t.Name)
      .input('Description', sql.NVarChar, t.Description)
      .input('AudioUrl', sql.NVarChar, t.AudioUrl)
      .query(`
        INSERT INTO ArtifactTranslations (ArtifactId, LanguageCode, Name, Description, AudioUrl)
        VALUES (@ArtifactId, @LanguageCode, @Name, @Description, @AudioUrl)
      `);
  }

  return artifactId;
}


// Xoá hiện vật
export async function deleteArtifact(id) {
  const pool = await getDbPool();

  await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, id)
    .query(`
      DELETE FROM ScanLogs WHERE ArtifactId = @ArtifactId;
      DELETE FROM ArtifactTranslations WHERE ArtifactId = @ArtifactId;
      DELETE FROM ArtifactLocations WHERE ArtifactId = @ArtifactId;
      DELETE FROM Stories WHERE ArtifactId = @ArtifactId;
      DELETE FROM Artifacts WHERE ArtifactId = @ArtifactId;
    `);
}

// Cập nhật bản dịch
export async function updateArtifactTranslation(id, lang, data) {
  const pool = await getDbPool();
  await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, id)
    .input('LanguageCode', sql.NVarChar, lang)
    .input('Name', sql.NVarChar, data.Name)
    .input('Description', sql.NVarChar, data.Description)
    .input('AudioUrl', sql.NVarChar, data.AudioUrl)
    .query(`
      UPDATE ArtifactTranslations
      SET Name = @Name, Description = @Description, AudioUrl = @AudioUrl
      WHERE ArtifactId = @ArtifactId AND LanguageCode = @LanguageCode;
    `);
}
