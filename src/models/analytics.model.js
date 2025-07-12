import { getDbPool, sql } from '@/lib/db.js';

// Tổng số lượt quét
export async function countTotalScans() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT COUNT(*) AS total FROM ScanLogs
  `);
    return result.recordset[0].total;
}

// Số lượt quét theo từng ngày
export async function countScansPerDay() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT CAST(ScannedAt AS DATE) AS date, COUNT(*) AS count
    FROM ScanLogs
    GROUP BY CAST(ScannedAt AS DATE)
    ORDER BY date DESC
  `);
    return result.recordset;
}

// Hiện vật được quét nhiều nhất
export async function countPopularArtifacts() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT 
      s.ArtifactId,
      MAX(t.Name) AS Name,
      COUNT(*) AS total
    FROM ScanLogs s
    LEFT JOIN ArtifactTranslations t ON s.ArtifactId = t.ArtifactId
    GROUP BY s.ArtifactId
    ORDER BY total DESC
  `);
    return result.recordset;
}

// Số lượt quét theo ngôn ngữ
export async function countScansByLanguage() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT LanguageCode, COUNT(*) AS total
    FROM ScanLogs
    GROUP BY LanguageCode
  `);
    return result.recordset;
}

export async function getScansByDate() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT 
      CAST(ScannedAt AS DATE) AS Date, 
      COUNT(*) AS Count
    FROM ScanLogs
    GROUP BY CAST(ScannedAt AS DATE)
    ORDER BY Date DESC
  `);
    return result.recordset;
}

export async function getMostScannedArtifacts(limit = 5) {
    const pool = await getDbPool();
    const result = await pool.request()
        .input('TopN', sql.Int, limit)
        .query(`
      SELECT TOP (@TopN) s.ArtifactId, COUNT(*) AS ScanCount, MAX(t.Name) AS Name
      FROM ScanLogs s
      JOIN ArtifactTranslations t ON s.ArtifactId = t.ArtifactId
      WHERE t.LanguageCode = 'vi'
      GROUP BY s.ArtifactId
      ORDER BY ScanCount DESC
    `);
    return result.recordset;
}

export async function getLanguageUsageStats() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT LanguageCode, COUNT(*) AS Count
    FROM ScanLogs
    GROUP BY LanguageCode
    ORDER BY Count DESC
  `);
    return result.recordset;
}

export async function getHourlyScanDistribution() {
    const pool = await getDbPool();
    const result = await pool.request().query(`
    SELECT 
      DATEPART(HOUR, ScannedAt) AS Hour,
      COUNT(*) AS Count
    FROM ScanLogs
    GROUP BY DATEPART(HOUR, ScannedAt)
    ORDER BY Hour
  `);
    return result.recordset;
}