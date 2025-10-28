'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, AlertCircle, Menu } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { SherlockPanel } from "@/components/SherlockPanel"
import { MiniSparkline } from "@/components/charts/MiniSparkline"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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

// Generate demo sparkline data for 11 domains
function generateSparklineData(baseValue: number) {
  const data = [];
  const days = 30;
  for (let i = 0; i < days; i++) {
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(baseValue + (Math.random() * 4000 - 2000))
    });
  }
  return data;
}

const leakDomains = [
  { key: 'info', name: 'Click any card', data: [], isInfo: true },
  { key: 'cart_abandonment', name: 'Cart Abandonment', data: generateSparklineData(12000) },
  { key: 'mobile_ux', name: 'Mobile UX', data: generateSparklineData(8000) },
  { key: 'pricing_gap', name: 'Pricing Gap', data: generateSparklineData(6000) },
  { key: 'poor_conversion', name: 'Poor Conversion', data: generateSparklineData(9000) },
  { key: 'social_gap', name: 'Social Gap', data: generateSparklineData(5000) },
  { key: 'trust_signals', name: 'Trust Signals', data: generateSparklineData(4000) },
  { key: 'checkout_friction', name: 'Checkout Friction', data: generateSparklineData(7000) },
  { key: 'seo_issues', name: 'SEO Issues', data: generateSparklineData(3000) },
  { key: 'product_optimization', name: 'Product Optimization', data: generateSparklineData(5500) },
  { key: 'personalization', name: 'Personalization', data: generateSparklineData(4500) },
  { key: 'performance', name: 'Performance', data: generateSparklineData(6500) },
];

const totalCurrent = revenueData.reduce((sum, item) => sum + item.current, 0);
const totalOptimized = revenueData.reduce((sum, item) => sum + item.optimized, 0);
const totalLoss = totalOptimized - totalCurrent;
const lossPercentage = ((totalLoss / totalCurrent) * 100).toFixed(1);

export default function DemoPage() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  function handleDomainClick(domain: typeof leakDomains[0]) {
    if (domain.isInfo) return;

    const latestValue = domain.data[domain.data.length - 1]?.value || 0;
    setSelectedDomain(domain.key);
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: domain.key,
        date: new Date().toISOString(),
        impact: latestValue
      }
    });
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden relative">

      {/* Overlay - click to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Floating Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-0 left-0 z-50 bg-[#c084fc] hover:bg-[#c084fc]/90 text-white rounded-none h-12 w-12"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Left Sliding Menu Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-[70%] sm:w-[50%] lg:w-[20%] bg-background/75 backdrop-blur-sm border-r z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <nav className="space-y-2">
            <a href="#" className="block py-2 text-sm hover:text-primary">Dashboard</a>
            <a href="#" className="block py-2 text-sm hover:text-primary">Revenue Leaks</a>
            <a href="#" className="block py-2 text-sm hover:text-primary">Analytics</a>
            <a href="#" className="block py-2 text-sm hover:text-primary">Settings</a>
          </nav>
        </div>
      </div>

      {/* Revenue Stats Cards - Sticky at top with glassmorphism */}
      <div className="fixed top-0 left-12 right-0 lg:right-[400px] z-40 h-12 flex items-center justify-center gap-6 bg-background/75 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium">Last 30 Days</span>
          </div>
        </div>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex items-center gap-2 text-xs">
          <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold">${totalCurrent.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Current Revenue</span>
          </div>
        </div>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold">${totalOptimized.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Potential Revenue</span>
          </div>
        </div>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          <div className="flex flex-col">
            <span className="font-semibold text-destructive">${totalLoss.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Lost ({lossPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide bg-muted/30">
        <div className="max-w-[90%] mx-auto pt-20 pb-6 px-4">

        {/* Mini Sparklines Grid - 12 cards (1 info + 11 domains) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {leakDomains.map((domain) =>
            domain.isInfo ? (
              <div
                key={domain.key}
                className="p-3 bg-muted/30 flex items-center justify-center text-center"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Click any card to send context to Sherlock AI
                  </p>
                </div>
              </div>
            ) : (
              <MiniSparkline
                key={domain.key}
                domain={domain.name}
                data={domain.data}
                onClick={() => handleDomainClick(domain)}
                isSelected={selectedDomain === domain.key}
              />
            )
          )}
        </div>

        {/* Top Revenue Leaks */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Revenue Leaks</CardTitle>
            <CardDescription className="text-xs">Areas with the highest revenue recovery potential</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="space-y-3">
              {revenueLeaks.map((leak) => (
                <div key={leak.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{leak.name}</span>
                    <span className="text-muted-foreground">${leak.amount.toLocaleString()}</span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full transition-all bg-muted-foreground/20"
                      style={{ width: `${leak.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {leak.percentage}% recovery potential
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        </div>
      </main>

      {/* Sherlock AI Sidebar */}
      <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-muted/30 p-3 overflow-hidden flex-shrink-0 max-h-[40vh] lg:max-h-full scrollbar-hide">
        <SherlockPanel context={sherlockContext} />
      </aside>

    </div>
  )
}
