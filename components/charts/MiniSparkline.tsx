"use client";

import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { cn } from '@/lib/utils';

interface Props {
  domain: string;
  data: { date: string; value: number }[];
  onClick: () => void;
  isSelected: boolean;
}

export function MiniSparkline({ domain, data, onClick, isSelected }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const plot = Plot.plot({
      width: 200,
      height: 30,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      x: { axis: null },
      y: { axis: null },
      style: {
        background: 'transparent'
      },
      marks: [
        Plot.line(data, {
          x: 'date',
          y: 'value',
          stroke: isSelected ? '#14b8a6' : '#d1d5db',
          strokeWidth: 1.5,
          curve: 'catmull-rom'
        }),
        Plot.areaY(data, {
          x: 'date',
          y: 'value',
          fill: isSelected ? '#14b8a6' : '#d1d5db',
          fillOpacity: isSelected ? 0.2 : 0.08,
          curve: 'catmull-rom'
        })
      ]
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(plot);

    return () => {
      plot.remove();
    };
  }, [data, isSelected]);

  const latestValue = data[data.length - 1]?.value || 0;

  return (
    <div
      className="relative p-3 cursor-pointer transition-all bg-white hover:shadow-md group"
      style={{ border: '1px solid #e5e7eb' }}
      onClick={onClick}
    >
      <div className="mb-1">
        <span className="text-[11px] font-medium truncate block" style={{ color: '#111827' }}>
          {domain.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="text-base font-bold mb-2" style={{ color: '#111827' }}>
        ${(latestValue / 1000).toFixed(1)}K
      </div>
      <div ref={containerRef} className="w-full transition-opacity" />
    </div>
  );
}
