"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PageLoadingSkeleton() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="pt-20 lg:pt-28 bg-background">
        <div className="container mx-auto px-4 max-w-[1200px] py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background">
        <div className="container mx-auto px-4 max-w-[1200px] py-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Categories - только для десктопа */}
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              {/* Search Section - только для десктопа */}
              <div className="hidden xl:block bg-white border border-slate-200 rounded-lg p-4 mb-6">
                <Skeleton className="h-6 w-16 mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
                <Skeleton className="h-10 w-20" />
              </div>

              {/* Mobile Search - только для мобильных */}
              <div className="xl:hidden bg-white border border-slate-200 rounded-lg p-4 mb-4">
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Filters and View Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Skeleton className="h-10 w-full sm:w-48" />
                  <Skeleton className="h-10 w-full sm:w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-20 mb-2" />
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageLoadingSkeleton
