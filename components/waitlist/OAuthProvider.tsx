interface OAuthProviderProps {
  name: string;
  isActive: boolean;
  comingSoon?: boolean;
}

export function OAuthProvider({ name, isActive, comingSoon }: OAuthProviderProps) {
  return (
    <div className="p-8 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center relative transition-all hover:shadow-lg">
      {comingSoon && (
        <div className="absolute top-3 right-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Coming Soon
        </div>
      )}
      <div className="text-lg font-semibold mb-4 text-gray-900">{name}</div>

      {/* Toggle Switch */}
      <div
        className={`w-14 h-7 rounded-full relative transition-all duration-500 ${
          isActive ? 'bg-green-500' : comingSoon ? 'bg-gray-200' : 'bg-gray-300'
        }`}
        style={{
          boxShadow: isActive ? '0 0 12px rgba(34, 197, 94, 0.4)' : 'none'
        }}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-500 shadow-md ${
            isActive ? 'left-8' : 'left-1'
          }`}
        />
      </div>
    </div>
  );
}
