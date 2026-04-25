import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if seeded
    const count = await prisma.category.count();
    if (count > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    const pop = await prisma.category.create({
      data: { name: "Pop", description: "Popular music" }
    });

    const rock = await prisma.category.create({
      data: { name: "Rock", description: "Rock and roll" }
    });

    await prisma.music.create({
      data: {
        title: "Chill Vibes",
        artist: "Lofi Beats",
        srcUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        categoryId: pop.id,
        durationMs: 372000,
        artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&h=400&auto=format&fit=crop"
      }
    });

    await prisma.music.create({
      data: {
        title: "Upbeat Energy",
        artist: "The Rockers",
        srcUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        categoryId: rock.id,
        durationMs: 423000,
        artworkUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4dc?q=80&w=400&h=400&auto=format&fit=crop"
      }
    });

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
