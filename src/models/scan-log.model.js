import { getDbPool, sql } from '@/lib/db.js';

export async function insertScanLog(data) {
  const pool = await getDbPool();
  await pool.request()
    .input('ArtifactId', sql.UniqueIdentifier, data.ArtifactId)
    .input('TicketId', sql.UniqueIdentifier, data.TicketId)
    .input('LanguageCode', sql.NVarChar, data.LanguageCode)
    .query(`
      INSERT INTO ScanLogs (ArtifactId, TicketId, LanguageCode)
      VALUES (@ArtifactId, @TicketId, @LanguageCode)
    `);
}

export async function queryScanLogs() {
  const pool = await getDbPool();
  const result = await pool.request().query(`
    SELECT TOP 100 Id, ArtifactId, TicketId, LanguageCode, ScannedAt
    FROM ScanLogs
    ORDER BY ScannedAt DESC
  `);
  return result.recordset;
}

export async function queryScanLogsByTicket(ticketId) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('TicketId', sql.UniqueIdentifier, ticketId)
    .query(`
      SELECT 
        sl.Id AS ScanLogId,
        sl.ArtifactId,
        at.Name AS ArtifactName,
        sl.LanguageCode,
        sl.ScannedAt
      FROM ScanLogs sl
      LEFT JOIN ArtifactTranslations at 
        ON sl.ArtifactId = at.ArtifactId AND at.LanguageCode = sl.LanguageCode
      WHERE sl.TicketId = @TicketId
      ORDER BY sl.ScannedAt DESC
    `);
  return result.recordset;
}
