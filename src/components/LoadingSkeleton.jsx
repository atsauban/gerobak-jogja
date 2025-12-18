// Loading skeleton components with smooth shimmer animations

// Reusable shimmer bar component
function ShimmerBar({ className = '' }) {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-shimmer animate-shimmer rounded ${className}`}
    />
  );
}

// Reusable shimmer block component
function ShimmerBlock({ className = '' }) {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-shimmer animate-shimmer ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <ShimmerBlock className="aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <ShimmerBar className="h-4 w-1/4" />
        <ShimmerBar className="h-5 w-3/4" />
        <ShimmerBar className="h-4 w-full" />
        <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
          <ShimmerBar className="h-6 w-1/3" />
          <ShimmerBlock className="h-9 w-9 rounded-xl" />
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
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <ShimmerBlock className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <ShimmerBar className="h-4 w-1/2" />
          <ShimmerBar className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <ShimmerBar className="h-3 w-full" />
        <ShimmerBar className="h-3 w-5/6" />
        <ShimmerBar className="h-3 w-4/6" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="pt-16 bg-gradient-to-br from-gray-100 to-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ShimmerBar className="h-8 w-48 mx-auto mb-6" />
        <ShimmerBar className="h-12 w-3/4 mx-auto mb-4" />
        <ShimmerBar className="h-12 w-2/3 mx-auto mb-8" />
        <ShimmerBar className="h-5 w-1/2 mx-auto mb-10" />
        <div className="flex gap-4 justify-center">
          <ShimmerBlock className="h-12 w-40 rounded-xl" />
          <ShimmerBlock className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <ShimmerBlock className="aspect-[16/10]" />
      <div className="p-5 space-y-3">
        <ShimmerBar className="h-3 w-1/4" />
        <ShimmerBar className="h-5 w-3/4" />
        <ShimmerBar className="h-4 w-full" />
        <div className="flex items-center justify-between pt-2">
          <ShimmerBar className="h-4 w-20" />
          <ShimmerBar className="h-4 w-12" />
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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="grid md:grid-cols-2">
        <ShimmerBlock className="aspect-[4/3] md:aspect-auto md:min-h-[300px]" />
        <div className="p-6 md:p-8 space-y-4">
          <ShimmerBar className="h-3 w-24" />
          <ShimmerBar className="h-7 w-3/4" />
          <ShimmerBar className="h-4 w-full" />
          <ShimmerBar className="h-4 w-5/6" />
          <div className="flex items-center justify-between pt-2">
            <ShimmerBar className="h-4 w-20" />
            <ShimmerBar className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShimmerBar className="h-8 w-48 mb-3" />
          <ShimmerBar className="h-5 w-72" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <ShimmerBlock className="h-48 rounded-2xl" />
          <ShimmerBlock className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <ShimmerBar className="h-4 w-48 mb-6" />
        
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="space-y-4">
            <ShimmerBlock className="aspect-square rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <ShimmerBlock key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          
          {/* Info */}
          <div className="space-y-6">
            <ShimmerBar className="h-5 w-24" />
            <ShimmerBar className="h-9 w-3/4" />
            <ShimmerBar className="h-8 w-1/3" />
            <div className="space-y-2 py-4">
              <ShimmerBar className="h-4 w-full" />
              <ShimmerBar className="h-4 w-5/6" />
              <ShimmerBar className="h-4 w-4/6" />
            </div>
            <ShimmerBlock className="h-14 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 8 }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {Array.from({ length: count }).map((_, i) => {
        // Vary heights for masonry effect
        const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-52', 'h-60'];
        const height = heights[i % heights.length];
        return (
          <ShimmerBlock key={i} className={`${height} rounded-2xl break-inside-avoid`} />
        );
      })}
    </div>
  );
}

export function FAQSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <ShimmerBar className="h-5 w-3/4" />
            <ShimmerBlock className="h-6 w-6 rounded-lg" />
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
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <ShimmerBar className="h-10 w-20 mb-2" />
          <ShimmerBar className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

// New: Inline content skeleton
export function ContentSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBar 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

// New: Avatar skeleton
export function AvatarSkeleton({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  return <ShimmerBlock className={`${sizes[size]} rounded-full`} />;
}

// New: Button skeleton
export function ButtonSkeleton({ width = 'w-32' }) {
  return <ShimmerBlock className={`h-11 ${width} rounded-xl`} />;
}
