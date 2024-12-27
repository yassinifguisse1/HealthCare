import { Metadata } from 'next'
import { DoctorsProvider } from '@/context/DoctorsContext'
import axios from 'axios'
import { auth } from '@clerk/nextjs/server'

async function getDoctorById(id: string) {
  const { getToken } = await auth()

  try {
    const token = await getToken({ template: "TOKEN_Healthcare" });

    // Make sure we have a base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await axios.get(`${baseUrl}/api/doctor/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-store',
      },
    })
    
    // Axios throws on 4xx/5xx responses, but let's add an explicit check
    if (response.status !== 200) {
      throw new Error('Failed to fetch doctor')
    }
    
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching doctors:", error.message)
    } else {
      console.error("Error fetching doctor:", error)
    }
    return null
  }
}

export async function generateMetadata({ params }: { params: { doctorId: string } }): Promise<Metadata> {
  try {
    const doctor = await getDoctorById(params.doctorId)
    
    if (!doctor) {
      return {
        title: 'Doctor Not Found',
        description: 'The requested doctor could not be found.',
      }
    }

    return {
      title: `Book an Appointment with Dr. ${doctor.name}`,
      description: `Schedule your appointment with Dr. ${doctor.name}, ${doctor.speciality} specialist.`,
    }
  } catch (error) {
    console.error('Error fetching doctor for metadata:', error)
    return {
      title: 'Book an Appointment',
      description: 'Schedule your appointment with one of our specialists.',
    }
  }
}

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DoctorsProvider>
      {children}
    </DoctorsProvider>
  )
}

