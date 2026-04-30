import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { musicId } = await req.json();

    if (!musicId) {
      return NextResponse.json({ error: "Music ID is required" }, { status: 400 });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_musicId: {
          userId: session.user.id,
          musicId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id
        }
      });
      return NextResponse.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          musicId
        }
      });
      return NextResponse.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    console.error("Favorite POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
