import { Speciality } from "@prisma/client";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string({
      required_error:"name is required", 
      invalid_type_error:"name shoud be of type string",
  }).min(2, {
    message: "Name must be at least 2 characters.",
  }),
  speciality: z.nativeEnum(Speciality),
  degree: z.string({
    required_error:"degree is required", 

  }).min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  experience: z.string().min(1, {
    message: "Experience is required.",
  }),
  about: z.string().min(10, {
    message: "About must be at least 10 characters.",
  }),
  fees: z.coerce
    .number({
      required_error: "Fees is required",
      invalid_type_error: "Fees must be a number",
    })
    .min(0, {
      message: "Fees must be a positive number.",
    }),
  addressLine1: z.string().min(1, {
    message: "Address Line 1 is required.",
  }),
  addressLine2: z.string().optional(),
});

export const updateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).optional(),
  speciality: z.nativeEnum(Speciality),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }).optional(),
  experience: z.string().min(1, {
    message: "Experience is required.",
  }).optional(),
  about: z.string().min(10, {
    message: "About must be at least 10 characters.",
  }).optional(),
  fees: z.coerce
    .number({
      required_error: "Fees is required",
      invalid_type_error: "Fees must be a number",
    })
    .min(0, {
      message: "Fees must be a positive number.",
    }).optional(),
  addressLine1: z.string().min(1, {
    message: "Address Line 1 is required.",
  }).optional(),
  addressLine2: z.string().optional(),
});