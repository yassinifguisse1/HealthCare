import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplate } from '@/app/(landing_page)/_components/email-template.tsx';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, appointmentDetails } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [to],
      subject: 'Hello world',
      react: EmailTemplate({ appointmentDetails }),
    });

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
  
      return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
