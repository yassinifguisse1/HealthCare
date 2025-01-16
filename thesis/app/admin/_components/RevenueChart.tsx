"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useCallback, useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from 'lucide-react'

type RevenueData = {
  month: string
  revenue: number
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface RevenueChartProps {
  data: RevenueData[]
  refreshData: () => Promise<void>
}
export function RevenueChart({ data,refreshData }: RevenueChartProps) {
  // const [data, setData] = useState<RevenueData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()


  useEffect(() => {
    const handleRefresh = async () => {
      setIsLoading(true)
      await refreshData()
      setIsLoading(false)
    }
    handleRefresh()
  }, [refreshData])

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
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0)
  const lastMonthRevenue = data[data.length - 2]?.revenue || 0
  const currentMonthRevenue = data[data.length - 1]?.revenue || 0
  const revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  return (

    <Card className="border-2 col-span-2">
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
      <CardDescription className="flex items-center gap-2">
        Total Revenue: ${totalRevenue.toLocaleString()}
        <span className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
          {revenueGrowth.toFixed(1)}%
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[400px]n">
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
          <CartesianGrid  vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]}>
          <LabelList
                dataKey="revenue"
                position="top"
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => `$${value}`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}
