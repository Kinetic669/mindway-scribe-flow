
import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionLoading() {
  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {/* Session Header Skeleton */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        
        {/* Session Goals Skeleton */}
        <Card className="mb-6 p-4">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </Card>
        
        {/* Timeline Skeleton */}
        <Card className="mb-4 p-2">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-14 flex-shrink-0" />
            ))}
          </div>
        </Card>
        
        {/* Tabs Skeleton */}
        <div className="border rounded-lg">
          <div className="flex border-b p-1 gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <div className="p-4">
            <Skeleton className="h-32 w-full mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
