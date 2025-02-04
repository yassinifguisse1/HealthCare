"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useFormStatus } from "react-dom"
import { setRole, removeRole } from "@/app/actions/_actions"
import React from "react" // Added import for React

export default function UsersWrapper({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { pending } = useFormStatus()

  useEffect(() => {
    if (!pending && isSubmitting) {
      setIsSubmitting(false)
    }
  }, [pending, isSubmitting])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    const action = form.getAttribute("data-action") as "setRole" | "removeRole"

    try {
      const result = await (action === "setRole" ? setRole(formData) : removeRole(formData))
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (typeof child.props.onSubmit === 'function') {
            return React.cloneElement(child as React.ReactElement<any>, { onSubmit: handleSubmit })
          }
          return child
        }
        return child
      })}
    </div>
  )
}

