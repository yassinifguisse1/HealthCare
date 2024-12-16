import {  getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkRole } from "@/utils/roles";
import {  updateFormSchema } from "@/lib/shema";
  
interface Proptype {
    params: { id: string };
  }
  
  /**
 * @method PUT
 * @route ~/api/articles/:id
 * @desc Update Single Articles by id
 * @access public
 **/

  export async function PUT(request: NextRequest, { params }: Proptype) {
    try {
       const { userId } = getAuth(request);
          console.log("Request userId:", userId);
          // console.log("Request Headers:", request.headers);
      
          if (!userId) {
            return NextResponse.json(
              { error: "User is not signed in." },
              { status: 401 }
            );
          }
      
          const isAdmin = await checkRole("admin"); // Assuming checkRole takes userId and role
          if (!isAdmin) {
            // redirect('/')
            return NextResponse.json(
              { message: "Access denied. Admins only." },
              { status: 403 }
            );
          }
      const doctor = await prisma.doctor.findUnique({

        where: {
            id: params.id,
        }
      });
      if (!doctor) {
        return NextResponse.json(
          { message: "doctor not fund" },
          { status: 404 }
        );
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
       
          console.log("Validation:", validation);
          console.log("Body:", body);
          // ADD ORDERBY
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
 
      })
      return NextResponse.json( { message: "Doctor Updated successfully!", updatedDoctor },{ status: 200 });

    } catch (error) {
        console.log(error)
      return NextResponse.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }