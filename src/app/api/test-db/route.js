import { getDbPool, sql } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request()
      .query('SELECT TOP 1 * FROM Artifacts');

    return Response.json(result.recordset[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
