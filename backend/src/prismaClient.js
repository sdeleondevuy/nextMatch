import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ensure .env is loaded BEFORE importing @prisma/client
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnv({ path: join(__dirname, '../.env') });

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

export { prisma };
