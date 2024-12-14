import { Doctor } from "@/types/doctor"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type DoctorListProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
};

export function DoctorList({ doctors, onEdit, onDelete }: DoctorListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {doctors.map((doctor) => (
        // <Card key={doctor.id} className="overflow-hidden group cursor-pointer">
        //     <div className="relative aspect-square w-full h-56 p-4  rounded-xl pb-1">
        //       <Image
        //         src={doctor.image}
        //         alt={doctor.name}
        //         layout="fill"
        //         objectFit="cover"
                
        //         className="object-cover object-top rounded-xl  p-4"
        //         // sizes="(max-width: 768px) 100vw, 33vw"
        //         // style={{ width: "100%", height: "auto" }}
        //         priority
        //       />
        //     </div>
        //     <h3 className="font-semibold text-sm mb-1 truncate">
        //       {doctor.name}
        //     </h3>
        //     <Badge className=" text-xs">{doctor.speciality}</Badge>
        //   <CardContent className="flex-grow">
        //     <p className="text-xs text-muted-foreground">
        //       Degree:{"  "}
        //       {doctor.degree}
        //     </p>
        //     <p className="text-xs text-muted-foreground">
        //       Experienced:{"  "} {doctor.experience}{" "}
        //     </p>
        //     <p className="text-xs text-muted-foreground">
        //       Fees:{"  "} ${doctor.fees}
        //     </p>

        //     <p className="mt-2">
        //       <strong>About:</strong>
        //     </p>
        //     <p className="text-sm text-gray-600 truncate">{doctor.about}</p>
        //   </CardContent>
        //   <CardFooter className="flex justify-between">
        //     <Button variant="outline" onClick={() => onEdit(doctor)}>
        //       Edit
        //     </Button>
        //     <Button variant="destructive" onClick={() => onDelete(doctor.id)}>
        //       Delete
        //     </Button>
        //   </CardFooter>
        // </Card>
        <Card key={doctor.id} className="overflow-hidden group cursor-pointer">
           <Link  href={`/${doctor.id}_${doctor.name}`}>

          <div className="relative aspect-square">
            <Image 
              src={doctor.image} 
              alt={doctor.name} 
              className='object-cover'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority
            />
            <div className="absolute inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <div className="text-center flex flex-col items-center justify-center">
              <Badge className="text-xs mb-2 font-semibold truncate">{doctor.name}</Badge>
                <Badge variant="outline" className="text-xs">Fees: ${doctor.fees}</Badge>
              </div>
            </div>
          </div>
          <CardContent className="p-3">
            <div className='flex items-center justify-start gap-2 py-1'>
              <div className='bg-green-600 size-2 rounded-full'/>
              <p className='text-green-600 font-semibold text-sm'>Avialiable</p>
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">{doctor.name}</h3>
            <Badge className="mb-1 text-xs">{doctor.speciality}</Badge>
            <p className="text-xs text-muted-foreground">{doctor.experience} exp.</p>
          </CardContent>
          
           </Link>
           <CardFooter className="flex justify-between">
             <Button variant="outline" onClick={() => onEdit(doctor)}>
               Edit
             </Button>
             <Button variant="destructive" onClick={() => onDelete(doctor.id)}>
               Delete
             </Button>
           </CardFooter>

        </Card>
      ))}
    </div>
  );
}

