"use client";

import {  useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import React from "react";
import { SingleImageDropzone } from "@/components/ui/SingleImageDropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner"
import { formSchema } from "@/lib/shema";
import { Doctor, Speciality } from "@prisma/client";
import { ProgressDialog } from "./ProgressDialog";
import { useDoctors } from "@/context/DoctorsContext";





type DoctorFormProps = {
  initialData?: Doctor;
  setIsDialogOpen: (isOpen: boolean) => void;
  onDoctorUpdated?: (doctor: Doctor) => void;
};

const SpecialityOptions:Speciality[] = [
  "GENERAL_PHYSICIAN",
  "GYNECOLOGIST",
  "DERMATOLOGIST",
  "PEDIATRICIAN",
  "NEUROLOGIST",
  "GASTROENTEROLOGIST",
];

export function DoctorForm({ initialData , setIsDialogOpen,onDoctorUpdated}: DoctorFormProps) {
  // const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const { addDoctor, updateDoctor } = useDoctors();



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      speciality: initialData?.speciality || undefined,
      degree: initialData?.degree || "",
      experience: initialData?.experience || "",
      about: initialData?.about || "",
      fees: initialData?.fees || 0,
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {

    try {
      setProgress(0);
      setIsProgressDialogOpen(true);

      startTransition(async () => {
        let uploadedImageUrl = initialData?.image || "";
        if (!file) {
          alert("Please select an image.");
          setIsProgressDialogOpen(false);

          return;
        }
        if (file) {
          const res = await edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
              console.log(progress);
              setProgress(progress);
            },
          });
          uploadedImageUrl = res.url;
        }
        setProgress(99); // Set to 50% after image upload

        // Determine if it's an edit or create action
        // const method = initialData ? "PUT" : "POST";

        // const endpoint = initialData
        //   ? `/api/doctor/${initialData.id}` // Update existing doctor
        //   : `/api/doctor`; // Add new doctor

        // const response = await axios({
        //   method,
        //   url: endpoint,
        //   data: {
        //     ...values,
        //     image: uploadedImageUrl || "/empty.svg",
        //   },
        // });
        const doctorData = {
          ...values,
          image: uploadedImageUrl || "/empty.svg",
          speciality: values.speciality as Speciality,
        };
        let updatedDoctor: Doctor;

        if (initialData) {
          updatedDoctor = await updateDoctor(initialData.id, doctorData);
          toast.success("Doctor updated successfully!");
          
        } else {
          updatedDoctor = await addDoctor(doctorData);
          toast.success("Doctor added successfully!");
        }
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsProgressDialogOpen(false);
        setIsDialogOpen(false);
         // Use the updatedDoctor data
         if (onDoctorUpdated) {
          onDoctorUpdated(updatedDoctor);
        }

        // if (response.status === 200 || response.status === 201) {
        //   setProgress(100); // Set to 100% after API call
        //   // Wait for a short moment to ensure the 100% progress is visible
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   setIsProgressDialogOpen(false);
        //   setIsDialogOpen(false);
        //   toast.success(
        //     initialData
        //       ? "Doctor updated successfully!"
        //       : "Doctor added successfully!"
        //   );
        //   onSubmit(response.data);
        //   redirect("/admin/doctors");
        
        // } else {
        //   throw new Error(response.data.error || "Unexpected error occurred.");
        // }
      });
    } catch (err) {
      console.error(err);
      toast.error(initialData ? "Failed to update doctor" : "Failed to add doctor");
      setProgress(0);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <ProgressDialog isOpen={isProgressDialogOpen} progress={progress} />

        {/* Image Upload */}
        <div className="space-y-4">
          <SingleImageDropzone
            value={file}
            onChange={(newFile) => setFile(newFile)}
            width={200}
            height={200}
          />
          <FormMessage />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Dr. John Doe"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speciality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border w-full ">
                      <SelectValue placeholder="Select a Speciality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SpecialityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MBBS, MD"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input
                    placeholder="5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fees</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description about the doctor"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apt 4B"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || (progress > 0 && progress < 100)}
        >
          {isPending || (progress > 0 && progress < 100)
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
            ? "Update Doctor"
            : "Save Doctor"}
        </Button>
       
      </form>
    </Form>
  );
}

