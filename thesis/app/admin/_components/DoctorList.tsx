import { Card, CardContent, CardFooter} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Doctor } from "@prisma/client"
import {  formatDistance } from "date-fns"


type DoctorListProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
 
};

export function DoctorList({ doctors, onEdit, onDelete }: DoctorListProps) {

  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {doctors.map((doctor, ind) => (
        <Card
          key={doctor.id + ind}
          className="overflow-hidden group cursor-pointer relative"
        >
          <Link href={`/admin/doctors/${doctor.id}`}>
            <div className="relative aspect-square">
              <Image
                src={doctor.image || "/empty.svg"}
                alt={doctor.name || "Doctor Image"}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              <h3 className="font-semibold text-sm mb-1 truncate">
                {doctor.name}
              </h3>
              <Badge className="mb-1 text-xs">{doctor.speciality}</Badge>
              <p className="text-xs text-muted-foreground">
                {doctor.experience} exp.
              </p>
            </CardContent>
          </Link>
          <CardFooter className="flex justify-between relative pb-9">
            <Button variant="outline" onClick={() => onEdit(doctor)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => onDelete(doctor.id)}>
              Delete
            </Button>
            <div className="absolute bottom-2 right-3 text-xs text-muted-foreground ">
              {/* Use valid Date objects for formatDistance */}
              {/* {formatDistance(new Date(parseInt(doctor.createdAt.toString()) ), now, { addSuffix: true })} */}
              {/* Ctreated: {formatCreatedAt(doctor.createdAt)} */}
              {doctor.createdAt
                ? formatDistance(new Date(doctor.createdAt), new Date(), {
                    addSuffix: true,
                  })
                : "Date unavailable"}{" "}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

