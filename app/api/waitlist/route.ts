import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { appendToSheet } from "@/app/lib/sheets";

export async function POST(request: Request) {
  try {
    const { name, email, rating, suggestion } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Send email notification
    await sendEmail({
      subject: `[Opinia Waitlist] ${name} joined the waitlist`,
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${rating ? `<p><strong>Excitement Rating:</strong> ${"⭐".repeat(rating)} (${rating}/5)</p>` : ""}
        ${suggestion ? `<p><strong>Suggestion:</strong> ${suggestion}</p>` : ""}
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from Opinia prelaunch page</p>
      `,
    });

    // Log to Google Sheet
    await appendToSheet("Waitlist", [
      new Date().toISOString(),
      name,
      email,
      String(rating || ""),
      suggestion || "",
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist form error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
