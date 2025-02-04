"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Doctor } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctors } from "@/context/DoctorsContext";
import { DoctorListSkeleton } from "@/app/(landing_page)/_components/DoctorListSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


type DoctorListProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function DoctorList({doctors,  onEdit, currentPage, totalPages, onPageChange }: DoctorListProps) {
  const {  deleteDoctor, isLoading } = useDoctors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (doctorToDelete) {
      setIsDeleting(true);
      try {
        await deleteDoctor(doctorToDelete.id);
        toast.success("Doctor deleted successfully! 🎉");
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast.error("Failed to delete doctor. ❌ Please try again.");
      } finally {
        setIsDeleting(false);
        setIsDialogOpen(false);
        setDoctorToDelete(null);
      }
    }
  };

  if (isLoading) {
    return <DoctorListSkeleton />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        
      </div>
      <div className="mt-8">
        {
          totalPages > 1 && (
            <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
          )
        }
      </div>
      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
        doctorName={doctorToDelete?.name || ""}
        isLoading={isDeleting}
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
              <Badge className="text-xs mb-5 font-semibold truncate">
                {doctor.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Fees: ${doctor.fees}
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm mb-2 truncate">{doctor.name}</h3>
          <Badge className="mb-1 text-xs ">{doctor.speciality}</Badge>

          <p className="text-sm font-semibold pt-2">
            Degree:{" "}
            <span className=" text-muted-foreground">{doctor.degree}</span>
          </p>
          <p className="text-sm font-semibold py-1">
            Experience:{" "}
            <span className=" text-muted-foreground">{doctor.experience} </span>
          </p>
          {/* about */}
          <p className="text-sm font-semibold mb-1 ">
            About:
            <span className=" text-muted-foreground line-clamp-1">
              {doctor.about}
            </span>
          </p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between relative pb-9">
        <Button
          className="Edit"
          variant="outline"
          onClick={() => onEdit(doctor)}
          aria-label={`Edit ${doctor.name}`}
        >
          <Edit className="w-6 h-6" />
        </Button>
        <Button
          className="Delete"
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
  