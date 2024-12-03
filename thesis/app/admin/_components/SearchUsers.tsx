'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const queryTerm = formData.get('search') as string
          router.push(pathname + '?search=' + queryTerm)
        }}
        className="flex items-center space-x-2"

      >
        <label htmlFor="search">Search for users</label>
        <Input
        id="search"
        name="search"
        type="text"
        placeholder="Search for users"
        className="flex-grow"
      />
      <Button type="submit">Search</Button>
      </form>
    </div>
  )
}