import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: 1, askSubscription: true, defaultTheme: "light" },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { askSubscription, defaultTheme } = body;

    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: {
        ...(askSubscription !== undefined && { askSubscription }),
        ...(defaultTheme !== undefined && { defaultTheme }),
      },
      create: {
        id: 1,
        askSubscription: askSubscription ?? true,
        defaultTheme: defaultTheme ?? "light",
      },
    });

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
