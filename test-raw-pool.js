const mariadb = require('mariadb');

async function test() {
  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '2003',
    database: 'sonicflow'
  });
  
  try {
    const conn = await pool.getConnection();
    console.log("Pool connection successful!");
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows);
    conn.release();
  } catch (err) {
    console.log("Error:", err);
  } finally {
    await pool.end();
  }
}

test();
