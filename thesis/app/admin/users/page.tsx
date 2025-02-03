// import { redirect } from 'next/navigation'
// import { checkRole } from '@/utils/roles'
// import { SearchUsers } from '@/app/admin/_components/SearchUsers'
// import { clerkClient, EmailAddress } from '@clerk/nextjs/server'
// import { removeRole, setRole } from '@/app/actions/_actions'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import UsersWrapper from './components/users-wrapper'
// import ClientToast from './components/ClientToast'
// import { toast } from 'sonner'
// const usersPage = async (params: {
//     searchParams: Promise<{ search?: string }>
//   }) => {
//     if (!checkRole("admin")) {
//       redirect("/");
//     }
//     const query = (await params.searchParams).search;

//     const client = await clerkClient();

//     let users: any[] = [];
//     let error = null;

//     if (query) {
//       try {
//         const response = await client.users.getUserList({ query });
//         users = response.data;
//       } catch (err) {
//         error = "An error occurred while fetching users. Please try again.";
//         console.error(err);
//       }
//     }
//     return (
      
//         <Card>

//           <CardHeader>
//             <CardTitle>User Management</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <SearchUsers />

//             {error && <p className="text-red-500 mt-4">{error}</p>}

//             {users.length > 0 && (
//               <div className="mt-4 space-y-4">
//                 {users.map((user) => (
//                   <div key={user.id} className="border p-4 rounded-lg">
//                     <div className="font-bold">
//                       {user.firstName} {user.lastName}
//                     </div>
//                     <div>
//                       {
//                         user.emailAddresses.find(
//                           (email: EmailAddress) =>
//                             email.id === user.primaryEmailAddressId
//                         )?.emailAddress
//                       }
//                     </div>
//                     <div>
//                       Role: {(user.publicMetadata.role as string) || "No role"}
//                       {/* {
//                         user.publicMetadata.role === "admin" && (
//                           <p className="text-yellow-500 mt-2">
//                             This user is an admin and has full access to the application. Be careful when changing their role.
//                           </p>
                          
//                         )

//                       } */}
//                     </div>
//                     <div className="mt-2 space-x-2">
//                       <form action={setRole} className="inline">
//                         <input type="hidden" value={user.id} name="id" />
//                         <input type="hidden" value="admin" name="role" />
//                         <button
//                           type="submit"
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                         >
//                           Make Admin
//                         </button>
//                       </form>
//                       {/* <form action={setRole} className="inline">
//                   <input type="hidden" value={user.id} name="id" />
//                   <input type="hidden" value="moderator" name="role" />
//                   <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Make Moderator</button>
//                 </form> */}
//                       <form action={removeRole} className="inline">
//                         <input type="hidden" value={user.id} name="id" />
//                         <button
//                           type="submit"
//                           className="bg-red-500 text-white px-2 py-1 rounded"
//                         >
//                           Remove Role
//                         </button>
//                       </form>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//     );
//   }

// export default usersPage




import { redirect } from "next/navigation"
import { checkRole } from "@/utils/roles"
import { SearchUsers } from "@/app/admin/_components/SearchUsers"
import { clerkClient, type EmailAddress } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "sonner"
import { RoleManager } from "./components/RoleManager"
import { Badge } from "@/components/ui/badge"

const UsersPage = async ({ searchParams }: { searchParams: { search?: string } }) => {
  if (!checkRole("admin")) {
    redirect("/")
  }

  const query = searchParams.search

  const client = await clerkClient()

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

