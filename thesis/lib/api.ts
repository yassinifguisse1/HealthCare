import { Doctor } from '@/types/doctor'

export async function getDoctorById(id: string): Promise<Doctor | null> {
  // In a real application, you would fetch this data from your backend
  // For this example, we'll return dummy data
  return {
    id,
    name: "Dr. Jane Smith",
    image: "/placeholder.svg?height=400&width=400",
    speciality: "Cardiologist",
    degree: "MD, FACC",
    experience: "15 Years",
    about: "Dr. Jane Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions.",
    fees: 150,
    addressLine1: "123 Medical Center Blvd",
    addressLine2: "Suite 456, Healthville, HV 12345",
    createdAt: "2023-01-15T00:00:00Z"
  }
}