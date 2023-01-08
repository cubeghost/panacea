import { PrismaClient } from '@prisma/client';

const clientOptions = {
  log: ['info', 'query'],
};

let prisma: PrismaClient;
declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(clientOptions);
  prisma.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient(clientOptions);
    global.__db.$connect();
  }
  prisma = global.__db;
}

export { prisma };
