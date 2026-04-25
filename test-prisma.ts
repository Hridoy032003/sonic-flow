import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing connection without options...");
  const users = await prisma.user.findMany();
  console.log("Users found:", users.length);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
