import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (user.status === "BANNED") {
      return NextResponse.json({ error: "Your account has been banned" }, { status: 403 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    await setSession(user.id, user.role);
    return NextResponse.json({ message: "Logged in successfully", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: error.message || "Server error", stack: error.stack }, { status: 500 });
  }
}
