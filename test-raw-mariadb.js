const mariadb = require('mariadb');

async function test() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2003',
      database: 'sonicflow'
    });
    console.log("Connected!");
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows);
  } catch (err) {
    console.log("Error:", err);
  } finally {
    if (conn) await conn.end();
  }
}

test();
