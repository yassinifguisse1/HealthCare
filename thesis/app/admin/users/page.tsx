

import { redirect } from "next/navigation"
import { checkRole } from "@/utils/roles"
import { SearchUsers } from "@/app/admin/_components/SearchUsers"
import { clerkClient, type EmailAddress } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleManager } from "./components/RoleManager"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

const UsersPage = async ({ searchParams }: { searchParams: { search?: string } }) => {
  if (!checkRole("admin")) {
    redirect("/")
  }

  const query = searchParams.search

  const client = await clerkClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any[] = []
  let error = null

  try {
    const response = await client.users.getUserList({ query: query || undefined })
    users = response.data
  } catch (err) {
    error = "An error occurred while fetching users. Please try again."
    console.error(err)
  }

  return (
    <>
      {/* <Toaster /> */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchUsers />

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {users.length > 0 && (
            <div className="mt-4 space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border p-4 rounded-lg">
                  <div className="font-bold">
                    {user.firstName} {user.lastName}
                  </div>
                  <div>
                    {
                      user.emailAddresses.find((email: EmailAddress) => email.id === user.primaryEmailAddressId)
                        ?.emailAddress
                    }
                  </div>
                  <Badge className="my-3 text-sm">Role: {(user.publicMetadata.role as string) || "No role"}</Badge>
                  <RoleManager userId={user.id} currentRole={user.publicMetadata.role as string | null} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default UsersPage

