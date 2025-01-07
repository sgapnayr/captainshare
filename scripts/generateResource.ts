/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const resourceName = process.argv[2];

if (!resourceName) {
  console.error(
    "❌ Please provide a resource name: e.g., 'npm run generate --resource=users'"
  );
  process.exit(1);
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const baseDir = path.join(__dirname, "../src/modules", resourceName);
const appApiDir = path.join(__dirname, "../src/app/api", resourceName);
const prismaSchemaPath = path.join(__dirname, "../prisma/schema.prisma");

const structure = {
  folders: ["services", "components", "dto", "tests"],
  files: {
    [`services/${resourceName}Service.ts`]: `import { prisma } from "@/lib/prisma";
import { ${resourceName} } from "@prisma/client";

export async function getAll${capitalize(resourceName)}() {
  return prisma.${resourceName}.findMany();
}

export async function get${capitalize(resourceName)}ById(id: string) {
  return prisma.${resourceName}.findUnique({ where: { id } });
}

export async function create${capitalize(
      resourceName
    )}(data: Omit<${resourceName}, 'id'>) {
  return prisma.${resourceName}.create({ data });
}

export async function update${capitalize(
      resourceName
    )}(id: string, data: Partial<${resourceName}>) {
  return prisma.${resourceName}.update({ where: { id }, data });
}

export async function delete${capitalize(resourceName)}(id: string) {
  return prisma.${resourceName}.delete({ where: { id } });
}
`,
    [`components/${capitalize(resourceName)}Card.tsx`]: `
"use client";

import React, { useEffect, useState } from "react";
import { ${resourceName} } from "@prisma/client";
import axios from "axios";

export function ${capitalize(resourceName)}Card() {
  const [data, setData] = useState<${resourceName}[]>([]);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/${resourceName}");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create a new resource
  const createData = async () => {
    if (!newName.trim()) return alert("Name is required");
    try {
      const response = await axios.post("/api/${resourceName}", { name: newName });
      setData([...data, response.data]);
      setNewName("");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  // Update a resource
  const updateData = async () => {
    if (!editId || !editName?.trim()) return alert("Name is required");
    try {
      const response = await axios.put(\`/api/${resourceName}?id=\${editId}\`, {
        name: editName,
      });
      setData(
        data.map((item) =>
          item.id === editId ? { ...item, name: response.data.name } : item
        )
      );
      setEditId(null);
      setEditName("");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Delete a resource
  const deleteData = async (id: string) => {
    try {
      await axios.delete(\`/api/${resourceName}?id=\${id}\`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>${capitalize(resourceName)}</h1>

      {/* Create Section */}
      <div>
        <h2>Create ${capitalize(resourceName)}</h2>
        <input
          type="text"
          value={newName ?? ""}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter name"
        />
        <button onClick={createData}>Create</button>
      </div>

      {/* List Section */}
      <div>
        <h2>${capitalize(resourceName)} List</h2>
        {data.map((item) => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            {editId === item.id ? (
              // Edit Mode
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button onClick={updateData}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              // Display Mode
              <div>
                <span>{item.name}</span>
                <button onClick={() => {
                  setEditId(item.id);
                  setEditName(item.name);
                }}>Edit</button>
                <button onClick={() => deleteData(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
`,
    [`dto/create${capitalize(resourceName)}.dto.ts`]: `import { z } from "zod";

export const Create${capitalize(resourceName)}Dto = z.object({
  name: z.string().min(1, "Name is required"),
});
`,
    [`tests/${resourceName}Service.test.ts`]: `import { 
  getAll${capitalize(resourceName)}, 
  get${capitalize(resourceName)}ById, 
  create${capitalize(resourceName)}, 
  update${capitalize(resourceName)}, 
  delete${capitalize(resourceName)} 
} from "../services/${resourceName}Service";

describe("${capitalize(resourceName)} Service", () => {
  let createdId = "";

  test("create${capitalize(
    resourceName
  )} should create a new resource", async () => {
    const input = { name: "Test ${capitalize(resourceName)}" };
    const result = await create${capitalize(resourceName)}(input);
    expect(result.name).toBe(input.name);
    createdId = result.id;
  });

  test("getAll${capitalize(
    resourceName
  )} should return an array containing the new resource", async () => {
    const result = await getAll${capitalize(resourceName)}();
    expect(result).toEqual(expect.arrayContaining([{ id: createdId, name: "Test ${capitalize(
      resourceName
    )}" }]));
  });

  test("get${capitalize(
    resourceName
  )}ById should fetch the created resource by ID", async () => {
    const result = await get${capitalize(resourceName)}ById(createdId);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(createdId);
  });

  test("update${capitalize(
    resourceName
  )} should update the resource name", async () => {
    const updates = { name: "Updated Name" };
    const result = await update${capitalize(resourceName)}(createdId, updates);
    expect(result.name).toBe(updates.name);
  });

  test("delete${capitalize(
    resourceName
  )} should remove the resource", async () => {
    const result = await delete${capitalize(resourceName)}(createdId);
    expect(result.id).toBe(createdId);

    const fetchResult = await get${capitalize(resourceName)}ById(createdId);
    expect(fetchResult).toBeNull();
  });

  afterAll(async () => {
    // Leave a "Test for [resourceName] completed." record in the database
    const testCompleted = { name: "Test for ${capitalize(
      resourceName
    )} completed." };
    await create${capitalize(resourceName)}(testCompleted);
    console.log(\`✅ Added "Test for ${capitalize(
      resourceName
    )} completed." to the database.\`);
  });
});
`,
  },
  apiFile: `import { NextResponse } from "next/server";
import { 
  getAll${capitalize(resourceName)}, 
  get${capitalize(resourceName)}ById, 
  create${capitalize(resourceName)}, 
  update${capitalize(resourceName)}, 
  delete${capitalize(resourceName)} 
} from "../../../modules/${resourceName}/services/${resourceName}Service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const data = await get${capitalize(resourceName)}ById(id);
    return NextResponse.json(data);
  }

  const data = await getAll${capitalize(resourceName)}();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await create${capitalize(resourceName)}(body);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await update${capitalize(resourceName)}(id, body);
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await delete${capitalize(resourceName)}(id);
  return NextResponse.json(data);
}
`,
};

const prismaModel = `model ${resourceName} {
  id    String @id @default(cuid()) @map("_id")
  name  String
}
`;

const createResource = () => {
  try {
    console.log(`🚀 Generating resource: ${resourceName}`);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    if (!fs.existsSync(appApiDir)) {
      fs.mkdirSync(appApiDir, { recursive: true });
    }

    structure.folders.forEach((folder) => {
      const folderPath = path.join(baseDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });

    Object.entries(structure.files).forEach(([filePath, content]) => {
      const fullPath = path.join(baseDir, filePath);
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content, "utf8");
      }
    });

    const apiFilePath = path.join(appApiDir, "route.ts");
    if (!fs.existsSync(apiFilePath)) {
      fs.writeFileSync(apiFilePath, structure.apiFile, "utf8");
    }

    if (fs.existsSync(prismaSchemaPath)) {
      const prismaSchema = fs.readFileSync(prismaSchemaPath, "utf8");
      if (!prismaSchema.includes(`model ${resourceName}`)) {
        fs.appendFileSync(prismaSchemaPath, `\n${prismaModel}\n`);
      }
    } else {
      console.error(`❌ Prisma schema file not found at ${prismaSchemaPath}`);
    }

    console.log(`✅ Resource "${resourceName}" has been successfully created!`);
  } catch (error) {
    console.error("❌ An error occurred while generating the resource:", error);
  }
};

createResource();
