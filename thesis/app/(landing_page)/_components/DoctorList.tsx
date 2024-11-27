import React from 'react'
import { doctors } from '@/assets/assets_frontend/assets'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Button} from '@/components/ui/button'


const DoctorList = () => {
  return (
    <section className='py-8 px-4 md:px-8'>
        <div className='container mx-auto'>
            <h2 className='text-center text-3xl font-bold py-2 px-2 sm:p-4'>Top Doctors to Book</h2>
            <p className='text-muted-foreground text-center py-2 px-2 sm:p-4'>Simply browse through our extensive list of trusted doctors.</p>
            <DisplayDoctors/>
            <Button className='flex items-center justify-center my-5 mx-auto' >
              See More
            </Button>

        </div>
        
    </section>
  )
}

export default DoctorList

function DisplayDoctors(){
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {doctors.slice(0, 10).map((doctor) => (
          <Card key={doctor._id} className="overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105">
            <CardHeader className="p-0">
              <div className="relative aspect-square bg-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <CardTitle className="font-semibold text-sm mb-1 truncate">{doctor.name}</CardTitle>
              <Badge className="mb-1 text-xs">{doctor.speciality}</Badge>
              <p className="text-sm text-muted-foreground mb-2 truncate">{doctor.degree} • {doctor.experience} Experience</p>
              <p className="text-xs text-muted-foreground">Fees: ${doctor.fees}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
}