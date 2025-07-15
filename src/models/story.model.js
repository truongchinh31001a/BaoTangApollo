import { getDbPool, sql } from '@/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

// Trả về danh sách story (optionally theo ArtifactId)
export async function queryStories({ artifactId, languageCode } = {}) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, artifactId || null)
    .input('LanguageCode', sql.NVarChar(10), languageCode || null)
    .query(`
      SELECT 
        s.StoryId, s.IsGlobal, s.ArtifactId, s.ImageUrl, s.CreatedAt,
        st.Title
      FROM Stories s
      LEFT JOIN StoryTranslations st
        ON s.StoryId = st.StoryId AND st.LanguageCode = @LanguageCode
      WHERE (@ArtifactId IS NULL OR s.ArtifactId = @ArtifactId)
    `);
  return result.recordset;
}


// Lấy story cụ thể với bản dịch
export async function queryStoryWithTranslation(id, lang) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('StoryId', sql.UniqueIdentifier, id)
    .input('LanguageCode', sql.NVarChar, lang)
    .query(`
      SELECT s.StoryId, s.IsGlobal, s.ArtifactId, s.ImageUrl, s.CreatedAt,
             t.Title, t.Content, t.AudioUrl
      FROM Stories s
      LEFT JOIN StoryTranslations t ON s.StoryId = t.StoryId AND t.LanguageCode = @LanguageCode
      WHERE s.StoryId = @StoryId
    `);
  return result.recordset[0];
}

// Tạo story và bản dịch đầu tiên
export async function insertStory(data) {
  const pool = await getDbPool();
  const storyId = uuidv4();

  await pool.request()
    .input('StoryId', sql.UniqueIdentifier, storyId)
    .input('IsGlobal', sql.Bit, data.IsGlobal || false)
    .input('ArtifactId', sql.UniqueIdentifier, data.ArtifactId || null)
    .input('ImageUrl', sql.NVarChar, data.ImageUrl || null)
    .query(`
      INSERT INTO Stories (StoryId, IsGlobal, ArtifactId, ImageUrl)
      VALUES (@StoryId, @IsGlobal, @ArtifactId, @ImageUrl)
    `);

  for (const t of data.Translations) {
    await pool.request()
      .input('StoryId', sql.UniqueIdentifier, storyId)
      .input('LanguageCode', sql.NVarChar, t.LanguageCode)
      .input('Title', sql.NVarChar, t.Title)
      .input('Content', sql.NVarChar, t.Content)
      .input('AudioUrl', sql.NVarChar, t.AudioUrl)
      .query(`
        INSERT INTO StoryTranslations (StoryId, LanguageCode, Title, Content, AudioUrl)
        VALUES (@StoryId, @LanguageCode, @Title, @Content, @AudioUrl)
      `);
  }

  return storyId;
}

// Cập nhật translation
export async function updateStoryTranslation(id, lang, data) {
  const pool = await getDbPool();
  await pool.request()
    .input('StoryId', sql.UniqueIdentifier, id)
    .input('LanguageCode', sql.NVarChar, lang)
    .input('Title', sql.NVarChar, data.Title)
    .input('Content', sql.NVarChar, data.Content)
    .input('AudioUrl', sql.NVarChar, data.AudioUrl)
    .query(`
      UPDATE StoryTranslations
      SET Title = @Title, Content = @Content, AudioUrl = @AudioUrl
      WHERE StoryId = @StoryId AND LanguageCode = @LanguageCode
    `);
}

// Xoá story
export async function deleteStory(id) {
  const pool = await getDbPool();
  await pool.request()
    .input('StoryId', sql.UniqueIdentifier, id)
    .query(`
      DELETE FROM StoryTranslations WHERE StoryId = @StoryId;
      DELETE FROM Stories WHERE StoryId = @StoryId;
    `);
}
