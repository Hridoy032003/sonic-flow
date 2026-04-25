const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2003',
      database: 'sonicflow',
      port: 3306
    });
    
    const hash = await bcrypt.hash('admin123', 10);
    const id = require('crypto').randomBytes(12).toString('hex');
    
    // Check if admin exists
    const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', ['admin@sonicflow.com']);
    if (rows.length > 0) {
      console.log('Admin already exists.');
      await connection.end();
      return;
    }

    // Insert admin
    const query = `
      INSERT INTO User (id, email, password, role, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW(3))
    `;
    await connection.query(query, [id, 'admin@sonicflow.com', hash, 'ADMIN', 'ACTIVE']);
    console.log('Admin user created successfully!');
    
    await connection.end();
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

createAdmin();
