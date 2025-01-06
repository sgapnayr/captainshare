import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create a new document in the "Hello" collection
    const hello = await prisma.hello.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(hello);
  } catch (error) {
    console.error("API Error:", error); // Log the error to the console
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
