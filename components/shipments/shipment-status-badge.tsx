import { Badge } from "@/components/ui/badge"
import { Box, Check, CheckCircle2, ClipboardCheck, Clock, Package, RotateCcw, Truck, XCircle } from "lucide-react"

interface ShipmentStatusBadgeProps {
  readonly status: string
}

export function ShipmentStatusBadge({ status }: ShipmentStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "warning" = "outline"
  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
    PICKUP: "bg-indigo-100 text-indigo-800 border-indigo-300",
    TRANSIT: "bg-sky-100 text-sky-800 border-sky-300",
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    RETURNED: "bg-orange-100 text-orange-800 border-orange-300",
    REJECT: "bg-red-100 text-red-800 border-red-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
    REVIEW: "bg-orange-100 text-orange-800 border-orange-300",
    REQUEST: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
  }
  let icon = <Package className="mr-1 h-3 w-3" />
  let label: string = status

  switch (status) {
    case "PENDING":
      variant = "warning"
      icon = <Clock className="mr-1 h-3 w-3" />
      // uppercase first letter, lowercase the rest, replace underscores with spaces
      break

    case "ACCEPTED":
      variant = "secondary"
      icon = <Check className="mr-1 h-3 w-3" />
      break

    case "PICKUP":
      variant = "secondary"
      icon = <Package className="mr-1 h-3 w-3" />
      break

    case "TRANSIT":
      variant = "secondary"
      icon = <Truck className="mr-1 h-3 w-3" />
      break

    case "DELIVERED":
      variant = "default"
      icon = <CheckCircle2 className="mr-1 h-3 w-3" />
      break

    case "COMPLETED":
      variant = "default"
      icon = <ClipboardCheck className="mr-1 h-3 w-3" />
      break

    case "RETURNED":
      variant = "warning"
      icon = <RotateCcw className="mr-1 h-3 w-3" />
      break

    case "REJECT":
      variant = "destructive"
      icon = <XCircle className="mr-1 h-3 w-3" />
      break

    case "CANCELLED":
      variant = "destructive"
      icon = <XCircle className="mr-1 h-3 w-3" />
      label = "CANCELLED"
      break


    case "REVIEW":
      variant = "secondary"
      icon = <Clock className="mr-1 h-3 w-3" />
      label = "REVIEW"
      break
    case "REQUEST":
      variant = "secondary"
      icon = <Clock className="mr-1 h-3 w-3" />
      label = "REQUEST"
      break
    case "APPROVED":
      variant = "secondary"
      icon = <Check className="mr-1 h-3 w-3" />
      label = "APPROVED"
      break

    default:
      icon = <Box className="mr-1 h-3 w-3" />
      label = status ? status.charAt(0).toUpperCase() + status.slice(1).replaceAll("_", " ") : status || 'Unknow'
  }

  return (
    <Badge variant={variant} className={`flex items-center ${statusStyles[status] || ''}`}>
      {icon}
      {label}
    </Badge>
  )
}
