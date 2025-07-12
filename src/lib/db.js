import sql from 'mssql';

let pool;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export async function getDbPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
    } catch (err) {
      console.error('❌ MSSQL connection failed:', err);
      throw err;
    }
  }
  return pool;
}

export { sql };
