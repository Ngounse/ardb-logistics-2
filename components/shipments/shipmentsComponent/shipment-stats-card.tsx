import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { ShipmentStats } from "../types/shipment"

interface ShipmentStatsCardProps {
  stats: ShipmentStats
}

export function ShipmentStatsCard({ stats }: ShipmentStatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="grid mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              In Transit / Accepted (per page)
            </span>
            <span className="font-medium">{stats.inTransit + stats.accepted}</span>
          </div>
          <Progress value={(stats.inTransit / stats.total) * 100} className="h-1 bg-muted" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Delivered  (per page)
            </span>
            <span className="font-medium">{stats.delivered}</span>
          </div>
          <Progress value={(stats.delivered / stats.total) * 100} className="h-1 bg-muted" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
              Delayed/Pending  (per page)
            </span>
            <span className="font-medium">{stats.delayed + stats.pending}</span>
          </div>
          <Progress value={((stats.delayed + stats.pending) / stats.total) * 100} className="h-1 bg-muted" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              Cancelled  (per page)
            </span>
            <span className="font-medium">{stats.cancelled}</span>
          </div>
          <Progress value={(stats.cancelled / stats.total) * 100} className="h-1 bg-muted" />

        </div>
      </CardContent>
    </Card>
  )
}
