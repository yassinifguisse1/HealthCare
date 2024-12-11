import { Doctor } from "@/types/doctor"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type DoctorListProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
};

export function DoctorList({ doctors, onEdit, onDelete }: DoctorListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="flex flex-col">
          <CardHeader>
            <div className="w-full h-48 relative mb-4">
              <Image
                src={doctor.image}
                alt={doctor.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardTitle>{doctor.name}</CardTitle>
            <CardDescription>{doctor.speciality}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p><strong>Degree:</strong> {doctor.degree}</p>
            <p><strong>Experience:</strong> {doctor.experience}</p>
            <p><strong>Fees:</strong> ${doctor.fees}</p>
            <p className="mt-2"><strong>About:</strong></p>
            <p className="text-sm text-gray-600">{doctor.about}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onEdit(doctor)}>Edit</Button>
            <Button variant="destructive" onClick={() => onDelete(doctor._id)}>Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

