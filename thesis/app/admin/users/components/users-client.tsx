"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { removeRole, setRole } from "@/app/actions/_actions"
import type { EmailAddress } from "@clerk/nextjs/server"

export interface SerializedUser {
    publicMetadata: any
    id: string
    firstName: string
    lastName: string
    email: string
    role: string | null
    emailAddresses: { id: string; emailAddress: string }[]
    primaryEmailAddressId: string
  }
  
  interface UsersClientProps {
    initialUsers: SerializedUser[]
    initialError: string | null
  }

export function UsersClient({ initialUsers, initialError }: UsersClientProps) {
  const [userList, setUserList] = useState(initialUsers)
  const [isPending, startTransition] = useTransition()

  const handleSetRole = async (formData: FormData) => {
    try {
      await setRole(formData)
      const id = formData.get("id") as string
      const role = formData.get("role") as string
      startTransition(() => {
        setUserList((prev) => prev.map((user) => (user.id === id ? { ...user, publicMetadata: { role } } : user)))
      })
      toast.success("Role updated successfully")
    } catch (err) {
      toast.error("Failed to set role")
    }
  }

  const handleRemoveRole = async (formData: FormData) => {
    try {
      await removeRole(formData)
      const id = formData.get("id") as string
      startTransition(() => {
        setUserList((prev) => prev.map((user) => (user.id === id ? { ...user, publicMetadata: { role: null } } : user)))
      })
      toast.success("Role removed successfully")
    } catch (err) {
      toast.error("Failed to remove role")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>

        {initialError && <p className="text-red-500 mt-4">{initialError}</p>}

        {userList.length > 0 && (
          <div className="mt-4 space-y-4">
            {userList.map((user) => (
              <div key={user.id} className="border p-4 rounded-lg">
                <div className="font-bold">
                  {user.firstName} {user.lastName}
                </div>
                <div>{user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}</div>
                <div>Role: {user.publicMetadata.role || "No role"}</div>
                <div className="mt-2 space-x-2">
                  <form action={handleSetRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="admin" name="role" />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                      disabled={isPending}
                    >
                      Make Admin
                    </button>
                  </form>
                  <form action={handleRemoveRole} className="inline">
                    <input type="hidden" value={user.id} name="id" />
                    <button
                      type="submit"
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                      disabled={isPending}
                    >
                      Remove Role
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

