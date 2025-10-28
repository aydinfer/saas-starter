'use client';

import { SherlockPanel } from "@/components/SherlockPanel"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

const weeklyLosses = [
  { day: 'Monday', amount: 4200, percentage: 70, issue: 'Cart abandonment spike at 3pm' },
  { day: 'Tuesday', amount: 3800, percentage: 63, issue: 'Mobile checkout failed' },
  { day: 'Wednesday', amount: 5100, percentage: 85, issue: 'Shipping cost shock' },
  { day: 'Thursday', amount: 2900, percentage: 48, issue: '' },
  { day: 'Friday', amount: 6400, percentage: 100, issue: 'Weekend traffic, slow site' },
  { day: 'Saturday', amount: 4100, percentage: 68, issue: '' },
  { day: 'Sunday', amount: 3700, percentage: 62, issue: '' },
];

const bosses = [
  {
    name: 'Cart Abandonment',
    amount: 89234,
    level: 3,
    maxLevel: 5,
    nextQuest: 'Add exit-intent popup',
    timeToComplete: '15 minutes',
    expectedLoot: 12000,
    stats: { attempted: 387, abandoned: 241 }
  },
  {
    name: 'Low AOV',
    amount: 67892,
    level: 1,
    maxLevel: 5,
    nextQuest: 'Add product recommendations',
    timeToComplete: '30 minutes',
    expectedLoot: 8500,
    stats: { avgOrder: 47, targetOrder: 72 }
  },
  {
    name: 'Poor Conversion',
    amount: 54123,
    level: 2,
    maxLevel: 5,
    nextQuest: 'Optimize product pages',
    timeToComplete: '45 minutes',
    expectedLoot: 7200,
    stats: { visitors: 12450, converted: 186 }
  },
];

