// Loading skeleton components for better UX

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="pt-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-32 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-6"></div>
        <div className="h-16 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-16 bg-white/20 rounded w-2/3 mx-auto mb-8"></div>
        <div className="h-6 bg-white/20 rounded w-1/2 mx-auto mb-10"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-white/20 rounded w-40"></div>
          <div className="h-12 bg-white/20 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
}
