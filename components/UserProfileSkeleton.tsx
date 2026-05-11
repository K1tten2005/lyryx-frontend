export default function UserProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl p-8 border border-zinc-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 bg-zinc-100 rounded-2xl"></div>
        <div className="flex-grow w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="h-10 w-48 bg-zinc-100 rounded-lg"></div>
              <div className="h-5 w-24 bg-zinc-100 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <div className="h-4 w-20 bg-zinc-100 rounded"></div>
              <div className="h-10 w-32 bg-zinc-100 rounded-lg"></div>
            </div>
          </div>
          <div className="h-16 w-full bg-zinc-50 rounded-xl"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-zinc-100 mb-8 flex gap-8">
        <div className="h-12 w-32 bg-zinc-100 border-b-2 border-zinc-200"></div>
      </div>

      {/* List Skeleton */}
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white h-40 rounded-2xl border border-zinc-100 flex flex-col sm:flex-row overflow-hidden">
            <div className="sm:w-1/3 bg-zinc-50 p-4 border-r border-zinc-100 flex gap-4">
               <div className="w-20 h-20 bg-zinc-100 rounded-lg shrink-0"></div>
               <div className="flex-grow space-y-2 py-2">
                  <div className="h-4 w-full bg-zinc-100 rounded"></div>
                  <div className="h-3 w-2/3 bg-zinc-100 rounded"></div>
               </div>
            </div>
            <div className="flex-grow p-6 space-y-4">
               <div className="flex justify-between">
                  <div className="h-4 w-24 bg-zinc-100 rounded"></div>
                  <div className="h-4 w-16 bg-zinc-100 rounded"></div>
               </div>
               <div className="space-y-2">
                  <div className="h-5 w-full bg-zinc-100 rounded"></div>
                  <div className="h-5 w-4/5 bg-zinc-100 rounded"></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
