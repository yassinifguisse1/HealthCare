"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Doctor } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Edit, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

type DoctorListProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
};

export function DoctorList({ doctors, onEdit, onDelete }: DoctorListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDialogOpen(true);
  };
  const deleteDoctor = async (doctorId: string) => {
    setIsLoading(true); // Set loading state to true

    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.delete(`/api/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response data:", response.data);
      console.log("Status:", response.status);

      if (response.status === 200) {
        toast.success("Doctor deleted successfully!");

        onDelete(doctorId);
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in and try again.");
        } else if (error.response?.status === 404) {
          toast.error("Doctor not found. It may have been already deleted.");
        } else {
          toast.error("Failed to delete doctor. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const confirmDelete = async () => {
    if (doctorToDelete) {
      await deleteDoctor(doctorToDelete.id); // Call your delete function here
      setIsDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* {doctors.map((doctor, ind) => (
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
                <Edit className="w-6 h-6" />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(doctor)}
              >
                <Trash className="w-6 h-6" />
              </Button>
              <div className="absolute bottom-2 right-3 text-xs text-muted-foreground ">
                {doctor.createdAt
                  ? formatDistance(new Date(doctor.createdAt), new Date(), {
                      addSuffix: true,
                    })
                  : "Date unavailable"}{" "}
              </div>
            </CardFooter>
          </Card>
        ))} */}
        
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        
      </div>
      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
        doctorName={doctorToDelete?.name || ""}
        isLoading={isLoading}
      />
    </div>
  );
}
function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden group cursor-pointer relative">
      <Link href={`/admin/doctors/${doctor.id}`}>
        <div className="relative aspect-square">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={doctor.image || "/empty.svg"}
            alt={doctor.name || "Doctor Image"}
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fill
            priority
            onLoad={() => setImageLoaded(true)}
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
      <CardFooter className="flex justify-between relative pb-9">
        <Button
          variant="outline"
          onClick={() => onEdit(doctor)}
          aria-label={`Edit ${doctor.name}`}
        >
          <Edit className="w-6 h-6" />
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(doctor)}
          aria-label={`Delete ${doctor.name}`}
        >
          <Trash className="w-6 h-6" />
        </Button>
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {doctor.createdAt
            ? formatDistance(new Date(doctor.createdAt), new Date(), {
                addSuffix: true,
              })
            : "Date unavailable"}
        </div>
      </CardFooter>
    </Card>
  );
}
