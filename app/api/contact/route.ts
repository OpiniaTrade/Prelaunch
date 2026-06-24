import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { appendToSheet } from "@/app/lib/sheets";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send email notification
    await sendEmail({
      subject: `[Opinia Contact] New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Sent from Opinia prelaunch page</p>
      `,
    });

    // Log to Google Sheet
    await appendToSheet("Contacts", [
      new Date().toISOString(),
      name,
      email,
      message,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
