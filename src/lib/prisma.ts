// /lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Make TypeScript happy about globalThis
declare global {
  var prisma: PrismaClient | undefined;
}

// Make a SINGLE PrismaClient instance, or re-use existing
export const prisma =
  globalThis.prisma ??
  (() => {
    return new PrismaClient();
  })();

globalThis.prisma = prisma;
