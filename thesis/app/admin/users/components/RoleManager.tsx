"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { setRole, removeRole } from "@/app/actions/_actions"
import { Button } from "@/components/ui/button"

interface RoleManagerProps {
  userId: string
  currentRole: string | null
}

export function RoleManager({ userId, currentRole }: RoleManagerProps) {
    const [isPending, startTransition] = useTransition()

    const handleSetRole = async (role: string) => {
        startTransition(async () => {
          const formData = new FormData()
          formData.append("id", userId)
          formData.append("role", role)
          const result = await setRole(formData)
          if (result.success) {
            toast.success(result.message)
          } else {
            toast.error(result.message)
          }
        })
      }
    
      const handleRemoveRole = async () => {
        startTransition(async () => {
          const formData = new FormData()
          formData.append("id", userId)
          const result = await removeRole(formData)
          if (result.success) {
            toast.success(result.message)
          } else {
            toast.error(result.message)
          }
        })
      }

  return (
    <div className="space-x-2">
      <Button
        onClick={() => handleSetRole("admin")}
        disabled={isPending || currentRole === "admin"}
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Make Admin
      </Button>
      <Button
        onClick={handleRemoveRole}
        disabled={isPending || !currentRole}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Remove Role
      </Button>
    </div>
  )
}

