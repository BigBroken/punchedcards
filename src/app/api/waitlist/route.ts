import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Read existing waitlist
    let emails: string[] = [];
    try {
      const existing = await list({ prefix: "waitlist/" });
      if (existing.blobs.length > 0) {
        const latest = existing.blobs[existing.blobs.length - 1];
        const res = await fetch(latest.url);
        emails = await res.json();
      }
    } catch {
      // First entry — no existing file
    }

    // Check for duplicate
    if (emails.includes(email.toLowerCase())) {
      return NextResponse.json({ message: "Already on the waitlist" });
    }

    // Append and save
    emails.push(email.toLowerCase());
    await put("waitlist/emails.json", JSON.stringify(emails, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      message: "Filed successfully",
      position: emails.length,
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to file your card" },
      { status: 500 },
    );
  }
}
