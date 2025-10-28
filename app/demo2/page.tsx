'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, Menu } from "lucide-react"
import { SherlockPanel } from "@/components/SherlockPanel"
import { MiniSparkline } from "@/components/charts/MiniSparkline"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Generate demo sparkline data for leak cards
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

const topLeaks = [
  { name: "Cart Abandonment", amount: 89234, percentage: 62, icon: "🔴" },
  { name: "Low AOV", amount: 67892, percentage: 48, icon: "🟠" },
  { name: "Poor Conversion", amount: 54123, percentage: 38, icon: "🟡" },
  { name: "Checkout Friction", amount: 43289, percentage: 32, icon: "🟡" },
];

const allLeaks = [
  { key: 'cart_abandonment', name: 'Cart Abandonment', data: generateSparklineData(12000), severity: 'critical' },
  { key: 'low_aov', name: 'Low AOV', data: generateSparklineData(8000), severity: 'high' },
  { key: 'poor_conversion', name: 'Poor Conversion', data: generateSparklineData(9000), severity: 'high' },
  { key: 'checkout_friction', name: 'Checkout Friction', data: generateSparklineData(7000), severity: 'medium' },
  { key: 'mobile_ux', name: 'Mobile UX', data: generateSparklineData(6000), severity: 'medium' },
  { key: 'pricing_gap', name: 'Pricing Gap', data: generateSparklineData(5000), severity: 'medium' },
  { key: 'trust_signals', name: 'Trust Signals', data: generateSparklineData(4000), severity: 'low' },
  { key: 'seo_issues', name: 'SEO Issues', data: generateSparklineData(3000), severity: 'low' },
  { key: 'product_optimization', name: 'Product Optimization', data: generateSparklineData(5500), severity: 'medium' },
  { key: 'personalization', name: 'Personalization', data: generateSparklineData(4500), severity: 'low' },
  { key: 'performance', name: 'Performance', data: generateSparklineData(6500), severity: 'medium' },
];

const summary = {
  currentRevenue: 450000,
  potentialRevenue: 597000,
  opportunity: 147000,
  percentageLost: 32.7,
  inProgress: 89234,
  inProgressCount: 2
};

function getSeverityColor(recovery: number) {
  if (recovery >= 60) return 'border-l-4 border-l-red-500';
  if (recovery >= 40) return 'border-l-4 border-l-orange-500';
  return 'border-l-4 border-l-yellow-500';
}

function getRecoveryBadge(recovery: number, icon: string) {
  if (recovery >= 60) {
    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm">
        {recovery}% recovery
      </span>
    );
  }
  if (recovery >= 40) {
    return (
      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
        {recovery}% recovery
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
      {recovery}% recovery
    </span>
  );
}

