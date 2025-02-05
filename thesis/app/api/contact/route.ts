import { ContactFormEmail } from "@/app/(landing_page)/_components/ContactFormEmail"
import { contactFormSchema } from "@/lib/shema"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = contactFormSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }))
      return NextResponse.json({ errors }, { status: 400 })
    }

    const formData = result.data

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["yassinifguisse100@gmail.com"], // Replace with your email
      subject: "New Contact Form Submission",
      react: ContactFormEmail({ formData }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 })
  }
}