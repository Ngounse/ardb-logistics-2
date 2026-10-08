import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorDirectoryLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <Skeleton className="mt-1 h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="mb-6">
            <Skeleton className="h-10 w-full sm:w-96" />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <Skeleton className="h-10 w-full md:w-1/3" />
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <Skeleton className="h-10 w-full sm:w-1/3" />
              <Skeleton className="h-10 w-full sm:w-1/3" />
              <Skeleton className="h-10 w-full sm:w-1/4" />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <div className="p-1">
              <Skeleton className="h-10 w-full" />
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="mt-2 h-16 w-full" />
                ))}
            </div>
          </div>

          {/* Table Footer */}
          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
