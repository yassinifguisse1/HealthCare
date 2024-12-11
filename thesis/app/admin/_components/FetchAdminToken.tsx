'use client'
import { useSession } from "@clerk/nextjs";

export default function FetchAdminToken() {
  const { session } = useSession();

  const fetchToken = async () => {
    try {
      const token = await session?.getToken({ template: "TOKEN_Healthcare" });
      console.log("Admin Token:", token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return <button onClick={fetchToken}>Get Admin Token</button>;
}
