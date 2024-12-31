"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, DollarSign, TrendingUp } from 'lucide-react'
import Appointments from "./_components/Appointements"
import Header from "./_components/Header"
import { AppointmentsChart } from "./_components/AppointmentsChart"
import { RevenueChart } from "./_components/RevenueChart"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { DashboardCardsSkeleton } from "./_components/dashboard-cards-skeleton"


type DashboardStats = {
  totalPatients: { count: number; change: string }
  appointments: { count: number; change: number }
  revenue: { amount: number; change: string }
  satisfaction: { rate: number; change: string }
}
export default  function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken({ template: "TOKEN_Healthcare" })
        const response = await axios.get("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast.error("Failed to load dashboard statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [getToken])
  

  return (
    <div className="space-y-8 ">
      
      <Header/>
      
      {isLoading ? (
        <DashboardCardsSkeleton />
      ) : stats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-800 opacity-90"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">{stats.totalPatients.count.toLocaleString()}</div>
              <p className="text-xs text-purple-200">+{stats.totalPatients.change}% from last month</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-cyan-800 opacity-90"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Appointments</CardTitle>
              <Activity className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">{stats.appointments.count.toLocaleString()}</div>
              <p className="text-xs text-blue-200">+{stats.appointments.change} since yesterday</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-emerald-800 opacity-90"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">
                ${stats.revenue.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-200">+{stats.revenue.change}% from last month</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-amber-800 opacity-90"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Patient Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">{stats.satisfaction.rate}%</div>
              <p className="text-xs text-orange-200">+{stats.satisfaction.change}% from last month</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Failed to load dashboard statistics</div>
      )}
      <Appointments/>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AppointmentsChart />
        <RevenueChart/>
      </div>

    
    </div>
  )
}

