import { prisma } from "@/lib/prisma";
import { Boat } from "@prisma/client";

export async function getAllBoats() {
  return prisma.boat.findMany();
}

export async function getBoatsById(id: string) {
  return prisma.boat.findUnique({ where: { id } });
}

export async function createBoats(
  data: Omit<Boat, "id" | "createdAt" | "updatedAt">
) {
  return prisma.boat.create({ data });
}

export async function updateBoats(id: string, data: Partial<Boat>) {
  return prisma.boat.update({ where: { id }, data });
}

export async function deleteBoats(id: string) {
  return prisma.boat.delete({ where: { id } });
}
