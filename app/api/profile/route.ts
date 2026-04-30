import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        music: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const downloads = await prisma.download.findMany({
      where: { userId: session.user.id },
      include: {
        music: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const userWithData = {
      ...user,
      favorites,
      history,
      downloads
    };

    return NextResponse.json({ user: userWithData });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
