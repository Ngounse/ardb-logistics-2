import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function RestockRequestsLoading() {
  return (
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="mt-2 h-4 w-[350px]" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>

        {/* Overview Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[60px]" />
                <Skeleton className="mt-2 h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs and Filters Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Skeleton className="h-10 w-[500px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Skeleton className="h-10 w-full sm:w-[300px]" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[220px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-5 w-full" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <Skeleton className="h-5 w-[200px]" />
              <div className="flex items-center space-x-6">
                <Skeleton className="h-5 w-[80px]" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-[80px]" />
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
  )
}
