interface CompletedTaskCardProps {
  title: string;
  description: string;
  amount: number;
  isVisible: boolean;
}

export function CompletedTaskCard({ title, description, amount, isVisible }: CompletedTaskCardProps) {
  return (
    <div
      className={`p-5 border rounded-xl transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 bg-green-50 border-green-200'
          : 'opacity-0 translate-y-8 bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Grey OK checkmark when completed */}
        {isVisible && (
          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-900 mb-1">{title}</div>
          <div className="text-xs text-gray-600 mb-2">{description}</div>
          <div className="text-sm font-bold text-red-600">
            ${amount.toLocaleString()} lost/month
          </div>
        </div>
      </div>
    </div>
  );
}