export default function Demo2Page() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLeak, setSelectedLeak] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'impact' | 'severity' | 'trend'>('impact');

  function handleLeakClick(leak: typeof allLeaks[0], action?: 'fix' | 'explain') {
    const latestValue = leak.data[leak.data.length - 1]?.value || 0;
    setSelectedLeak(leak.key);
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: leak.key,
        leak_name: leak.name,
        date: new Date().toISOString(),
        impact: latestValue,
        action: action || 'explain'
      }
    });
  }

  function handleTopLeakAction(leak: typeof topLeaks[0], action: 'fix' | 'explain') {
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: leak.name.toLowerCase().replace(/ /g, '_'),
        leak_name: leak.name,
        date: new Date().toISOString(),
        impact: leak.amount,
        action: action
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
            <a href="/demo" className="block py-2 text-sm hover:text-primary">Dashboard v1</a>
            <a href="/demo2" className="block py-2 text-sm hover:text-primary font-semibold">Dashboard v2</a>
            <a href="#" className="block py-2 text-sm hover:text-primary">Analytics</a>
            <a href="#" className="block py-2 text-sm hover:text-primary">Settings</a>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-[1200px] mx-auto pt-16 pb-8 px-6">

          {/* STEP 1: HERO SECTION - 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {/* Current Revenue */}
            <div className="bg-white p-5 transition-all hover:shadow-lg" style={{ border: '1px solid #e5e7eb' }}>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">Current Revenue</div>
              <div className="text-[36px] font-bold leading-none mb-2 tracking-tight" style={{ color: '#111827' }}>
                ${summary.currentRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Last 30 Days</div>
            </div>

            {/* Revenue Opportunity (Lost) - CRITICAL */}
            <div className="bg-white p-5 relative overflow-hidden transition-all hover:shadow-2xl" style={{ border: '1px solid #ef4444', borderLeft: '4px solid #ef4444' }}>
              <div className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: '#dc2626' }}>
                CRITICAL
              </div>
              <div className="text-xs uppercase tracking-wide font-medium mb-2" style={{ color: '#dc2626' }}>Revenue Opportunity</div>
              <div className="text-[36px] font-bold leading-none mb-2 tracking-tight" style={{ color: '#ef4444' }}>
                ${summary.opportunity.toLocaleString()}
              </div>
              <div className="text-xs font-medium" style={{ color: '#dc2626' }}>
                {summary.percentageLost}% revenue lost
              </div>
            </div>

            {/* Potential Revenue */}
            <div className="bg-white p-5 transition-all hover:shadow-lg" style={{ border: '1px solid #10b981', borderLeft: '4px solid #10b981' }}>
              <div className="text-xs uppercase tracking-wide font-medium mb-2" style={{ color: '#059669' }}>Potential Revenue</div>
              <div className="text-[36px] font-bold leading-none mb-2 tracking-tight" style={{ color: '#10b981' }}>
                ${summary.potentialRevenue.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: '#059669' }}>With fixes applied</div>
            </div>
          </div>

          {/* STEP 2: TOP REVENUE LEAKS (Top 4) */}
          <div className="mb-12">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>Top Revenue Leaks</h2>
              <p className="text-xs" style={{ color: '#6b7280' }}>Areas with the highest revenue recovery potential</p>
            </div>

            <div className="space-y-2">
              {topLeaks.map((leak, idx) => (
                <div
                  key={leak.name}
                  className={`bg-white flex items-center justify-between p-4 hover:shadow-md transition-all group ${getSeverityColor(leak.percentage)}`}
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-0.5" style={{ color: '#111827' }}>{leak.name}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>
                        {leak.percentage}% recovery potential
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>
                        ${leak.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500">potential recovery</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        onClick={() => handleTopLeakAction(leak, 'fix')}
                        className="bg-black text-white hover:bg-gray-800 text-xs h-7"
                      >
                        Fix This
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTopLeakAction(leak, 'explain')}
                        className="text-xs h-7"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: ALL LEAK CATEGORIES GRID (11 cards) */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>All Leak Categories</h2>
                <p className="text-xs" style={{ color: '#6b7280' }}>Click any category to see detailed analysis</p>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-2 py-1 text-[11px] font-medium transition-all ${sortBy === 'impact' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  style={sortBy !== 'impact' ? { border: '1px solid #e5e7eb' } : {}}
                  onClick={() => setSortBy('impact')}
                >
                  By Impact
                </button>
                <button
                  className={`px-2 py-1 text-[11px] font-medium transition-all ${sortBy === 'severity' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  style={sortBy !== 'severity' ? { border: '1px solid #e5e7eb' } : {}}
                  onClick={() => setSortBy('severity')}
                >
                  By Severity
                </button>
                <button
                  className={`px-2 py-1 text-[11px] font-medium transition-all ${sortBy === 'trend' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  style={sortBy !== 'trend' ? { border: '1px solid #e5e7eb' } : {}}
                  onClick={() => setSortBy('trend')}
                >
                  By Trend
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {allLeaks.map((leak) => (
                <MiniSparkline
                  key={leak.key}
                  domain={leak.name}
                  data={leak.data}
                  onClick={() => handleLeakClick(leak)}
                  isSelected={selectedLeak === leak.key}
                />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Sherlock AI Sidebar */}
      <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-muted/30 p-3 overflow-hidden flex-shrink-0 max-h-[40vh] lg:max-h-full scrollbar-hide">
        <SherlockPanel context={sherlockContext} />
      </aside>

    </div>
  )
}
