'use client';

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/80 shadow-sm border-b border-gray-200/50 fixed w-full top-0 z-50 h-14">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="fixed left-0 top-14 bottom-0 w-64 bg-white/80 shadow-xl border-r border-gray-200/50 p-3 space-y-2 hidden lg:block">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <main className="lg:ml-64 pt-14 p-6">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl shadow-sm"></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-xl shadow-sm"></div>
        </div>
      </main>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
