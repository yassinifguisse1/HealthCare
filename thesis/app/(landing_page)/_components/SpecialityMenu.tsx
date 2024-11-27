"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import Dermatologist from '@/assets/assets_frontend/Dermatologist.svg?url'
import Gastroenterologist from '@/assets/assets_frontend/Gastroenterologist.svg?url'
import General_physician from '@/assets/assets_frontend/General_physician.svg?url'
import Gynecologist from '@/assets/assets_frontend/Gynecologist.svg?url'
import Neurologist from '@/assets/assets_frontend/Neurologist.svg?url'
import Pediatricians from '@/assets/assets_frontend/Pediatricians.svg?url'
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const specialityData = [
    {src: Dermatologist , speciality:'Dermatologist'},
    {src: Gastroenterologist , speciality:'Gastroenterologist'},
    {src: General_physician , speciality:'General physician'},
    {src: Gynecologist , speciality:'Gynecologist'},
    {src: Neurologist , speciality:'Neurologist'},
    {src: Pediatricians , speciality:'Pediatricians'},
    
]

const SpecialityMenu = () => {
  return (
    <section className=' py-[72px]'>
        <div className='containe mx-auto flex flex-col justify-center items-center gap-4 '>
            <h2 className='text-center text-3xl font-bold py-2 px-2'>Find by Speciality</h2>
            <p className=' text-muted-foreground text-center py-2 px-2'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-3  sm:gap-4 py-2 px-2">
                    {
                        specialityData.map((item, ind) => (
                            <CardSpeciality item={item} key={ind} />
                        ))
                    }
                </div>
        </div>
    </section>
  
  )
}

export default SpecialityMenu

interface CardSpecialityProp {
    item: {
        src: string;  // Assuming src is a string, adjust if necessary
        speciality: string;
    }
}

function CardSpeciality(
    {item}:CardSpecialityProp
) {
  return (
    <Link href={"/"} className="">
      <Card className="flex  flex-col justify-center items-center  max-w-[250px] mx-auto transition-transform duration-200 hover:scale-105">
                <CardHeader className="flex justify-center items-center">
                    <Image 
                        src={item.src} 
                        alt={item.speciality} 
                        className="h-20 w-20 sm:h-22 sm:w-22 object-contain" // Adjusted size for smaller screens
                    />
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-[14px] sm:text-[16px] text-muted-foreground font-medium text-center">
                        {item.speciality}
                    </p>
                </CardContent>
            </Card>
    </Link>
  );
}
