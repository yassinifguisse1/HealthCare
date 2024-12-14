"use client"

import { useEffect, useState } from "react"
import { DoctorForm } from "@/app/admin/_components/DoctorForm"
import { DoctorList } from "@/app/admin/_components/DoctorList"
import { Doctor } from "@/types/doctor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import testImage from "@/assets/assets_frontend/doc1.png"
import { DoctorListSkeleton } from "@/app/(landing_page)/_components/DoctorListSkeleton"
import axios from "axios"
import { useAuth } from '@clerk/clerk-react'


const initialDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Richard James',
    image: testImage,
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
];

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading , setIsLoading] = useState<boolean>(true);
  const { getToken, isLoaded, isSignedIn } = useAuth()

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
        const response = await axios.get('http://localhost:3000/api/doctor',{
          headers: {
            'Content-Type': 'application/json',
            // token from clerk
            Authorization: `Bearer ${token}`,
          }
        });
        const data = response.data;
        setDoctors(data);
        console.log('data inside fetchDoctors axios.get' , data)

    }catch(error) {
      console.log("error fetching doctors" , error)
    }
    
    setIsLoading(false);
  }


  useEffect(() => {
    fetchDoctors();
  }, []); 


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
            onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor}
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



