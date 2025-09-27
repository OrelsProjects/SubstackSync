import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}
