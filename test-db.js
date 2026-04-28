const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2003',
      port: 3306
    });
    console.log('Connected to MySQL successfully!');

    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS sonicflow;');
    console.log('Database sonicflow is ready.');

    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