export default function Demo3Page() {
  const [sherlockContext, setSherlockContext] = useState<{
    type: 'revenue_leak' | 'channel' | 'none';
    data?: any;
  }>({ type: 'none' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveHourlyLoss, setLiveHourlyLoss] = useState(204);
  const [liveDailyLoss, setLiveDailyLoss] = useState(4891);
  const [liveWeeklyLoss, setLiveWeeklyLoss] = useState(34267);

  // Simulate real-time loss ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHourlyLoss(prev => prev + Math.floor(Math.random() * 3) + 1);
      setLiveDailyLoss(prev => prev + Math.floor(Math.random() * 5) + 2);
      setLiveWeeklyLoss(prev => prev + Math.floor(Math.random() * 10) + 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function handleBossClick(boss: typeof bosses[0]) {
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: boss.name.toLowerCase().replace(/ /g, '_'),
        leak_name: boss.name,
        date: new Date().toISOString(),
        impact: boss.amount,
        action: 'fix',
        emotional: true
      }
    });
  }

  function handleDayClick(day: typeof weeklyLosses[0]) {
    setSherlockContext({
      type: 'revenue_leak',
      data: {
        leak_type: 'daily_analysis',
        leak_name: `${day.day} Loss Analysis`,
        date: new Date().toISOString(),
        impact: day.amount,
        issue: day.issue,
        emotional: true
      }
    });
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden relative" style={{ backgroundColor: '#0a0a0a' }}>

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
        className={`fixed inset-y-0 left-0 w-[70%] sm:w-[50%] lg:w-[20%] bg-black/95 backdrop-blur-sm border-r border-gray-800 z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4 text-white">Menu</h2>
          <nav className="space-y-2">
            <a href="/demo" className="block py-2 text-sm text-gray-400 hover:text-white">Dashboard v1</a>
            <a href="/demo2" className="block py-2 text-sm text-gray-400 hover:text-white">Dashboard v2</a>
            <a href="/demo3" className="block py-2 text-sm font-semibold text-white">Dashboard v3 - Emotional</a>
            <a href="#" className="block py-2 text-sm text-gray-400 hover:text-white">Settings</a>
          </nav>
        </div>
      </div>

      {/* Live Loss Tracker - Fixed Top Right */}
      <div className="fixed top-4 right-[420px] z-40 bg-gradient-to-br from-red-950 to-red-900 border border-red-700 p-4 rounded-lg shadow-2xl animate-pulse" style={{ width: '280px' }}>
        <div className="text-xs font-bold text-red-200 mb-2 flex items-center gap-2">
          ⏰ LIVE LOSS TRACKER
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-red-300">Lost in last hour:</span>
            <span className="font-bold text-white">${liveHourlyLoss}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-300">Lost today:</span>
            <span className="font-bold text-white">${liveDailyLoss.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-300">Lost this week:</span>
            <span className="font-bold text-white">${liveWeeklyLoss.toLocaleString()}</span>
          </div>
        </div>
        <Button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
          Stop The Bleeding →
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full scrollbar-hide">
        <div className="max-w-[1200px] mx-auto pt-16 pb-8 px-6">

          {/* HERO - The Uncomfortable Truth */}
          <div className="text-center mb-16 py-12 px-8 bg-gradient-to-br from-red-950 to-gray-900 border-4 border-red-800 rounded-lg shadow-2xl">
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
              You're losing $147,000 every month
            </h1>
            <p className="text-2xl text-red-300 mb-6">
              That's <span className="text-red-400 font-bold">$4,900 every single day</span> you wait
            </p>
            <div className="max-w-2xl mx-auto mb-6">
              <div className="h-8 bg-gray-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 absolute left-0 top-0"
                  style={{ width: '32.7%' }}
                >
                  <div className="h-full w-full bg-red-400 animate-pulse opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  32.7% of revenue lost
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-300 italic">
              What would you do with an extra $147K/month?
            </p>
          </div>

          {/* Top Leaks - Story Format */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-white">The Money You Almost Had</h2>

            <div className="space-y-6">
              {bosses.map((boss, idx) => (
                <div
                  key={boss.name}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-700 p-6 rounded-lg hover:border-yellow-600 transition-all cursor-pointer group"
                  onClick={() => handleBossClick(boss)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-yellow-500 mb-2">{idx === 0 ? '🛒' : idx === 1 ? '💰' : '📊'} {boss.name}</h3>
                      {idx === 0 && (
                        <p className="text-gray-300 mb-2">
                          <span className="font-bold text-white">{boss.stats.attempted} people</span> added items to their cart yesterday.
                        </p>
                      )}
                      {idx === 0 && (
                        <p className="text-gray-300 mb-2">
                          <span className="font-bold text-red-400">{boss.stats.abandoned} of them left</span> without buying.
                        </p>
                      )}
                      <p className="text-xl text-yellow-400 font-bold mt-3">
                        That's ${boss.amount.toLocaleString()} you almost had.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-yellow-500">${boss.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold">
                      → Here's why they left
                    </button>
                    <button className="text-sm text-green-400 hover:text-green-300 font-semibold">
                      → Here's how to get them back
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leak Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-2 text-white">Last 7 Days - Where You Lost Money</h2>
            <p className="text-gray-400 mb-6">Click any day to see what broke</p>

            <div className="space-y-3">
              {weeklyLosses.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-gray-900 p-3 rounded transition-all"
                  onClick={() => handleDayClick(day)}
                >
                  <div className="w-24 text-sm font-semibold text-gray-400">{day.day}</div>
                  <div className="flex-1 h-10 bg-gray-800 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all group-hover:from-red-600 group-hover:to-red-400"
                      style={{ width: `${day.percentage}%` }}
                    />
                  </div>
                  <div className="w-32 text-right">
                    <div className="text-lg font-bold text-red-400">${day.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">lost</div>
                  </div>
                  {day.issue && (
                    <div className="w-64 text-xs text-gray-400">({day.issue})</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-950 border border-yellow-700 rounded-lg">
              <p className="text-yellow-400 font-semibold">⚠️ Your biggest leak happens Friday 2-6pm</p>
              <button className="text-sm text-yellow-300 hover:text-yellow-200 mt-1">
                ↳ Let me show you what's breaking
              </button>
            </div>
          </div>

          {/* Social Proof / FOMO */}
          <div className="mb-16 bg-gradient-to-br from-blue-950 to-gray-900 border-2 border-blue-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              🏆 Stores Like Yours Are Fixing This
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              <span className="font-bold text-white">127 stores your size</span> fixed cart abandonment this month
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Average revenue increase: <span className="font-bold text-green-400">$64,000/month</span>
            </p>
            <p className="text-xl text-red-400 font-bold mb-2">
              You're leaving $89K on the table.
            </p>
            <p className="text-xl text-white font-bold mb-6">
              They're not.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Show Me What They Did
            </Button>
          </div>

          {/* Boss Battle UI */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
              ⚔️ YOUR REVENUE RECOVERY QUEST
            </h2>

            <div className="space-y-4">
              {bosses.map((boss, idx) => (
                <div
                  key={boss.name}
                  className="bg-gradient-to-r from-purple-950 to-gray-900 border-2 border-purple-700 p-6 rounded-lg hover:border-purple-500 transition-all cursor-pointer"
                  onClick={() => handleBossClick(boss)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-300">
                        BOSS #{idx + 1}: {boss.name}
                      </h3>
                    </div>
                    <div className="text-2xl font-black text-yellow-500">
                      💰 ${boss.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Level {boss.level}/{boss.maxLevel}</span>
                      <span className="text-gray-400">{Math.round((boss.level / boss.maxLevel) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                        style={{ width: `${(boss.level / boss.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Next Quest:</span> {boss.nextQuest}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Time to complete:</span> {boss.timeToComplete}
                    </p>
                    <p className="text-sm text-green-400 font-bold">
                      Expected loot: +${boss.expectedLoot.toLocaleString()}/month
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                      Start Quest
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Skip for Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Tracker */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-950 to-gray-900 border-2 border-green-700 rounded-lg">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">YOUR POWER LEVEL</div>
                  <div className="text-3xl font-black text-green-400">$23,400</div>
                  <div className="text-xs text-gray-500">recovered</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">NEXT MILESTONE</div>
                  <div className="text-3xl font-black text-yellow-400">$50,000</div>
                  <div className="text-xs text-gray-500">unlock: Advanced Strategies</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">STREAK</div>
                  <div className="text-3xl font-black text-orange-400">3 days</div>
                  <div className="text-xs text-gray-500">fixing leaks</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sherlock Sidebar */}
      <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-800 bg-black p-3 overflow-hidden flex-shrink-0 max-h-[40vh] lg:max-h-full scrollbar-hide">
        <SherlockPanel context={sherlockContext} />
      </aside>

    </div>
  )
}
