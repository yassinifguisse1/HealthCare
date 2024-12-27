"use client"

import { useState,useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
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
import { Doctor } from '@prisma/client'
import { Calendar } from '@/components/ui/calendar'
import { TimeSlots } from './TimeSlots'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, CreditCard, Wallet } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { appointmentSchema } from '@/lib/shema'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'


// const formSchema = z.object({
//   patientName: z.string({
//       required_error: "Patient name is required.",
//       invalid_type_error:"name shoud be of type string",
//     })
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     }),

//   patientEmail: z.string({
//     required_error: "Email address is required.",
//     invalid_type_error: "Email address must be a string.",
//   }).email({
//     message: "Please enter a valid email address."
//   }),
//   appointmentDate: z.date({
//     required_error: "Please select a date for the appointment.",
//   }),
//   appointmentTime: z.string({
//     required_error: "Please select a time for the appointment.",
//   }),
//   paymentMethod: z.enum(["CASH", "CARD"], {
//     required_error: "Please select a payment method.",
//   }),
//   notes: z.string().optional(),
// });

type AppointmentFormProps = {
  doctor: Doctor,
  doctorId:string
}

export function AppointmentForm({ doctor , doctorId }: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [isPending, startTransition] = useTransition();
  
  const { getToken } = useAuth();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      appointmentDate: new Date(),
      appointmentTime: "",
      paymentMethod: "CASH",
      notes: ""
    },
  })

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    try {
      startTransition(async() => {
        const token = await getToken({ template: "TOKEN_Healthcare" });

        const response = await axios.post(
          `/api/appointments/${doctorId}`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
  
        const appointment = response.data; // Response data will contain the appointment details
  
        toast.success(
          `Your appointment with Dr. ${doctor.name} has been booked for ${format(
            new Date(appointment.appointmentDateTime),
            "PPpp"
          )}`
        );
        form.reset()
        redirect(`/appointments/confirmation/${appointment.id}`);

      })

    } catch (error) {
      console.error("Error creating appointment:", error);
      // Handle Axios errors more gracefully
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.data?.error || "Failed to create appointment";
        toast.error(message);
      } else {
        toast.error(
          "There was an error booking your appointment. Please try again."
        );
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="patientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          fieldState.error && "border-red-500"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[100%] p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(value) => {
                          if (!value) return;
                          field.onChange(value);
                          setSelectedDate(value);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 1)
                            )
                        }
                        initialFocus
                        className="rounded-md border shadow "
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="CARD"
                            id="card"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          Card
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value="CASH"
                            id="cash"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="cash"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Wallet className="mb-3 h-6 w-6" />
                          Cash
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Dr. {doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {doctor.speciality}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">Fees: ${doctor.fees}</p>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Booking Process..." : "Book Appointment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

