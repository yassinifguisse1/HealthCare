import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const checkRole = async (role: Roles): Promise<boolean> => {
  try {
    const { sessionClaims } = await auth();

    // Ensure metadata exists and contains a role
    if (!sessionClaims?.metadata?.role) {
      console.warn('No role found in user metadata.');
      return false;
    }

  // Ensure metadata and role exist
  const userRole = sessionClaims?.metadata?.role as Roles;

  return userRole === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
