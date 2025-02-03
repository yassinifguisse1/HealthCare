


// "use server"

// import { checkRole } from "@/utils/roles"
// import { clerkClient } from "@clerk/nextjs/server"
// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

// export async function setRole(formData: FormData) {
//   const client = await clerkClient()

//   if (!checkRole("admin")) {
//     redirect("/")
//   }

//   try {
//     await client.users.updateUser(formData.get("id") as string, {
//       publicMetadata: { role: formData.get("role") },
//     })
//     revalidatePath("/admin/users")
    
//     } catch (err) {
//     console.error("Failed to set role:", err)

//     }
// }

// export async function removeRole(formData: FormData) {
//   const client = await clerkClient()

//   if (!checkRole("admin")) {
//     redirect("/")
//   }

//   try {
//     await client.users.updateUser(formData.get("id") as string, {
//       publicMetadata: { role: null },
//     })

//     revalidatePath("/admin/users")
 
//     } catch (err) {
//     console.error("Failed to remove role:", err)

//     // redirect("/admin/users?success=false&message=")
//     }
// }










"use server"

import { checkRole } from "@/utils/roles"
import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  if (!checkRole("admin")) {
    return { success: false, message: "Not authorized to set role" }
  }

  try {
    await client.users.updateUser(formData.get("id") as string, {
      publicMetadata: { role: formData.get("role") },
    })
    revalidatePath("/admin/users")
    return { success: true, message: "Role set successfully" }
  } catch (err) {
    console.error("Failed to set role:", err)
    return { success: false, message: "Failed to set role" }
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  if (!checkRole("admin")) {
    return { success: false, message: "Not authorized to remove role" }
  }

  try {
    await client.users.updateUser(formData.get("id") as string, {
      publicMetadata: { role: null },
    })
    revalidatePath("/admin/users")
    return { success: true, message: "Role removed successfully" }
  } catch (err) {
    console.error("Failed to remove role:", err)
    return { success: false, message: "Failed to remove role" }
  }
}

