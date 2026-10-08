
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, AlertCircle, ShoppingCart, RefreshCw } from "lucide-react"

export default function InventoryLevelsLoading() {
  return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-[250px]" />
          <Skeleton className="h-5 w-[350px]" />
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <Skeleton className="mt-1 h-8 w-20" />
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <Skeleton className="mt-1 h-8 w-20" />
                </div>
                <div className="rounded-full bg-amber-500/10 p-3">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                  <Skeleton className="mt-1 h-8 w-20" />
                </div>
                <div className="rounded-full bg-green-500/10 p-3">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Restocks</p>
                  <Skeleton className="mt-1 h-8 w-20" />
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full max-w-md" />

          {/* Filters Skeleton */}
          <div className="my-4 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-6 w-[200px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[300px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
