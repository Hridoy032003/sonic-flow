import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;
  const session = await getServerSession(authOptions);

  try {
    const where: any = { status: "PUBLISHED" };
    if (categoryId) where.categoryId = categoryId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
      ];
    }

    const [music, total] = await Promise.all([
      prisma.music.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.music.count({ where })
    ]);

    let userFavorites: string[] = [];
    let userDownloads: string[] = [];
    if (session?.user?.id) {
      const [favorites, downloads] = await Promise.all([
        prisma.favorite.findMany({
          where: { userId: session.user.id },
          select: { musicId: true }
        }),
        prisma.download.findMany({
          where: { userId: session.user.id },
          select: { musicId: true }
        })
      ]);
      userFavorites = favorites.map((f: { musicId: string }) => f.musicId);
      userDownloads = downloads.map((d: { musicId: string }) => d.musicId);
    }

    const musicWithMeta = music.map(m => ({
      ...m,
      isFavorite: userFavorites.includes(m.id),
      isDownloaded: userDownloads.includes(m.id)
    }));

    return NextResponse.json({
      music: musicWithMeta,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Music GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
