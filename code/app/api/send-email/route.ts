import { type NextRequest, NextResponse } from "next/server"

// Using Resend API (you'll need to set RESEND_API_KEY in environment variables)
export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, type } = await request.json()

    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Email would be sent to:", to, "Subject:", subject)
      // For development, just log the email
      return NextResponse.json({
        success: true,
        message: "Email logged (Resend not configured)",
      })
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Component Tracker <noreply@componenttracker.app>",
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
