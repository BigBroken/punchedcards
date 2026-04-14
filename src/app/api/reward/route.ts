import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let emails: string[] = [];
    try {
      const existing = await list({ prefix: "reward/" });
      if (existing.blobs.length > 0) {
        const latest = existing.blobs[existing.blobs.length - 1];
        const res = await fetch(latest.url);
        emails = await res.json();
      }
    } catch {
      // First entry
    }

    if (emails.includes(email.toLowerCase())) {
      return NextResponse.json({ message: "Already claimed" });
    }

    emails.push(email.toLowerCase());
    await put("reward/emails.json", JSON.stringify(emails, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      message: "Kit claimed",
      position: emails.length,
    });
  } catch (error) {
    console.error("Reward error:", error);
    return NextResponse.json(
      { error: "Failed to file your card" },
      { status: 500 },
    );
  }
}
