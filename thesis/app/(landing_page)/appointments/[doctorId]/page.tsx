'use client'

import { useEffect, useState } from 'react'
import { DoctorInfo } from '../../_components/DoctorInfo'
import { AppointmentForm } from '../../_components/AppointmentForm'
import { Doctor } from '@prisma/client'
import { useDoctors } from '@/context/DoctorsContext'
import { redirect, useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { LoadingSkeleton } from '../../_components/LoadingSkeleton'
import { ErrorMessage } from '../../_components/ErrorMessage'

export default  function AppointmentPage() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {getDoctorById} = useDoctors()
    const {  isLoaded, isSignedIn } = useAuth()
  
    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        redirect('/sign-in')
      }
    }, [isLoaded, isSignedIn])
  
  

  useEffect(() => {
    async function fetchDoctor() {
      if (!doctorId) {
        setError("Doctor ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedDoctor = await getDoctorById(doctorId as string);
        if (fetchedDoctor) {
          setDoctor(fetchedDoctor);
        } else {
          setError("Doctor not found");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to fetch doctor information");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctor();
  }, [getDoctorById, doctorId]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !doctor) {
    return <ErrorMessage message={error || "Doctor not found"} />;
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

