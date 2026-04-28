import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categories = [
      "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Indie", "Lofi"
    ];

    const categoryDocs = [];
    for (const name of categories) {
      const cat = await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} music` }
      });
      categoryDocs.push(cat);
    }

    // Seed 60+ songs
    for (let i = 1; i <= 65; i++) {
      const randomCat = categoryDocs[Math.floor(Math.random() * categoryDocs.length)];
      await prisma.music.create({
        data: {
          title: `Track ${i} - Amazing Melody`,
          artist: `Artist ${Math.floor(Math.random() * 20) + 1}`,
          srcUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          categoryId: randomCat.id,
          durationMs: Math.floor(Math.random() * 200000) + 100000,
          artworkUrl: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&h=400&auto=format&fit=crop&sig=${i}`,
          status: Math.random() > 0.8 ? "HIDDEN" : "PUBLISHED",
          likes: Math.floor(Math.random() * 500),
          downloads: Math.floor(Math.random() * 200),
          shares: Math.floor(Math.random() * 100)
        }
      });
    }

    // Check for admin user
    const adminUser = await prisma.user.findUnique({ where: { email: "admin@sonicflow.com" } });
    if (!adminUser) {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          email: "admin@sonicflow.com",
          password: hashedPassword,
          role: "ADMIN"
        }
      });
    }

    // Seed some regular users
    for (let i = 1; i <= 10; i++) {
      const userExists = await prisma.user.findUnique({ where: { email: `user${i}@example.com` } });
      if (!userExists) {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.hash("password", 10);
        await prisma.user.create({
          data: {
            email: `user${i}@example.com`,
            password: hashedPassword,
            role: "USER"
          }
        });
      }
    }

    return NextResponse.json({ message: "Database bulk seeded successfully with 60+ songs, categories, and users!" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
