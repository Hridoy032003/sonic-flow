import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title, artist, srcUrl, artworkUrl, categoryId, durationMs, status } = await req.json();
    if (!title || !srcUrl) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const music = await prisma.music.create({
      data: { 
        title, 
        artist, 
        srcUrl, 
        artworkUrl, 
        categoryId: categoryId || null,
        durationMs: durationMs ? parseInt(durationMs) : 0,
        status: status || "PUBLISHED"
      }
    });

    return NextResponse.json({ music });
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

    const music = await prisma.music.findMany({
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.music.count();

    return NextResponse.json({ music, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
