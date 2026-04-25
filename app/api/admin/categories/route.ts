import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, description }
    });

    return NextResponse.json({ category });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
