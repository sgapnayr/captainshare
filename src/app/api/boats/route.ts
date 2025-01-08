import { NextResponse } from "next/server";
import {
  getAllBoats,
  getBoatsById,
  createBoats,
  updateBoats,
  deleteBoats,
} from "../../../modules/boats/services/boatsService";

export async function GET(request: Request) {
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
  const body = await request.json();
  const data = await createBoats(body);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const data = await deleteBoats(id);
  return NextResponse.json(data);
}
