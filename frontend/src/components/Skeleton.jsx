export function ProductSkeleton() {
  return (
    <div className="bg-tn-dark border border-tn-border rounded-2xl overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 skeleton rounded w-16" />
          <div className="h-8 w-8 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
