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
