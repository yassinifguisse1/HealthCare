import { z } from "zod";

export const formSchema = z.object({
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