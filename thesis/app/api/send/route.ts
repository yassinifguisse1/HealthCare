import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplate } from '@/app/(landing_page)/_components/email-template.tsx';
import { Resend } from 'resend';
import { NotificationType } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, appointmentDetails } = await request.json();
    const getSubject = (notificationType: NotificationType) => {
      switch (notificationType) {
        case NotificationType.REMINDER:
          return 'Appointment Confirmation';
        case NotificationType.CANCELLATION:
          return 'Appointment Cancellation';
        case NotificationType.UPDATE:
          return 'Appointment Update';
        default:
          return 'Appointment Notification';
      }
    };

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [to],
      subject: getSubject(appointmentDetails.notificationType),
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
