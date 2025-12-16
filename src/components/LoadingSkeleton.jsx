// Loading skeleton components for better UX

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[4/3] bg-gray-100"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
        <div className="h-5 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[16/10] bg-gray-100"></div>
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        <div className="h-5 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-gray-100 rounded w-20"></div>
          <div className="h-4 bg-gray-100 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto bg-gray-100"></div>
        <div className="p-6 md:p-8 space-y-4">
          <div className="h-3 bg-gray-100 rounded w-24"></div>
          <div className="h-7 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-gray-100 rounded w-20"></div>
            <div className="h-4 bg-gray-100 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100 py-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-100 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-100 rounded w-72"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div className="h-48 bg-gray-100 rounded-xl"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}


export function ProductDetailSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-100 rounded w-48 mb-6"></div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl"></div>
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* Info */}
          <div className="space-y-6">
            <div className="h-4 bg-gray-100 rounded w-24"></div>
            <div className="h-8 bg-gray-100 rounded w-3/4"></div>
            <div className="h-10 bg-gray-100 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            </div>
            <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
      ))}
    </div>
  );
}

export function FAQSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-100 rounded w-3/4"></div>
            <div className="h-5 w-5 bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}
