"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SherlockContext {
  type: 'revenue_leak' | 'channel' | 'none';
  data?: any;
}

interface Props {
  context: SherlockContext;
}

export function SherlockPanel({ context }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When context changes, Sherlock proactively explains what user clicked
  useEffect(() => {
    if (context.type === 'none') return;

    let contextMessage = '';

    if (context.type === 'revenue_leak' && context.data) {
      const { leak_type, impact, date } = context.data;
      const leakName = leak_type.replace(/_/g, ' ').toUpperCase();

      contextMessage = `I see you clicked on **${leakName}** on ${new Date(date).toLocaleDateString()}.\n\n` +
        `This leak had an estimated impact of **$${impact.toLocaleString()}**.\n\n` +
        `Let me explain what's causing this:\n\n` +
        getLeakExplanation(leak_type, impact);
    } else if (context.type === 'channel' && context.data) {
      const { channel, sessions, conversions, revenue } = context.data;
      const convRate = ((conversions / sessions) * 100).toFixed(2);

      contextMessage = `You selected **${channel}**.\n\n` +
        `**Performance:**\n` +
        `- Sessions: ${sessions.toLocaleString()}\n` +
        `- Conversions: ${conversions.toLocaleString()}\n` +
        `- Revenue: $${revenue.toLocaleString()}\n` +
        `- Conversion Rate: ${convRate}%\n\n` +
        getChannelInsights(channel, parseFloat(convRate), sessions, conversions);
    }

    if (contextMessage) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: contextMessage,
        timestamp: new Date()
      }]);
    }
  }, [context]);

  function getLeakExplanation(leakType: string, impact: number): string {
    const explanations: Record<string, string> = {
      cart_abandonment: `**Why this happens:**\n- Unexpected shipping costs at checkout\n- Complex checkout process (too many steps)\n- No guest checkout option\n- Lack of trust signals\n\n**How to fix:**\n1. Show total price early in the funnel\n2. Offer free shipping threshold\n3. Reduce checkout to 2 steps max\n4. Add trust badges and security seals`,

      mobile_ux: `**Why this happens:**\n- Slow mobile page load (>3s)\n- Buttons too small to tap\n- Forms not optimized for mobile\n- Images not responsive\n\n**How to fix:**\n1. Compress images and lazy load\n2. Increase button tap targets to 44x44px\n3. Use mobile-first form design\n4. Test on real devices`,

      pricing_gap: `**Why this happens:**\n- Competitors offering better prices\n- No value proposition clarity\n- Missing discount/promotion visibility\n\n**How to fix:**\n1. Run competitive price analysis\n2. Highlight unique value (not just price)\n3. Show savings clearly\n4. Consider dynamic pricing`,

      poor_conversion: `**Why this happens:**\n- Landing page doesn't match ad promise\n- Weak call-to-action\n- Too many choices (paradox of choice)\n- Slow page load\n\n**How to fix:**\n1. A/B test different CTAs\n2. Reduce product options per page\n3. Match landing page to ad copy exactly\n4. Optimize page speed`,

      social_gap: `**Why this happens:**\n- Weak social proof (reviews/testimonials)\n- No user-generated content\n- Missing social share incentives\n\n**How to fix:**\n1. Add customer reviews prominently\n2. Create Instagram hashtag campaign\n3. Offer referral discounts\n4. Show real-time purchase notifications`,

      trust_signals: `**Why this happens:**\n- Missing security badges\n- No clear return policy\n- Anonymous brand (no about us)\n- Poor customer service visibility\n\n**How to fix:**\n1. Add SSL badge and payment icons\n2. Show 30-day return policy prominently\n3. Add team photos and story\n4. Live chat or phone number visible`,

      checkout_friction: `**Why this happens:**\n- Too many form fields\n- Account creation required\n- No auto-fill support\n- Hidden fees appearing late\n\n**How to fix:**\n1. Enable guest checkout\n2. Reduce fields to essential only\n3. Support Apple Pay / Google Pay\n4. Show all fees upfront`,

      seo_issues: `**Why this happens:**\n- Poor organic rankings\n- Missing meta descriptions\n- Slow site speed\n- No backlinks\n\n**How to fix:**\n1. Optimize title tags and meta descriptions\n2. Build quality backlinks\n3. Create content targeting long-tail keywords\n4. Fix technical SEO issues`,

      product_optimization: `**Why this happens:**\n- Poor product images\n- Missing product details\n- No size/fit guidance\n- Weak product descriptions\n\n**How to fix:**\n1. Use high-res images with zoom\n2. Add video demonstrations\n3. Include size charts and fit guides\n4. Write benefit-focused copy`,

      personalization: `**Why this happens:**\n- Generic experience for all visitors\n- No product recommendations\n- Cart abandonment emails missing\n\n**How to fix:**\n1. Implement product recommendation engine\n2. Show "customers also bought"\n3. Send cart abandonment emails (3-hour delay)\n4. Personalize homepage based on behavior`,

      performance: `**Why this happens:**\n- Slow page load time (>3s)\n- Unoptimized images\n- Too many third-party scripts\n- No CDN\n\n**How to fix:**\n1. Compress and lazy-load images\n2. Use CDN for static assets\n3. Minimize JavaScript\n4. Enable browser caching`
    };

    return explanations[leakType] || `This is a **${leakType.replace(/_/g, ' ')}** issue with $${impact.toLocaleString()} in revenue at risk.\n\nAsk me specific questions about this leak and I'll help you understand what's causing it and how to fix it.`;
  }

  function getChannelInsights(channel: string, convRate: number, sessions: number, conversions: number): string {
    let insights = '';

    // Benchmark conversion rates by channel
    const benchmarks: Record<string, number> = {
      'Google Ads': 3.75,
      'Facebook': 2.5,
      'Instagram': 1.8,
      'TikTok': 2.2,
      'Organic Search': 4.5,
      'Email': 5.0,
      'Direct': 4.0
    };

    const benchmark = benchmarks[channel] || 3.0;
    const gap = benchmark - convRate;

    if (gap > 1) {
      insights = `⚠️ **${channel} is underperforming.**\n\n` +
        `Your conversion rate (${convRate}%) is **${gap.toFixed(1)}%** below the ${channel} benchmark (${benchmark}%).\n\n` +
        `**Potential issues:**\n` +
        `- Landing page doesn't match ad promise\n` +
        `- Wrong audience targeting\n` +
        `- Poor mobile experience (if mobile traffic)\n` +
        `- Weak call-to-action\n\n` +
        `**Revenue opportunity:** If you reach benchmark conversion rate, you could generate an additional **$${Math.round((sessions * (benchmark / 100) - conversions) * 120).toLocaleString()}** in revenue.`;
    } else if (gap > 0) {
      insights = `✅ **${channel} is performing close to benchmark.**\n\n` +
        `Your conversion rate (${convRate}%) is only ${gap.toFixed(1)}% below the ${channel} benchmark (${benchmark}%).\n\n` +
        `Small optimization opportunities:\n` +
        `- A/B test different CTAs\n` +
        `- Optimize product page layout\n` +
        `- Improve page speed\n\n` +
        `**Potential upside:** $${Math.round((sessions * (benchmark / 100) - conversions) * 120).toLocaleString()}`;
    } else {
      insights = `🎉 **${channel} is exceeding expectations!**\n\n` +
        `Your conversion rate (${convRate}%) is **${Math.abs(gap).toFixed(1)}%** above the ${channel} benchmark (${benchmark}%).\n\n` +
        `Keep doing what's working and consider:\n` +
        `- Increasing ad spend on this channel\n` +
        `- Applying similar strategies to other channels\n` +
        `- Documenting what makes this channel successful`;
    }

    return insights;
  }

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, call actual AI API)
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `I understand you're asking: "${input}"\n\nBased on your current data, let me help you with that. (This is a demo response - in production, this would connect to the actual Sherlock AI with real analysis.)`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="h-full flex flex-col bg-gray-900 border-gray-800">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-sm text-white">Sherlock AI</CardTitle>
        <p className="text-xs text-gray-400">
          Click any chart for contextual insights
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-6">
              <p className="mb-1">👋 Hi! I'm Sherlock.</p>
              <p>Click on any chart element and I'll explain what's happening and how to fix it.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white p-2 rounded ml-6'
                    : 'bg-gray-800 text-gray-200 p-2 rounded mr-6'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Sherlock anything..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
