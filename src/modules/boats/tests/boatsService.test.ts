import { 
  getAllBoats, 
  getBoatsById, 
  createBoats, 
  updateBoats, 
  deleteBoats 
} from "../services/boatsService";

describe("Boats Service", () => {
  let createdId = "";

  test("createBoats should create a new resource", async () => {
    const input = { name: "Test Boats" };
    const result = await createBoats(input);
    expect(result.name).toBe(input.name);
    createdId = result.id;
  });

  test("getAllBoats should return an array containing the new resource", async () => {
    const result = await getAllBoats();
    expect(result).toEqual(expect.arrayContaining([{ id: createdId, name: "Test Boats" }]));
  });

  test("getBoatsById should fetch the created resource by ID", async () => {
    const result = await getBoatsById(createdId);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdId);
  });

  test("updateBoats should update the resource name", async () => {
    const updates = { name: "Updated Name" };
    const result = await updateBoats(createdId, updates);
    expect(result.name).toBe(updates.name);
  });

  test("deleteBoats should remove the resource", async () => {
    const result = await deleteBoats(createdId);
    expect(result.id).toBe(createdId);

    const fetchResult = await getBoatsById(createdId);
    expect(fetchResult).toBeNull();
  });

  afterAll(async () => {
    // Leave a "Test for [resourceName] completed." record in the database
    const testCompleted = { name: "Test for Boats completed." };
    await createBoats(testCompleted);
    console.log(`✅ Added "Test for Boats completed." to the database.`);
  });
});
