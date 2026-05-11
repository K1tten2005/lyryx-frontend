export default function UserProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 bg-white/50 rounded-full border-4 border-white/40 shadow-inner-glow"></div>
        <div className="flex-grow w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-3">
              <div className="h-10 w-48 bg-white/60 rounded-xl"></div>
              <div className="h-5 w-24 bg-white/40 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <div className="h-4 w-20 bg-white/40 rounded-md"></div>
              <div className="h-10 w-32 bg-white/60 rounded-xl"></div>
            </div>
          </div>
          <div className="h-16 w-full bg-white/40 rounded-2xl"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-white/40 mb-8 flex gap-8">
        <div className="h-12 w-32 bg-white/50 rounded-t-xl border border-white/40 border-b-0"></div>
      </div>

      {/* List Skeleton */}
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface bg-glass-panel backdrop-blur-md h-40 rounded-3xl border border-white/50 shadow-glass flex flex-col sm:flex-row overflow-hidden">
            <div className="sm:w-1/3 bg-white/30 p-4 border-r border-white/40 flex gap-4">
               <div className="w-20 h-20 bg-white/50 rounded-2xl shadow-inner-glow shrink-0"></div>
               <div className="flex-grow space-y-3 py-2">
                  <div className="h-4 w-full bg-white/50 rounded-md"></div>
                  <div className="h-3 w-2/3 bg-white/40 rounded-md"></div>
               </div>
            </div>
            <div className="flex-grow p-6 space-y-4">
               <div className="flex justify-between">
                  <div className="h-4 w-24 bg-white/50 rounded-md"></div>
                  <div className="h-4 w-16 bg-white/40 rounded-md"></div>
               </div>
               <div className="space-y-3">
                  <div className="h-5 w-full bg-white/60 rounded-lg"></div>
                  <div className="h-5 w-4/5 bg-white/50 rounded-lg"></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}