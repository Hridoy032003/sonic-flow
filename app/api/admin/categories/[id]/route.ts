import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { name, description } = await req.json();
    const { id } = await params;
    
    const data: any = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;

    const category = await prisma.category.update({
      where: { id },
      data
    });

    return NextResponse.json({ category });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
