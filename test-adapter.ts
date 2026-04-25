import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '2003',
  database: 'sonicflow',
  port: 3306
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing connection...");
  const users = await prisma.user.findMany();
  console.log("Users found:", users.length);
}

main()
  .catch(console.error)
  .finally(async () => {
    await pool.end();
  });
