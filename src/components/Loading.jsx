export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block relative w-16 h-16">
          <div className="absolute border-4 border-gray-200 rounded-full w-16 h-16"></div>
          <div className="absolute border-4 border-gray-900 rounded-full w-16 h-16 animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-500 text-sm">Memuat...</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
