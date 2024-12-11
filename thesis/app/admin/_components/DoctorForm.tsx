"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Doctor } from "@/types/doctor"
import Image from "next/image"
import { useEdgeStore } from '@/lib/edgestore';
import React from "react"
import { SingleImageDropzone } from '@/components/ui/SingleImageDropzone';
import { Select, SelectContent, SelectItem, SelectValue,SelectTrigger } from "@/components/ui/select"
// import { SelectTrigger } from "@radix-ui/react-select"



const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  speciality: z.string().min(2, {
    message: "Speciality must be at least 2 characters.",
  }),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  experience: z.string().min(1, {
    message: "Experience is required.",
  }),
  about: z.string().min(10, {
    message: "About must be at least 10 characters.",
  }),
  fees: z.number().min(0, {
    message: "Fees must be a positive number.",
  }),
  address: z.object({
    line1: z.string().min(1, { message: "Address Line 1 is required." }),
    line2: z.string().optional(),
  }),
})

type DoctorFormProps = {
  initialData?: Doctor;
  onSubmit: (data: Doctor) => void;
};

const SpecialityOptions = [
  "GENERAL_PHYSICIAN",
  "GYNECOLOGIST",
  "DERMATOLOGIST",
  "PEDIATRICIAN",
  "NEUROLOGIST",
  "GASTROENTEROLOGIST",
];

export function DoctorForm({ initialData, onSubmit }: DoctorFormProps) {
    const [imagePreview, setImagePreview] = useState(initialData?.image || "")
    const [file, setFile] = React.useState<File>();
    const { edgestore } = useEdgeStore();
    const [isPending, startTransition] = useTransition();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: initialData?.name || "",
          speciality: initialData?.speciality || "",
          degree: initialData?.degree || "",
          experience: initialData?.experience || "",
          about: initialData?.about || "",
          fees: initialData?.fees || 0,
          address: {
            line1: initialData?.address?.line1 || "",
            line2: initialData?.address?.line2 || "",
          },
        },
      })

      async function handleSubmit(values: z.infer<typeof formSchema>) {

   
    try {
   
      console.log('clicked = outside')
      startTransition(async () => {
        let uploadedImageUrl = "";
      if (!file) {
        alert("Please select an image.");
        return;
      }
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => console.log(progress),
        });
        uploadedImageUrl = res.url;
        console.log(uploadedImageUrl)
        console.log('clicked = inside')
      }
      const finalData = {
        id: initialData?.id || Date.now().toString(),
        ...values,
        image: uploadedImageUrl,
        address: {
          line1: values.address.line1,
          line2: values.address.line2 || "",
        },
      };
        onSubmit(finalData);
      });


    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please try again.");
    }
  }




  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
   
        {/* Image Upload */}
        <div className="space-y-4">
          <SingleImageDropzone
            value={file}
            onChange={(newFile) => setFile(newFile)}
            width={200}
            height={200}
          />
          <FormMessage />

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
                  <Input placeholder="Dr. John Doe" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Input placeholder="MBBS, MD" {...field} />
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
                  <Input placeholder="5 Years" {...field} />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Apt 4B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Doctor"}
        </Button>
      </form>
    </Form>
  );
}

