import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextApiRequest } from "next";

const getDoctorById = async (id: string , req:NextApiRequest) => {
    const { getToken } = getAuth(req);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const token = await getToken({ template: "TOKEN_Healthcare" });
    const response = await axios.get(`${baseUrl}/api/doctor/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }
};