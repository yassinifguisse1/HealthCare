import type React from "react"
import type { ContactFormData } from "@/lib/shema"

interface ContactFormEmailProps {
  formData: ContactFormData
}

export const ContactFormEmail: React.FC<ContactFormEmailProps> = ({ formData }) => {
  const { firstName, lastName, email, phone, message } = formData
  return (
    <div>
      <h1>New Contact Form Submission</h1>
      <p>
        Name: {firstName} {lastName}
      </p>
      <p>Email: {email}</p>
      <p>Phone: {phone || "Not provided"}</p>
      <p>Message: {message}</p>
    </div>
  )
}

