import { getDbPool, sql } from '@/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function findTicketById(ticketId) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('TicketId', sql.UniqueIdentifier, ticketId)
    .query(`
      SELECT TicketId, LanguageCode, CreatedAt, ActivatedAt
      FROM Tickets
      WHERE TicketId = @TicketId
    `);
  return result.recordset[0];
}


export async function findAllTickets() {
  const pool = await getDbPool();
  const result = await pool.request().query(`SELECT TicketId, LanguageCode, CreatedAt FROM Tickets`);
  return result.recordset;
}

export async function insertTicket(langCode) {
  const pool = await getDbPool();
  const ticketId = uuidv4();

  await pool.request()
    .input('TicketId', sql.UniqueIdentifier, ticketId)
    .input('LanguageCode', sql.NVarChar, langCode)
    .query(`
      INSERT INTO Tickets (TicketId, LanguageCode)
      VALUES (@TicketId, @LanguageCode)
    `);

  return ticketId;
}

export async function deleteTicket(ticketId) {
  const pool = await getDbPool();
  await pool.request()
    .input('TicketId', sql.UniqueIdentifier, ticketId)
    .query(`DELETE FROM Tickets WHERE TicketId = @TicketId`);
}

export async function updateTicketActivatedAt(ticketId) {
  const pool = await getDbPool();
  await pool.request()
    .input('TicketId', sql.UniqueIdentifier, ticketId)
    .query(`
      UPDATE Tickets
      SET ActivatedAt = GETDATE()
      WHERE TicketId = @TicketId
    `);
}
