import {
  getAllBoats,
  getBoatsById,
  createBoats,
  updateBoats,
  deleteBoats,
} from "../services/boatsService";
import { Boat } from "@prisma/client";

describe("Boats Service", () => {
  let createdId = "";

  const sampleBoat: Omit<Boat, "id" | "createdAt" | "updatedAt"> = {
    name: "Test Boat",
    type: "Yacht",
    capacity: 10,
    location: "Lake Austin",
    licenseRequired: ["Boating License"],
    captainShareCertificationsRequired: ["CPR Certification"],
    ownerIds: ["owner1"],
    rateWillingToPay: 200,
    preferredCaptains: ["captain1"],
    make: "Bayliner",
    model: "Element E18",
    year: 2021,
    color: "White",
    hin: "HIN12345",
    motorDetails: "150 HP Motor",
    commercialUse: true,
  };

  test("createBoats should create a new boat resource", async () => {
    const result = await createBoats(sampleBoat);
    expect(result.name).toBe(sampleBoat.name);
    expect(result.type).toBe(sampleBoat.type);
    expect(result.capacity).toBe(sampleBoat.capacity);
    expect(result.location).toBe(sampleBoat.location);
    createdId = result.id;
  });

  test("getAllBoats should return an array containing the new boat resource", async () => {
    const result = await getAllBoats();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdId,
          name: sampleBoat.name,
          type: sampleBoat.type,
        }),
      ])
    );
  });

  test("getBoatsById should fetch the created boat resource by ID", async () => {
    const result = await getBoatsById(createdId);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdId);
    expect(result?.name).toBe(sampleBoat.name);
  });

  test("updateBoats should update the boat resource name", async () => {
    const updates = { name: "Updated Boat Name" };
    const result = await updateBoats(createdId, updates);
    expect(result.name).toBe(updates.name);

    const fetchResult = await getBoatsById(createdId);
    expect(fetchResult?.name).toBe(updates.name);
  });

  test("deleteBoats should remove the boat resource", async () => {
    const result = await deleteBoats(createdId);
    expect(result.id).toBe(createdId);

    const fetchResult = await getBoatsById(createdId);
    expect(fetchResult).toBeNull();
  });

  afterAll(async () => {
    const testCompleted = {
      ...sampleBoat,
      name: "Test for Boats completed.",
    };
    await createBoats(testCompleted);
    console.log(`✅ Added "Test for Boats completed." to the database.`);
  });
});
