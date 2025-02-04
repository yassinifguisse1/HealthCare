import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkRole } from "@/utils/roles";
import { updateFormSchema } from "@/lib/shema";
import { redirect } from "next/navigation";

interface Proptype {
  params: { id: string };
}

/**
 * @method PUT
 * @route ~/api/doctor/:id
 * @desc Update Single doctor by id
 * @access public
 **/

export async function PUT(request: NextRequest, { params }: Proptype) {
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
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!doctor) {
      return NextResponse.json({ message: "doctor not fund" }, { status: 404 });
    }
    const body = await request.json();
    const validation = updateFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
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
    
    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        speciality,
        degree,
        experience,
        about,
        fees,
        image,
        addressLine1,
        addressLine2,
      },
    });
    return NextResponse.json(
      { message: "Doctor Updated successfully!", updatedDoctor },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/doctor/:id
 * @desc GET Single Doctor by id
 * @access public
 **/

export async function GET(request: NextRequest, { params }: Proptype) {

  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User is not signed in." },
        { status: 401 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!doctor) {
      return NextResponse.json({ message: "doctor not fund" }, { status: 404 });
    }
    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server errorb" },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route ~/api/doctor/:id
 * @desc Delete Single Doctorz by id
 * @access public
 **/
export async function DELETE(request: NextRequest, { params }: Proptype) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      redirect("/sign-in");
    }
    // check if the admin role
    const isAdmin = await checkRole("admin"); // Assuming checkRole takes userId and role
    if (!isAdmin) {
      // redirect('/')
      return NextResponse.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }
    // Check if the doctor exists before attempting to delete
    const doctorExists = await prisma.doctor.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!doctorExists) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }
     // Proceed to delete the doctor
     await prisma.doctor.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Doctor deleted" }, { status: 200 });
  } catch (error) {

    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
