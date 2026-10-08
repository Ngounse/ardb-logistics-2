import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Metrics Overview Skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[120px]" />
                </CardTitle>
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Feedback Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Skeleton */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-2">
                <Skeleton className="h-10 w-full md:w-[250px]" />
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
              <Skeleton className="h-10 w-full md:w-[150px]" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex space-x-1 overflow-auto">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-[100px]" />
                  ))}
              </div>

              {/* Table Skeleton */}
              <div className="overflow-hidden rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {Array(8)
                          .fill(null)
                          .map((_, i) => (
                            <th key={i} className="px-4 py-3 text-left">
                              <Skeleton className="h-4 w-[80px]" />
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-[120px]" />
                                  <Skeleton className="mt-1 h-3 w-[80px]" />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="mt-1 h-3 w-[100px]" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-6 w-[80px] rounded-full" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-[100px]" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-6 w-[80px] rounded-full" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-6 w-[60px] rounded-full" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex">
                                {Array(5)
                                  .fill(null)
                                  .map((_, j) => (
                                    <Skeleton key={j} className="mx-0.5 h-4 w-4 rounded-full" />
                                  ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
