import { PrismaClient } from './generated/prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });
  console.log(JSON.stringify(products, null, 2));
  
  const categories = await prisma.category.findMany();
  console.log('Categories:', JSON.stringify(categories, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
