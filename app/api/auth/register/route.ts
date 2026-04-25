import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role,
      },
    });

    await setSession(user.id, user.role);
    return NextResponse.json({ message: "Registered successfully", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
