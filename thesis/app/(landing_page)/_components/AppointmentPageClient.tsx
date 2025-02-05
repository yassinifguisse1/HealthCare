'use client'

import { useState, useEffect } from 'react'
import { Doctor, Speciality } from '@prisma/client'
import { Skeleton } from '@/components/ui/skeleton'
import DoctorList from './DoctorList'
import { useDoctors } from '@/context/DoctorsContext'
import { AppointmentSidebar } from './AppointmentSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"


const specialties: Speciality[] = [
  "GENERAL_PHYSICIAN",
  "GYNECOLOGIST",
  "DERMATOLOGIST",
  "PEDIATRICIAN",
  "NEUROLOGIST",
  "GASTROENTEROLOGIST"
]
const DOCTORS_PER_PAGE = 8;


export default function AppointmentPageClient() {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState<Speciality | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const {doctors, isLoading , error  } = useDoctors();

  useEffect(() => {
    if (doctors) {
      setFilteredDoctors(doctors);
    }
  }, [doctors]);

  const handleSpecialtyClick = (specialty: Speciality) => {
    setSelectedSpecialty(specialty)
    const filtered = doctors.filter(doctor => doctor.speciality === specialty)
    setFilteredDoctors(filtered)
    setCurrentPage(1)

  }

  const handleClearFilter = () => {
    setSelectedSpecialty(null)
    setFilteredDoctors(doctors)
    setCurrentPage(1)
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * DOCTORS_PER_PAGE,
    currentPage * DOCTORS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE)


  if (isLoading) {
    return <LoadingSkeleton />
  }



  return (
    <SidebarProvider
    style={
      {
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
        "--sidebar-width-icon": "4rem",
      } as React.CSSProperties
    }
  >
    <div className="flex min-h-[calc(100vh-70px-4rem)] pt-[70px] w-full">
      <AppointmentSidebar
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyClick={handleSpecialtyClick}
        onClearFilter={handleClearFilter}
      />
      <SidebarTrigger />
      <SidebarInset className="w-full">
        <header className="p-4 top-[70px]">
          <h1 className="text-2xl font-bold">Available Doctors</h1>
        </header>
        <main className="w-full p-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center text-muted-foreground">
              Failed to load doctors. Please check your internet connection and try again.
            </div>
          ) : (
            <DoctorList
              doctors={paginatedDoctors}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.32)-theme(spacing.16))] pt-[70px]">
      <aside className="w-64 bg-gray-100 p-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-4">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </main>
    </div>
  )
}


