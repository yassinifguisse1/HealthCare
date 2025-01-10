import prisma from '@/lib/db'
import { NotificationType, NotificationStatus } from '@prisma/client'
import axios from 'axios'

export async function createNotificationAndSendEmail(
  userId: string,
  appointmentId: string,
  type: NotificationType,
  content: string,
  recipientEmail: string,
  appointmentDetails: any
) {
  // Create notification in the database
  const notification = await prisma.notification.create({
    data: {
      userId,
      appointmentId,
      type,
      status: NotificationStatus.UNREAD,
      content,
    },
  })

  // Send email using the existing send/route.ts
  try {
    const emailResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/send`, {
      to: recipientEmail,
      appointmentDetails: {
        ...appointmentDetails,
        notificationType: type,
      },
    })

    if (emailResponse.status !== 200) {
      console.error('Failed to send notification email')
    }
  } catch (error) {
    console.error('Error sending notification email:', error)
  }

  return notification
}
