"use client"

import { useEffect, useState } from "react"
import { DoctorForm } from "@/app/admin/_components/DoctorForm"
import { DoctorList } from "@/app/admin/_components/DoctorList"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DoctorListSkeleton } from "@/app/(landing_page)/_components/DoctorListSkeleton"
import axios from "axios"
import { useAuth } from '@clerk/clerk-react'
import { Doctor } from "@prisma/client"



export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading , setIsLoading] = useState<boolean>(true);
  const { getToken} = useAuth()

// add doctor
  const handleAddDoctor = (newDoctor: Doctor) => {
    setDoctors([...doctors, newDoctor]);
    console.log("doctor from admin/doctors/page.tsx" , newDoctor)
    setIsDialogOpen(false);
  };

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(doc => doc.id === updatedDoctor.id ? updatedDoctor : doc));
    setEditingDoctor(null);
    setIsDialogOpen(false);
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  // fetch doctors from database 

  
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const token = await getToken({ template: "TOKEN_Healthcare" });
        const response = await axios.get("http://localhost:3000/api/doctor", {
          headers: {
            "Content-Type": "application/json",
            // token from clerk
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store"  // Suggestion to discourage caching
          }
        });
        const data = response.data;
        setDoctors(data)
       
        console.log('data inside fetchDoctors axios.get' , data)

    }catch(error) {
      console.log("error fetching doctors" , error)
    }
    
    setIsLoading(false);
  }


  useEffect(() => {
    fetchDoctors();
  }, []); 

  // Update doctors from database 

  
  const updateDoctors = async ( 
    id: string, updatedData: Partial<Doctor>
  ) => {
    setIsLoading(true);
    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.put(
        `http://localhost:3000/api/doctor/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            // token from clerk
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedDoctor = response.data;
      // Update the state to reflect the changes
      // setDoctors((prevDoctors) =>
      //   prevDoctors.map((doc) =>
      //     doc.id === updatedDoctor.id ? updatedDoctor : doc
      //   )
      // );
      handleUpdateDoctor(updatedDoctor);
      console.log("data inside UpdateDoctors axios.get", updatedDoctor);
    } catch (error) {
      console.log("error fetching doctors", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
}



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
            onSubmit={(data) => {
              if (editingDoctor) {
                // If editing, call updateDoctors with the doctor's ID and new data
                updateDoctors(editingDoctor.id, data);
                console.log('id of this doctor is ',  editingDoctor.id, data)
              } else {
                // If adding a new doctor, call handleAddDoctor
                handleAddDoctor(data);
              }
            }}
            setIsDialogOpen={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <DoctorListSkeleton />
      ) : (
        <DoctorList
          doctors={doctors}
          onEdit={(doctor) => {
            setEditingDoctor(doctor);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteDoctor}
        />
      )}
    </div>
  );
}



