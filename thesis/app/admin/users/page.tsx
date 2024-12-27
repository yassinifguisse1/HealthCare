import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from '@/app/admin/_components/SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from '@/app/admin/_actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const usersPage = async (params: {
    searchParams: Promise<{ search?: string }>
  }) => {
   
    if (!checkRole('admin')) {
        redirect('/')
      }
    
      const query = (await params.searchParams).search
    
      const client = await clerkClient()
    
      let users: any[] = []
      let error = null
    
      if (query) {
        try {
          const response = await client.users.getUserList({ query })
          users = response.data
        } catch (err) {
          error = "An error occurred while fetching users. Please try again."
          console.error(err)
        }
      }
  return (
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
                {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                  ?.emailAddress}
              </div>
              <div>Role: {user.publicMetadata.role as string || 'No role'}</div>
              <div className="mt-2 space-x-2">
                <form action={setRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Make Admin</button>
                </form>
                <form action={setRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="moderator" name="role" />
                  <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Make Moderator</button>
                </form>
                <form action={removeRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded">Remove Role</button>
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

export default usersPage