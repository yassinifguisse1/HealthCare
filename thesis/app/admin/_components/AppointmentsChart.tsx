"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
  import { useAuth } from "@clerk/nextjs"
  import axios from "axios"
  import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
  
  type AppointmentData = {
    name: string
    appointments: number
  }
  
  const chartConfig = {
    appointments: {
      label: "Appointments",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig



export function AppointmentsChart() {
  
  const [data, setData] = useState<AppointmentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const response = await axios.get("/api/admin/charts", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setData(response.data.appointments)
      } catch (error) {
        console.error("Error fetching appointment data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [getToken])

  if (isLoading) {
    return (
      <Card className="col-span-2 border-2">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className=" border-2 w-fullq col-span-2">
      <CardHeader>
        <CardTitle>Appointments Overview</CardTitle>
        <CardDescription>Number of appointments per month</CardDescription>
      </CardHeader>
      <CardContent className="w-fullq  ">
        <ChartContainer config={chartConfig} className="h-[500px]z w-fullz ">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}

            {/* <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            /> */}
            <Bar dataKey="appointments" fill="#adfa1d" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="appointments"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

