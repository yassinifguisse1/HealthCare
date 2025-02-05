import { ClerkProvider } from "@clerk/nextjs";
import React from 'react'; // Import React

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}