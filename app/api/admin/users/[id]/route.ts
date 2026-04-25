import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { status, role } = await req.json();
    const { id } = await params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { ...(status && { status }), ...(role && { role }) }
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
