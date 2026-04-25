import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { status, categoryId } = await req.json();
    const { id } = await params;
    
    const data: any = {};
    if (status) data.status = status;
    if (categoryId !== undefined) data.categoryId = categoryId;

    const music = await prisma.music.update({
      where: { id },
      data
    });

    return NextResponse.json({ music });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
