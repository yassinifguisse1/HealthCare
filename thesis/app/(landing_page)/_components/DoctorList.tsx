"use client"
import React from 'react'
// import { doctors } from '@/assets/assets_frontend/assets'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import { Doctor } from "@prisma/client";
import { DoctorListSkeleton } from './DoctorListSkeleton'
import { formatDistance } from "date-fns";
import { useDoctors } from '@/context/DoctorsContext'





const DoctorList = () => {
  const { doctors, isLoading } = useDoctors();
  console.log("Doctors context:", { doctors, isLoading });


  if (isLoading) {
    return <DoctorListSkeleton />;
  }

  return (
    <section className="py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold py-2 px-2 sm:p-4">
          Top Doctors to Book
        </h2>
        <p className="text-muted-foreground text-center py-2 px-2 sm:p-4">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        <Button className="flex items-center justify-center my-5 mx-auto">
          See More
        </Button>
      </div>
    </section>
  );
}

export default DoctorList
  
// function DoctorCard({doctors }: doctorsPrps){
//     return (
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//       {doctors.slice(0, 9).map((doctor) => (
//        <Link key={doctor.id} href={`/appointments/${doctor.id}`}>
//         <Card  className="overflow-hidden group cursor-pointer">
//           <div className="relative aspect-square">
//             <Image 
//               src={doctor.image} 
//               alt={doctor.name} 
//               className={`object-cover transition-opacity duration-300`}
//             sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//             fill
//             priority
//             />
//             <div className="absolute inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
//               <div className="text-center flex flex-col items-center justify-center">
//               <Badge className="text-xs mb-2 font-semibold truncate">{doctor.name}</Badge>
//                 <Badge variant="outline" className="text-xs">Fees: ${doctor.fees}</Badge>
//               </div>
//             </div>
//           </div>
//           <CardContent className="p-3">
//             <div className='flex items-center justify-start gap-2 py-1'>
//               <div className='bg-green-600 size-2 rounded-full'/>
//               <p className='text-green-600 font-semibold text-sm'>Avialiable</p>
//             </div>
//             <h3 className="font-semibold text-sm mb-1 truncate">{doctor.name}</h3>
//             <Badge className="mb-1 text-xs">{doctor.speciality}</Badge>
//             <p className="text-xs text-muted-foreground">{doctor.experience} exp.</p>
//           </CardContent>
//         </Card>
//         </Link>
//       ))}
//     </div>
//     );
// }
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="overflow-hidden group cursor-pointer relative">
      <Link href={`/appointments/${doctor.id}`}>
        <div className="relative aspect-square">
          <Image
            src={doctor.image || "/empty.svg"}
            alt={doctor.name || "Doctor Image"}
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fill
            priority
          />
          <div className="absolute inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <div className="text-center flex flex-col items-center justify-center">
              <Badge className="text-xs mb-2 font-semibold truncate">
                {doctor.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Fees: ${doctor.fees}
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm mb-1 truncate">{doctor.name}</h3>
          <Badge className="mb-1 text-xs">{doctor.speciality}</Badge>
          <p className="text-xs text-muted-foreground">
            {doctor.experience} exp.
          </p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-center items-center pb-9">
        <Link href={`/appointments/${doctor.id}`}>
          <Button variant="outline" className="w-full">
            Book Appointment
          </Button>
        </Link>

       
      </CardFooter>
    </Card>
  );
}