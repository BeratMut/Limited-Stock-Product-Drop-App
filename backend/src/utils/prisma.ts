import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;

// @ts-ignore - Prisma 7 strict constructor workaround
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
} as any);

export default prisma;
