interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="text-center max-w-lg">
      <h3 className="text-3xl font-bold mb-6 text-gray-900">
        Sherlock is Analysing Your Site
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-lg text-gray-600 mt-4 font-semibold">{Math.round(progress)}%</div>
    </div>
  );
}
