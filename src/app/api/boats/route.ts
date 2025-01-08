/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  getAllBoats,
  getBoatsById,
  createBoats,
  updateBoats,
  deleteBoats,
} from "../../../modules/boats/services/boatsService";

import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "*", // Allow all origins or specify your frontend's origin here
});

// Helper function to run middleware
function runMiddleware(req: Request, middleware: any) {
  return new Promise((resolve, reject) => {
    middleware(req, new Response(), (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// API Handlers
export async function GET(request: Request) {
  await runMiddleware(request, cors); // Apply CORS middleware

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const data = await getBoatsById(id);
    return NextResponse.json(data);
  }

  const data = await getAllBoats();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await runMiddleware(request, cors); // Apply CORS middleware

  const body = await request.json();
  const data = await createBoats(body);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  await runMiddleware(request, cors); // Apply CORS middleware

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await updateBoats(id, body);
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  await runMiddleware(request, cors); // Apply CORS middleware

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await deleteBoats(id);
  return NextResponse.json(data);
}
