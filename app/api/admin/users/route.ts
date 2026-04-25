import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, role: true, status: true, createdAt: true }
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
