import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Doctor } from '@prisma/client'

type DoctorInfoProps = {
  doctor: Doctor
}

export function DoctorInfo({ doctor }: DoctorInfoProps) {
  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
        <CardTitle className="text-2xl font-bold">Dr. {doctor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative mx-auto ">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={500}
            height={500}
            className="  object-cover rounded-lg mx-auto flex-shrink-0"
          />
        </div>
        <div className="space-y-2">
          <Badge className="bg-blue-500 text-white px-4 py-2 rounded-full">{doctor.speciality}</Badge>
          <p className="text-lg font-semibold">
            Fees: <span className=" text-muted-foreground">{"$ "}{doctor.fees}</span>
          </p>
          <p className="text-lg font-semibold">Degree: <span className=" text-muted-foreground">{doctor.degree}</span></p>
          <p className="text-lg font-semibold">Experience: <span className=" text-muted-foreground">{doctor.experience} </span></p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{doctor.about}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p className="text-muted-foreground">{doctor.addressLine1}</p>
          {doctor.addressLine2 && <p className="text-muted-foreground">{doctor.addressLine2}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

