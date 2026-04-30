import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { status, categoryId, title, artist, srcUrl, artworkUrl, bannerUrl } = await req.json();
    const { id } = await params;
    
    const data: any = {};
    if (status) data.status = status;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (title) data.title = title;
    if (artist !== undefined) data.artist = artist;
    if (srcUrl) data.srcUrl = srcUrl;
    if (artworkUrl !== undefined) data.artworkUrl = artworkUrl;
    if (bannerUrl !== undefined) data.bannerUrl = bannerUrl;

    const music = await prisma.music.update({
      where: { id },
      data
    });

    return NextResponse.json({ music });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
