// import { getDoctorById } from '@/lib/api'
import { getDoctorById } from '@/lib/api'
import { AppointmentForm } from '../../_components/AppointmentForm'

export default async function AppointmentPage({ params }: { params: { doctorId: string } }) {
  const doctor = await getDoctorById(params.doctorId)

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment with {doctor.name}</h1>
      <AppointmentForm doctor={doctor} />
    </div>
  )
}

