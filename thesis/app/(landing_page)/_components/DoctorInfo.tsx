import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Doctor } from '@prisma/client'

type DoctorInfoProps = {
  doctor: Doctor
}

export function DoctorInfo({ doctor }: DoctorInfoProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dr. {doctor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-96">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="  w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Badge>{doctor.speciality}</Badge>
          <p className="text-lg font-semibold">Fees: ${doctor.fees}</p>
          <p>{doctor.degree}</p>
          <p>{doctor.experience} of experience</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p>{doctor.about}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p>{doctor.addressLine1}</p>
          {doctor.addressLine2 && <p>{doctor.addressLine2}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

