"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
interface ClientToastProps {

    message: string;
  
    type: string;
  
  }
export default function ClientToast({ message, type }: ClientToastProps) {
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const success = searchParams.get("success");
//     const message = searchParams.get("message");

//     if (success && message) {
//       if (success === "true") {
//         toast.success(message);
//       } else {
//         toast.error(message);
//       }
//     }
//     // Optionally, you might want to remove the query params after showing the toast.
//     // For example, you could use the router.replace() method.
//   }, [searchParams]);  
   if(type === "error") {
    toast.error(message);
   }
    if(type === "success") {
     toast.success(message);
    }
    return <></>;
  

  return <Toaster />;
}
