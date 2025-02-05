

'use client'

import { useEffect, useState } from 'react'
import { DoctorInfo } from '@/app/(landing_page)/_components/DoctorInfo'
import { Doctor } from '@prisma/client'
import { useDoctors } from '@/context/DoctorsContext'
import { useParams } from 'next/navigation'
import { LoadingSkeleton } from '../../_components/LoadingSkeleton'
import { ErrorMessage } from '../../_components/ErrorMessage'

export default  function SingleDoctor() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {getDoctorById} = useDoctors()

  useEffect(() => {
    async function fetchDoctor() {
      if (!id) {
        setError('Doctor ID is missing')
        setIsLoading(false)
        return
      }

      try {
        const fetchedDoctor = await getDoctorById(id as string)
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
  }, [getDoctorById, id])

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !doctor) {
    return <ErrorMessage message={error || 'Doctor not found'} />
  }

  return (
    <div className="container mx-auto px-4 py-36">
      <h1 className="text-3xl font-bold mb-6 text-center"> Dr. {doctor.name}</h1>
      <div className="flex justify-center items-center mx-auto container max-w-3xl ">
        <DoctorInfo doctor={doctor} />
      </div>
    </div>
  )
}




