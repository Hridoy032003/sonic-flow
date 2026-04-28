import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalUsers,
      totalMusic,
      totalCategories,
      publishedMusic,
      activeUsers,
      newUsersLast7Days,
      newMusicLast7Days,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.music.count(),
      prisma.category.count(),
      prisma.music.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.music.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Get latest music entries
    const latestMusic = await prisma.music.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    // Get latest users
    const latestUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalMusic,
        totalCategories,
        publishedMusic,
        activeUsers,
        newUsersLast7Days,
        newMusicLast7Days,
      },
      latestMusic,
      latestUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
