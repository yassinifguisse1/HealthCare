"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Doctor } from "@/types/doctor"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.string().url({
    message: "Please enter a valid URL for the image.",
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
    line1: z.string().min(1, {
      message: "Address line 1 is required.",
    }),
    line2: z.string().optional(),
  }),
})

type DoctorFormProps = {
  initialData?: Doctor;
  onSubmit: (data: Doctor) => void;
};

export function DoctorForm({ initialData, onSubmit }: DoctorFormProps) {
    const [imagePreview, setImagePreview] = useState(initialData?.image || "")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: initialData?.name || "",
          image: initialData?.image || "",
          speciality: initialData?.speciality || "",
          degree: initialData?.degree || "",
          experience: initialData?.experience || "",
          about: initialData?.about || "",
          fees: initialData?.fees || 0,
          address: {
            line1: initialData?.address.line1 || "",
            line2: initialData?.address.line2 || "",
          },
        },
      })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      _id: initialData?._id || Date.now().toString(),
      ...values,
      address: {
        line1: values.address.line1,
        line2: values.address.line2 || '' // Provide empty string as fallback if line2 is undefined
      }
    })
  }

//   function handleSubmit(values: z.infer<typeof formSchema>) {
//     onSubmit({
//       _id: initialData?._id || Date.now().toString(),
//       ...values,
//       image,
//       address: {
//         line1: values.addressLine1,
//         line2: values.addressLine2,
//       },
//     });
//   }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doctor Image URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://example.com/doctor-image.jpg"
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  setImagePreview(e.target.value)
                }}
              />
            </FormControl>
            <FormDescription>
              Enter the URL of the doctor&apos;s image.
            </FormDescription>
            <FormMessage />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Doctor preview"
                


                className="mt-2 w-32 h-32 object-cover rounded-full"
              />
            )}
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <FormControl>
                <Input placeholder="Cardiology" {...field} />
              </FormControl>
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
                <Input type="number" placeholder="100" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
              <Textarea placeholder="Brief description about the doctor" {...field} />
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
      <Button type="submit">Save Doctor</Button>
    </form>
  </Form>
  )
}

