'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Sparkles, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useSherlock } from "@/components/sherlock/provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const revenueData = [
  { month: "Jan", current: 65000, optimized: 89000 },
  { month: "Feb", current: 72000, optimized: 95000 },
  { month: "Mar", current: 68000, optimized: 91000 },
  { month: "Apr", current: 78000, optimized: 102000 },
  { month: "May", current: 82000, optimized: 108000 },
  { month: "Jun", current: 85000, optimized: 112000 },
]

const revenueLeaks = [
  { name: "Cart Abandonment", amount: 89234, percentage: 62 },
  { name: "Low AOV", amount: 67892, percentage: 48 },
  { name: "Poor Conversion", amount: 54123, percentage: 38 },
  { name: "Checkout Friction", amount: 43289, percentage: 32 },
]

const chartConfig = {
  current: {
    label: "Current Revenue",
    color: "hsl(var(--chart-2))",
  },
  optimized: {
    label: "Optimized Revenue",
    color: "hsl(var(--chart-1))",
  },
}

export default function Page() {
  const { openSherlock } = useSherlock();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Revenue Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={openSherlock}
          >
            <Sparkles className="h-4 w-4" />
            Ask Sherlock
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
        {/* Revenue Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Revenue
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$847,392</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Optimized Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,124,580</div>
              <p className="text-xs text-muted-foreground">
                Potential with fixes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Leak Callout */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg">Revenue Leak: $277,188</CardTitle>
            </div>
            <CardDescription>
              You're leaving 32.7% on the table
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Revenue Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>
              Current vs Optimized revenue comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                />
                <YAxis
                  className="text-xs"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="current"
                  fill="var(--color-current)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="optimized"
                  fill="var(--color-optimized)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Revenue Leaks */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Leaks</CardTitle>
            <CardDescription>
              Areas with the highest revenue recovery potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {revenueLeaks.map((leak) => (
                <div key={leak.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{leak.name}</span>
                    <span className="text-muted-foreground">
                      ${leak.amount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={leak.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {leak.percentage}% recovery potential
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
