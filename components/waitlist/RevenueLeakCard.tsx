interface RevenueLeakCardProps {
  title: string;
  amount: number;
  index: number;
}

export function RevenueLeakCard({ title, amount, index }: RevenueLeakCardProps) {
  return (
    <div
      className="relative p-5 rounded-lg backdrop-blur-md border border-white/10 transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        transform: `translateY(${index * 12}px)`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon showing friction */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div className="text-2xl">⚠️</div>
        </div>

        {/* Frosted glass with revenue amount */}
        <div
          className="flex-1 p-4 rounded-md backdrop-blur-sm border"
          style={{
            background: 'rgba(239, 68, 68, 0.06)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}
        >
          <div className="text-xs text-gray-400 mb-1 font-medium">{title}</div>
          <div className="text-2xl font-bold text-red-400">
            ${amount.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">lost this month</div>
        </div>
      </div>
    </div>
  );
}
