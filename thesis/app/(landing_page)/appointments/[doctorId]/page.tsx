'use client'

import { useEffect, useState } from 'react'
import { DoctorInfo } from '../../_components/DoctorInfo'
import { AppointmentForm } from '../../_components/AppointmentForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Doctor } from '@prisma/client'
import { useDoctors } from '@/context/DoctorsContext'
import { useParams } from 'next/navigation'

export default  function AppointmentPage() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {getDoctorById} = useDoctors()

  useEffect(() => {
    async function fetchDoctor() {
      if (!doctorId) {
        setError('Doctor ID is missing')
        setIsLoading(false)
        return
      }

      try {
        const fetchedDoctor = await getDoctorById(doctorId as string)
        if (fetchedDoctor) {
          setDoctor(fetchedDoctor)
        } else {
          setError('Doctor not found')
        }
      } catch (err) {
        console.error("Error fetching doctor:", err)
        setError('Failed to fetch doctor information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctor()
  }, [getDoctorById, doctorId])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error || !doctor) {
    return <ErrorMessage message={error || 'Doctor not found'} />
  }

  return (
    <div className="container mx-auto px-4 py-36">
      <h1 className="text-3xl font-bold mb-6 text-center">Book an Appointment with Dr. {doctor.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DoctorInfo doctor={doctor} />
        <AppointmentForm doctor={doctor} doctorId={doctorId as string}/>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-36">
      <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-[600px]" />
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-36 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p>{message}</p>
    </div>
  )
}

