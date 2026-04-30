import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();
    const session = await getServerSession(authOptions);

    if (!id || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!session?.user?.id && (type === "like" || type === "download")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updateData = {};
    if (type === "like") updateData = { likes: { increment: 1 } };
    else if (type === "download") updateData = { downloads: { increment: 1 } };
    else if (type === "share") updateData = { shares: { increment: 1 } };
    else return NextResponse.json({ error: "Invalid interaction type" }, { status: 400 });

    const [music] = await Promise.all([
      prisma.music.update({
        where: { id },
        data: updateData,
      }),
      type === "download" && session?.user?.id ? prisma.download.upsert({
        where: { userId_musicId: { userId: session.user.id, musicId: id } },
        update: {},
        create: { userId: session.user.id, musicId: id }
      }) : Promise.resolve(null)
    ]);

    return NextResponse.json({ music });
  } catch (error: any) {
    console.error("Interaction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
