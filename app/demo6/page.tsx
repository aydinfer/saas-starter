'use client';

import { SherlockPanel } from "@/components/SherlockPanel"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Menu, ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react"
import type { PriorityFix, CompletedFix } from "@/lib/types/dashboard"

// Fallback data for when API is not available
const FALLBACK_FIXES: PriorityFix[] = [
  {
    id: 1,
    name: "Cart Abandonment Recovery",
    currentImpact: 89234,
    recoveryPotential: 55325,
    recoveryPercentage: 62,
    timeRequired: "15 minutes",
    roi: 3688,
    customers: { total: 387, abandoned: 241 },
    primaryCause: "Unexpected shipping costs at checkout",
    fix: "Show shipping estimate earlier in funnel",
    steps: [
      { name: "Install exit-intent popup", done: true },
      { name: "Configure trigger conditions", done: true },
      { name: "Design offer (10% discount)", done: true },
      { name: "A/B test setup", done: false, time: "5 min" },
      { name: "Deploy to production", done: false, time: "5 min" }
    ]
  },
  {
    id: 2,
    name: "Average Order Value Optimization",
    currentImpact: 67892,
    recoveryPotential: 32588,
    recoveryPercentage: 48,
    timeRequired: "30 minutes",
    roi: 1086,
    customers: { avgOrder: 47, targetOrder: 72 },
    primaryCause: "No product recommendations or bundles",
    fix: "Add cross-sell recommendations at checkout",
    steps: []
  },
  {
    id: 3,
    name: "Mobile Checkout Optimization",
    currentImpact: 54123,
    recoveryPotential: 20567,
    recoveryPercentage: 38,
    timeRequired: "45 minutes",
    roi: 457,
    customers: { total: 1000, abandoned: 620 },
    primaryCause: "Form too complex for mobile devices",
    fix: "Simplify mobile checkout to 3 steps",
    steps: []
  }
];

const FALLBACK_COMPLETED: CompletedFix[] = [
  { name: "Mobile Checkout Optimization", impact: 4200, time: "18 min" },
  { name: "Product Recommendation Engine", impact: 3100, time: "22 min" },
  { name: "Trust Badge Implementation", impact: 1800, time: "7 min" }
];

