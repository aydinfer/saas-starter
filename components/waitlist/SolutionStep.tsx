interface SolutionStepProps {
  number: number;
  title: string;
  description: string;
}

export function SolutionStep({ number, title, description }: SolutionStepProps) {
  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-5">
        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
