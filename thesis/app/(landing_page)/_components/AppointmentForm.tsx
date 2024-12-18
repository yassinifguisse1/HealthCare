"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
// import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Doctor } from '@/types/doctor'
import { Calendar } from '@/components/ui/calendar'
import { TimeSlots } from './TimeSlots'
// import { Doctor } from '@prisma/client'

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  appointmentDate: z.date({
    required_error: "Please select a date for the appointment.",
  }),
  appointmentTime: z.string({
    required_error: "Please select a time for the appointment.",
  }),
  notes: z.string().optional(),
})

type AppointmentFormProps = {
  doctor: Doctor
}

export function AppointmentForm({ doctor }: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send this data to your backend
    console.log(values)
    // Implement your appointment creation logic here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setSelectedDate(date)
                }}
                disabled={(date) =>
                  date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                }
                className="rounded-md border"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedDate && (
          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <TimeSlots
                  date={selectedDate}
                  doctorId={doctor.id}
                  onTimeSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information for the doctor"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.speciality}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-lg font-bold">Fees: ${doctor.fees}</p>
          </div>
        </div>
        <Button type="submit" className="w-full">Book Appointment</Button>
      </form>
    </Form>
  )
}

