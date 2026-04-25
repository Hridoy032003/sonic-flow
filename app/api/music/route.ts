import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  try {
    const where: any = { status: "PUBLISHED" };
    if (categoryId) where.categoryId = categoryId;
    const music = await prisma.music.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ music });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
