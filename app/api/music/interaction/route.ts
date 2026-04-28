import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let updateData = {};
    if (type === "like") updateData = { likes: { increment: 1 } };
    else if (type === "download") updateData = { downloads: { increment: 1 } };
    else if (type === "share") updateData = { shares: { increment: 1 } };
    else return NextResponse.json({ error: "Invalid interaction type" }, { status: 400 });

    const music = await prisma.music.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ music });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
