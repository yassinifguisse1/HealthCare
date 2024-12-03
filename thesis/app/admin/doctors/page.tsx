"use client"

import { useState } from "react"
import { DoctorForm } from "@/app/admin/_components/DoctorForm"
import { DoctorList } from "@/app/admin/_components/DoctorList"
import { Doctor } from "@/types/doctor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const initialDoctors: Doctor[] = [
  {
    _id: 'doc1',
    name: 'Dr. Richard James',
    image: '/placeholder.svg?height=400&width=400',
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

  const handleAddDoctor = (newDoctor: Doctor) => {
    setDoctors([...doctors, newDoctor]);
    setIsDialogOpen(false);
  };

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(doc => doc._id === updatedDoctor._id ? updatedDoctor : doc));
    setEditingDoctor(null);
    setIsDialogOpen(false);
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doc => doc._id !== id));
  };

  return (
    <div className="container mx-auto py-8 w-full ">
      <h1 className="text-3xl font-bold mb-8 ">Doctor Management</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">Add New Doctor</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-w-full h-[75%] border-2">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            <DialogDescription>
              {editingDoctor ? 'Edit the details of the doctor.' : 'Enter the details of the new doctor.'}
            </DialogDescription>
          </DialogHeader>
          <DoctorForm 
            initialData={editingDoctor || undefined} 
            onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor} 
          />
        </DialogContent>
      </Dialog>

      <DoctorList 
        doctors={doctors} 
        onEdit={(doctor) => {
          setEditingDoctor(doctor);
          setIsDialogOpen(true);
        }} 
        onDelete={handleDeleteDoctor} 
      />
    </div>
  )
}

