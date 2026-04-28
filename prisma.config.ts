import dotenv from "dotenv";
dotenv.config();

/** @type {import('prisma').PrismaConfig} */
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
