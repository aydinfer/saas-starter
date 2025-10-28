'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function WaitlistPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="relative bg-[#101412] min-h-screen overflow-hidden">
      {/* Green gradient from top-left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '60vw',
          height: '60vh',
          background: 'radial-gradient(circle at 0% 0%, #1F6343 0%, transparent 70%)',
          opacity: 0.4,
        }}
      />

      {/* Noise ONLY on the green gradient area */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '60vw',
          height: '60vh',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
          opacity: 0.3,
        }}
      />

      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-12 py-8 flex items-center justify-between">
        <div className="text-white text-2xl font-medium">
          Sherlock
        </div>
        <Button
          variant="outline"
          className="border-2 border-[#1A9359] text-[#1A9359] hover:bg-[#1A9359] hover:text-white px-6 py-2 rounded-full transition-all"
          style={{ backgroundColor: 'rgba(26, 147, 89, 0.1)' }}
        >
          Get early access
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-12 relative z-10">
        {/* Main Headline */}
        <h1
          className="text-[140px] font-bold mb-20"
          style={{
            fontFamily: 'Urbanist, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '0.95',
          }}
        >
          Stop <span style={{
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            background: 'none',
            WebkitTextFillColor: '#FF005A',
            color: '#FF005A'
          }}>Losing</span>
          <br />
          Money Every
          <br />
          Single Day
        </h1>

        {/* Subtext */}
        <div className="text-xl text-white leading-relaxed mb-12">
          <span className="text-[#1A9359]">eCommerce </span>
          <span
            style={{
              fontFamily: 'Times New Roman, serif',
              fontStyle: 'italic',
              fontWeight: 'bold',
              color: '#FF005A'
            }}
          >
            friction
          </span>
          <span> is silently draining your revenue.</span>
          <br />
          <span className="text-gray-400">But you have no idea where, when, or how much.</span>
        </div>

        {/* CTA Button */}
        {!isSubmitted ? (
          <div>
            <Button
              variant="outline"
              className="border-2 border-[#1A9359] text-[#1A9359] hover:bg-[#1A9359] hover:text-white px-8 py-3 rounded-full transition-all"
              style={{ backgroundColor: 'rgba(26, 147, 89, 0.1)' }}
              onClick={() => alert('Email form coming')}
            >
              Get early access
            </Button>
          </div>
        ) : (
          <div className="bg-[#1A9359]/10 border border-[#1A9359] rounded-2xl p-6 max-w-xl">
            <p className="text-[#1A9359] font-semibold text-lg">You're on the list!</p>
            <p className="text-gray-400 mt-2">We'll notify you when Sherlock is ready.</p>
          </div>
        )}
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@700;800;900&display=swap');
      `}</style>
    </div>
  );
}
