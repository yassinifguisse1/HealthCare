import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { checkRole } from "@/utils/roles";
import { formSchema } from "@/lib/shema";

/**
 * @method GET
 * @route ~/api/doctor
 * @desc GET New doctor
 * @access public
 **/
export async function GET() {
  try {
    // Fetch all doctors from the database

    const doctor = await prisma.doctor.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        speciality: true,
        experience: true,
        fees: true,
        image: true,
        about: true,
        degree: true,
        createdAt: true,
        updatedAt: true,
        addressLine1: true,
        addressLine2: true,
        appointments: true,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @route ~/api/doctor
 * @desc Create New Doctor
 * @access public
 **/

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
   
    if (!userId) {
      return NextResponse.json(
        { error: "User is not signed in." },
        { status: 401 }
      );
    }

    const isAdmin = await checkRole("admin"); // Assuming checkRole takes userId and role
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    // validation safeparams zod
    const {
      name,
      speciality,
      degree,
      experience,
      about,
      fees,
      image,
      addressLine1,
      addressLine2,
    } = body;
    const validation = formSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    // Create the doctor record in the database
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        speciality,
        degree,
        experience,
        about,
        fees: parseFloat(fees),
        image,
        addressLine1,
        addressLine2: addressLine2 || null,
      }
      // ,
      // select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/doctor
 * @desc Delete a Doctor
 * @access public
 **/

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = await checkRole("admin"); // Assuming checkRole takes userId and role
    if (!isAdmin) {
      // redirect('/')
      return NextResponse.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    await prisma.doctor.deleteMany();
    return NextResponse.json(
      { message: "ALL Doctor deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error =>>", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
