import { prisma } from "@/lib/prisma";
import { boats } from "@prisma/client";

export async function getAllBoats() {
  return prisma.boats.findMany();
}

export async function getBoatsById(id: string) {
  return prisma.boats.findUnique({ where: { id } });
}

export async function createBoats(data: Omit<boats, 'id'>) {
  return prisma.boats.create({ data });
}

export async function updateBoats(id: string, data: Partial<boats>) {
  return prisma.boats.update({ where: { id }, data });
}

export async function deleteBoats(id: string) {
  return prisma.boats.delete({ where: { id } });
}
