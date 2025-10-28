'use client';

import { SherlockPanel } from "@/components/SherlockPanel"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, ArrowRight, AlertCircle } from "lucide-react"

const topLeaks = [
  {
    name: "Cart Abandonment",
    amount: 89234,
    percentage: 62,
    context: "241 customers added items to cart yesterday but didn't complete checkout",
    why: "Unexpected shipping costs",
    fix: "Show shipping estimate before checkout"
  },
  {
    name: "Low Average Order",
    amount: 67892,
    percentage: 48,
    context: "Your average order is $47, but customers browsing similar items spend $72",
    why: "No product recommendations",
    fix: "Add 'frequently bought together' suggestions"
  },
  {
    name: "Mobile Checkout",
    amount: 54123,
    percentage: 38,
    context: "6 out of 10 mobile users abandon at the payment step",
    why: "Form is difficult on mobile",
    fix: "Simplify mobile checkout flow"
  },
];

export default function Demo4Page() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLeak, setSelectedLeak] = useState<string | null>(null);

  function handleLeakClick(leak: typeof topLeaks[0]) {
    setSelectedLeak(leak.name);
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: leak.name.toLowerCase().replace(/ /g, '_'),
        leak_name: leak.name,
        date: new Date().toISOString(),
        impact: leak.amount,
        context: leak.context,
        why: leak.why,
        fix: leak.fix,
        action: 'explain'
      }
    });
  }

  const totalLoss = topLeaks.reduce((sum, leak) => sum + leak.amount, 0);
  const dailyLoss = Math.round(totalLoss / 30);

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
            <a href="/demo3" className="block py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard v3</a>
            <a href="/demo4" className="block py-2 text-sm font-semibold text-gray-900">Dashboard v4</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide">
        <div className="max-w-[900px] mx-auto pt-20 pb-12 px-6">

          {/* Hero - Clear, Direct, Human */}
          <div className="mb-12">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  You're losing ${totalLoss.toLocaleString()} every month
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  That's about ${dailyLoss.toLocaleString()} per day from these three issues.
                </p>
                <p className="text-base text-gray-600">
                  The good news? All of them are fixable in less than an hour.
                </p>
              </div>
            </div>
          </div>

          {/* Top Issues - Story Format */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Where the money is going</h2>

            <div className="space-y-4">
              {topLeaks.map((leak, idx) => (
                <div
                  key={leak.name}
                  className={`p-6 bg-white border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    selectedLeak === leak.name ? 'border-gray-900 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => handleLeakClick(leak)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{leak.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {leak.context}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${leak.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>

                  {/* Details on Hover */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Why it's happening</div>
                        <div className="text-gray-900">{leak.why}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">How to fix it</div>
                        <div className="text-gray-900">{leak.fix}</div>
                      </div>
                    </div>
                    <button
                      className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeakClick(leak);
                      }}
                    >
                      Show me how to fix this <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Currently making</div>
              <div className="text-2xl font-bold text-gray-900">$450K</div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm text-orange-700 mb-1">Losing to these issues</div>
              <div className="text-2xl font-bold text-orange-600">${totalLoss.toLocaleString()}</div>
              <div className="text-xs text-orange-600">per month</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 mb-1">Potential with fixes</div>
              <div className="text-2xl font-bold text-green-600">$661K</div>
              <div className="text-xs text-green-600">per month</div>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to fix these?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Click any issue above to get step-by-step instructions from Sherlock. Most fixes take less than 30 minutes.
            </p>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start with Cart Abandonment
              </Button>
              <Button variant="outline">
                See all recommendations
              </Button>
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
