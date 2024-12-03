"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"


const data = [
  { name: 'Jan', appointments: 400 },
  { name: 'Feb', appointments: 300 },
  { name: 'Mar', appointments: 200 },
  { name: 'Apr', appointments: 278 },
  { name: 'May', appointments: 189 },
  { name: 'Jun', appointments: 239 },
  { name: 'Jul', appointments: 349 },
]
const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

export function AppointmentsChart() {
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
            <Bar dataKey="appointments" fill="#adfa1d" radius={8}>
              <LabelList
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

