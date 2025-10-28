'use client';

import { SherlockPanel } from "@/components/SherlockPanel"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, ArrowRight, TrendingDown } from "lucide-react"

const leakData = [
  {
    name: "Cart Abandonment",
    amount: 89234,
    daily: 2974,
    context: "241 of 387 customers abandoned their carts yesterday",
    primaryCause: "Unexpected shipping costs at checkout",
    quickFix: "Display shipping costs earlier in the flow",
    timeToFix: "15 min",
    stores: 127
  },
  {
    name: "Low Average Order Value",
    amount: 67892,
    daily: 2263,
    context: "Average order: $47. Similar stores: $72",
    primaryCause: "No cross-sell or bundling",
    quickFix: "Add product recommendations at checkout",
    timeToFix: "30 min",
    stores: 94
  },
  {
    name: "Mobile Checkout Friction",
    amount: 54123,
    daily: 1804,
    context: "62% of mobile users abandon at payment step",
    primaryCause: "Form too complex for mobile",
    quickFix: "Simplify mobile checkout to 3 steps",
    timeToFix: "45 min",
    stores: 103
  },
];

export default function Demo5Page() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLeak, setSelectedLeak] = useState<string | null>(null);

  function handleLeakClick(leak: typeof leakData[0]) {
    setSelectedLeak(leak.name);
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: leak.name.toLowerCase().replace(/ /g, '_'),
        leak_name: leak.name,
        date: new Date().toISOString(),
        impact: leak.amount,
        context: leak.context,
        primaryCause: leak.primaryCause,
        quickFix: leak.quickFix,
        action: 'explain'
      }
    });
  }

  const totalMonthly = leakData.reduce((sum, leak) => sum + leak.amount, 0);
  const totalDaily = leakData.reduce((sum, leak) => sum + leak.daily, 0);
  const currentRevenue = 450000;
  const potentialRevenue = currentRevenue + totalMonthly;

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden relative bg-white">

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
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
        className={`fixed inset-y-0 left-0 w-[70%] sm:w-[50%] lg:w-[20%] bg-white border-r z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <nav className="space-y-2">
            <a href="/demo" className="block py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard v1</a>
            <a href="/demo2" className="block py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard v2</a>
            <a href="/demo4" className="block py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard v4</a>
            <a href="/demo5" className="block py-2 text-sm font-semibold text-gray-900">Dashboard v5 - Final</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide">
        <div className="max-w-[1000px] mx-auto pt-20 pb-12 px-6">

          {/* Executive Summary */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-gray-200">
              <TrendingDown className="h-7 w-7 text-orange-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Revenue leak: ${totalMonthly.toLocaleString()}/month
                </h1>
                <p className="text-lg text-gray-700 mb-2">
                  Your store is losing <span className="font-semibold text-gray-900">${totalDaily.toLocaleString()} every day</span> to three fixable issues.
                </p>
                <p className="text-base text-gray-600">
                  Combined fix time: ~90 minutes. {leakData[0].stores + leakData[1].stores + leakData[2].stores} similar stores have already addressed these.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Current MRR</div>
                <div className="text-2xl font-bold text-gray-900 mb-3">${currentRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mb-1">Potential MRR</div>
                <div className="text-2xl font-bold text-green-600">${potentialRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Revenue Opportunities */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue opportunities</h2>

            <div className="space-y-3">
              {leakData.map((leak, idx) => (
                <div
                  key={leak.name}
                  className={`bg-white border rounded-lg hover:shadow-lg transition-all cursor-pointer ${
                    selectedLeak === leak.name ? 'border-gray-900 shadow-lg' : 'border-gray-200'
                  }`}
                  onClick={() => handleLeakClick(leak)}
                >
                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center w-7 h-7 rounded bg-gray-100 text-gray-700 text-sm font-semibold mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{leak.name}</h3>
                          <p className="text-sm text-gray-600">{leak.context}</p>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-gray-900 mb-0.5">
                          ${leak.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">${leak.daily}/day</div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Primary cause</div>
                        <div className="text-sm font-medium text-gray-900">{leak.primaryCause}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Quick fix</div>
                        <div className="text-sm font-medium text-gray-900">{leak.quickFix}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Implementation</div>
                        <div className="text-sm font-medium text-gray-900">{leak.timeToFix} · {leak.stores} stores fixed this</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                      <button
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeakClick(leak);
                        }}
                      >
                        Get implementation guide <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Context */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Industry context</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Stores in your segment that addressed these issues</div>
                <div className="text-2xl font-bold text-gray-900">{leakData[0].stores + leakData[1].stores + leakData[2].stores}</div>
                <div className="text-xs text-gray-500 mt-1">in the last 30 days</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Average revenue increase after fixes</div>
                <div className="text-2xl font-bold text-green-600">+$64,200/mo</div>
                <div className="text-xs text-gray-500 mt-1">median across similar stores</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sherlock Sidebar */}
      <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-gray-50 p-4 overflow-hidden flex-shrink-0 max-h-[40vh] lg:max-h-full scrollbar-hide">
        <SherlockPanel context={sherlockContext} />
      </aside>

    </div>
  )
}
