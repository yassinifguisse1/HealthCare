// import { redirect } from 'next/navigation'
// import { checkRole } from '@/utils/roles'
// import { SearchUsers } from './_components/SearchUsers'
// import { clerkClient } from '@clerk/nextjs/server'
// import { removeRole, setRole } from './_actions'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react'

// export default async function AdminDashboard(params: {
//   searchParams: Promise<{ search?: string }>
// }) {
//   if (!checkRole('admin')) {
//     redirect('/about')
//   }

//   const query = (await params.searchParams).search

//   const client = await clerkClient()

//   let users = []
//   let error = null

//   if (query) {
//     try {
//       const response = await client.users.getUserList({ query })
//       users = response.data
//     } catch (err) {
//       error = "An error occurred while fetching users. Please try again."
//       console.error(err)
//     }
//   }
//   return (
//     <>
//       <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>

//       <SearchUsers />

//       {users.map((user) => {
//         return (
//           <div key={user.id}>
//             <div>
//               {user.firstName} {user.lastName}
//             </div>

//             <div>
//               {
//                 user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
//                   ?.emailAddress
//               }
//             </div>

//             <div>{user.publicMetadata.role as string}</div>

//             <form action={setRole}>
//               <input type="hidden" value={user.id} name="id" />
//               <input type="hidden" value="admin" name="role" />
//               <button type="submit">Make Admin</button>
//             </form>

//             <form action={setRole}>
//               <input type="hidden" value={user.id} name="id" />
//               <input type="hidden" value="moderator" name="role" />
//               <button type="submit">Make Moderator</button>
//             </form>

//             <form action={removeRole}>
//               <input type="hidden" value={user.id} name="id" />
//               <button type="submit">Remove Role</button>
//             </form>
//           </div>
//         )
//       })}
//     </>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react'
import Appointments from "./_components/Appointements"
import Header from "./_components/Header"
import { AppointmentsChart } from "./_components/AppointmentsChart"
import { RevenueChart } from "./_components/RevenueChart"

export default  function AdminDashboard() {
  

  return (
    <div className="space-y-8 ">
      
      <Header/>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-800 opacity-90"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">10,482</div>
            <p className="text-xs text-purple-200">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-cyan-800 opacity-90"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Appointments</CardTitle>
            <Activity className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">573</div>
            <p className="text-xs text-blue-200">+201 since yesterday</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-emerald-800 opacity-90"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">$54,231</div>
            <p className="text-xs text-green-200">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-amber-800 opacity-90"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Patient Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">98.2%</div>
            <p className="text-xs text-orange-200">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Appointments/>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AppointmentsChart />
        <RevenueChart/>
      </div>

    
    </div>
  )
}

