import { prisma } from "./lib/prisma";

async function check() {
  try {
    const fields = Object.keys((prisma as any).music);
    console.log("Music model fields in client:", fields);

    // Check if we can include favorites
    try {
      await prisma.music.findMany({
        include: { favorites: true }
      });
      console.log("SUCCESS: favorites is available in include");
    } catch (e: any) {
      console.log("FAILURE: favorites is NOT available in include");
      console.log("Error:", e.message);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
