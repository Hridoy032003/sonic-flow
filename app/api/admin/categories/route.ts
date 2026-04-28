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

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.category.count();

    return NextResponse.json({ categories, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
