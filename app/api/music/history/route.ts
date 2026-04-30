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

    // Add to history (always create new entry, we show latest)
    await prisma.history.create({
      data: {
        userId: session.user.id,
        musicId
      }
    });

    return NextResponse.json({ message: "Added to history" });
  } catch (error) {
    console.error("History POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
