"use client"

import {  useState } from "react"
import { DoctorForm } from "@/app/admin/_components/DoctorForm"
import { DoctorList } from "@/app/admin/_components/DoctorList"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DoctorListSkeleton } from "@/app/(landing_page)/_components/DoctorListSkeleton"
import { Doctor } from "@prisma/client"
import { useDoctors } from "@/context/DoctorsContext"


const ITEMS_PER_PAGE = 8; // Adjust this value as needed

export default function DoctorManagementPage() {
  const { doctors, isLoading ,fetchDoctors} = useDoctors();
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);



  const handleDoctorUpdated = (updatedDoctor: Doctor) => {
    // Refresh the doctors list
    fetchDoctors();
    // update the doctor in the list
    

    setEditingDoctor(null);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedDoctors = doctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="container mx-auto py-8 w-full">
      <h1 className="text-3xl font-bold mb-8 ">Doctor Management</h1>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingDoctor(null); // Reset editingDoctor when dialog closes
          setIsDialogOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setEditingDoctor(null); // Clear editingDoctor when adding a new doctor
              setIsDialogOpen(true);
            }}
            className="mb-6"
          >
            Add New Doctor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
            <DialogDescription>
              {editingDoctor
                ? "Edit the details of the doctor."
                : "Enter the details of the new doctor."}
            </DialogDescription>
          </DialogHeader>
          <DoctorForm
            key={editingDoctor?.id || "add"}
            initialData={editingDoctor || undefined}
            setIsDialogOpen={setIsDialogOpen}
            onDoctorUpdated={handleDoctorUpdated}
            editingDoctor={editingDoctor? true : false}

          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <DoctorListSkeleton />
      ) : (

        <DoctorList
        doctors={paginatedDoctors}
          onEdit={(doctor) => {
            setEditingDoctor(doctor);
            setIsDialogOpen(true);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}