export default function Demo6Page() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [priorityFixes, setPriorityFixes] = useState<PriorityFix[]>(FALLBACK_FIXES);
  const [completedFixes, setCompletedFixes] = useState<CompletedFix[]>(FALLBACK_COMPLETED);
  const [dataSource, setDataSource] = useState<'api' | 'fallback'>('fallback');

  // Fetch real data from API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // TODO: Get actual user_id and organization_id from auth context
        const user_id = 'demo-user-123';
        const organization_id = 'demo-org-456';

        // Fetch cart abandonment analysis
        const response = await fetch('/api/cart-abandonment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: organization_id,
            analysisType: 'comprehensive',
            storeAnalytics: {
              monthlyRevenue: 450000,
              averageOrderValue: 75,
              conversionRate: 2.5,
              cartAbandonmentRate: 68,
              mobileTrafficPercentage: 60
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (data.success && data.analysis_result) {
          // Transform API data to match UI format
          const transformedFixes: PriorityFix[] = data.analysis_result.recovery_opportunities
            .slice(0, 3)
            .map((opportunity: any, index: number) => ({
              id: index + 1,
              name: opportunity.strategy,
              currentImpact: Math.round(opportunity.estimated_monthly_recovery / (opportunity.recovery_potential_percentage / 100)),
              recoveryPotential: opportunity.estimated_monthly_recovery,
              recoveryPercentage: opportunity.recovery_potential_percentage,
              timeRequired: opportunity.implementation_time,
              roi: Math.round(opportunity.estimated_monthly_recovery / parseInt(opportunity.implementation_time)),
              customers: { total: 387, abandoned: 241 }, // TODO: Get from real data
              primaryCause: data.analysis_result.primary_causes[index]?.cause || "Unknown",
              fix: opportunity.strategy,
              steps: []
            }));

          setPriorityFixes(transformedFixes);
          setDataSource('api');
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep fallback data
        setDataSource('fallback');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  function handleFixClick(fix: typeof priorityFixes[0]) {
    setSelectedFix(fix.id);
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: fix.name.toLowerCase().replace(/ /g, '_'),
        leak_name: fix.name,
        date: new Date().toISOString(),
        impact: fix.currentImpact,
        recoveryPotential: fix.recoveryPotential,
        primaryCause: fix.primaryCause,
        fix: fix.fix,
        action: 'explain'
      }
    });
  }

  const totalLoss = priorityFixes.reduce((sum, fix) => sum + fix.currentImpact, 0);
  const totalRecoverable = priorityFixes.reduce((sum, fix) => sum + fix.recoveryPotential, 0);
  const dailyLoss = Math.round(totalLoss / 30);
  const currentRevenue = 450000;
  const completedRecovery = completedFixes.reduce((sum, fix) => sum + fix.impact, 0);
  const totalTimeInvested = completedFixes.reduce((sum, fix) => sum + parseInt(fix.time), 0);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden relative" style={{ backgroundColor: '#0f1419' }}>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-0 left-0 z-50 bg-[#c084fc] hover:bg-[#c084fc]/90 text-white rounded-none h-12 w-12"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Menu Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-[70%] sm:w-[50%] lg:w-[20%] bg-[#0f1419] border-r border-gray-800 z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4 text-white">Menu</h2>
          <nav className="space-y-2">
            <a href="/demo2" className="block py-2 text-sm text-gray-400 hover:text-white">Dashboard v2</a>
            <a href="/demo4" className="block py-2 text-sm text-gray-400 hover:text-white">Dashboard v4</a>
            <a href="/demo5" className="block py-2 text-sm text-gray-400 hover:text-white">Dashboard v5</a>
            <a href="/demo6" className="block py-2 text-sm font-semibold text-white">Dashboard v6 - Professional</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide">
        <div className="max-w-[1100px] mx-auto pt-20 pb-12 px-6">

          {/* Data Source Badge */}
          <div className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-gray-400">Data Source:</span>
            {loading ? (
              <span className="flex items-center gap-1 text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </span>
            ) : (
              <span className={`px-2 py-1 rounded ${
                dataSource === 'api'
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-orange-900/50 text-orange-400'
              }`}>
                {dataSource === 'api' ? '✓ Live Analysis' : '⚠ Demo Data'}
              </span>
            )}
          </div>

          {/* Reality Check Section */}
          <div className="mb-12 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-white mb-3">
                ${totalLoss.toLocaleString()} in monthly revenue at risk
              </h1>
              <p className="text-xl text-gray-300">
                That's <span className="font-semibold text-white">${dailyLoss.toLocaleString()} per day</span> ({((totalLoss / currentRevenue) * 100).toFixed(1)}% of revenue)
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-6">
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${((totalLoss / currentRevenue) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>${currentRevenue.toLocaleString()} current</span>
                <span>${(currentRevenue + totalRecoverable).toLocaleString()} potential</span>
              </div>
            </div>

            <p className="text-center text-gray-300 mb-4">
              Identified 3 fixable issues with implementation time under 2 hours total
            </p>

            <div className="text-center">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                View Prioritized Action Plan
              </Button>
            </div>
          </div>

          {/* Priority Fixes */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">Priority Fixes</h2>
            <p className="text-gray-400 mb-6">Ranked by ROI and implementation complexity</p>

            <div className="space-y-4">
              {priorityFixes.map((fix) => (
                <div
                  key={fix.id}
                  className={`bg-gray-900 border rounded-lg hover:border-gray-600 transition-all cursor-pointer ${
                    selectedFix === fix.id ? 'border-white' : 'border-gray-700'
                  }`}
                  onClick={() => handleFixClick(fix)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded bg-gray-800 text-gray-300 text-sm font-semibold">
                            {fix.id}
                          </span>
                          <h3 className="text-xl font-semibold text-white">{fix.name}</h3>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-white mb-1">
                          ${fix.currentImpact.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">monthly loss</div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-800">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Recovery Potential</div>
                        <div className="text-lg font-bold text-green-400">
                          {fix.recoveryPercentage}% (${fix.recoveryPotential.toLocaleString()}/mo)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Implementation</div>
                        <div className="text-lg font-semibold text-white">{fix.timeRequired}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">ROI</div>
                        <div className="text-lg font-semibold text-yellow-400">
                          ${fix.roi.toLocaleString()}/min
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Impact</div>
                        <div className="text-lg font-semibold text-white">
                          {fix.id === 1 ? `${fix.customers.abandoned}/${fix.customers.total}` :
                           fix.id === 2 ? `$${fix.customers.avgOrder} → $${fix.customers.targetOrder}` :
                           `${fix.customers.abandoned}/${fix.customers.total}`}
                        </div>
                      </div>
                    </div>

                    {/* Issue Details */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Primary Cause</div>
                        <div className="text-sm text-gray-200">{fix.primaryCause}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Fix</div>
                        <div className="text-sm text-gray-200">{fix.fix}</div>
                      </div>
                    </div>

                    {/* Implementation Progress (if started) */}
                    {fix.steps.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-800 rounded">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-white">Implementation Progress</div>
                          <div className="text-sm text-gray-400">
                            {fix.steps.filter(s => s.done).length} of {fix.steps.length} steps complete
                          </div>
                        </div>
                        <div className="space-y-2">
                          {fix.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              {step.done ? (
                                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                              )}
                              <span className={step.done ? 'text-gray-400 line-through' : 'text-gray-200'}>
                                {step.name}
                              </span>
                              {!step.done && step.time && (
                                <span className="text-gray-500 text-xs ml-auto">({step.time})</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                          Continue Implementation
                        </Button>
                      </div>
                    )}

                    {/* CTA */}
                    {fix.steps.length === 0 && (
                      <div className="flex gap-3 mt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Implementation Plan
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          Ask Sherlock
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed This Week */}
          <div className="p-6 bg-gradient-to-br from-green-950 to-gray-900 border border-green-800 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-4">Completed This Week</h3>
            <div className="space-y-2 mb-4">
              {completedFixes.map((fix, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-200">{fix.name}</span>
                  </div>
                  <span className="text-green-400 font-semibold">+${fix.impact.toLocaleString()}/month</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-green-900 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Total Impact</div>
                <div className="text-xl font-bold text-green-400">
                  ${completedRecovery.toLocaleString()}/month
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Time Invested</div>
                <div className="text-xl font-bold text-white">{totalTimeInvested} minutes</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">ROI</div>
                <div className="text-xl font-bold text-yellow-400">
                  ${Math.round(completedRecovery / totalTimeInvested)}/min
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sherlock Sidebar */}
      <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900 p-4 overflow-hidden flex-shrink-0 max-h-[40vh] lg:max-h-full scrollbar-hide">
        <SherlockPanel context={sherlockContext} />
      </aside>

    </div>
  )
}
