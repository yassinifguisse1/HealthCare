import { NextResponse , NextRequest } from "next/server";
import { getAuth } from '@clerk/nextjs/server'
import prisma  from '@/lib/db';
import { checkRole } from '@/utils/roles'




export async function POST(request: NextRequest){
  const { userId  } = await getAuth(request);
    // console.log("UserId from auth:", userId); // Add logging
    console.log("Request userId:", userId);
    // console.log("Request Headers:", request.headers);


    if (!userId) {
      return NextResponse.json({ error: "User is not signed inn." }, { status: 401 });
    }


  try {
    const isAdmin = await checkRole( "admin"); // Assuming checkRole takes userId and role
    if (!isAdmin) {
      // redirect('/')
      return NextResponse.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }
    


    // Parse the request body
    const body = await request.json();
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

    // Validate inputs
    if (
      !name ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !image ||
      !addressLine1
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the doctor record in the database
    const doctor = await prisma.doctor.create({
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
      },
    });

    return NextResponse.json(
      { message: "Doctor added successfully!", doctor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

}


