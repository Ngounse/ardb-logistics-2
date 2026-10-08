"use client"

import { MyHashID, MySubstring } from "@/components/myFunction"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { FormatDuration } from "@/lib/function"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { ShipmentStatusBadge } from "../shipment-status-badge"
import { Shipment } from "../types/shipment"
import { ShipmentPriorityBadge } from "./shipment-priority-badge"
import { ShipmentTypeIcon } from "./shipment-type-icon"

interface ShipmentTableRowProps {
  readonly shipment: Shipment
  readonly isSelected: boolean
  readonly onSelect: (id: string) => void
  readonly onView: (shipment: Shipment) => void
  readonly onEdit: (shipment: Shipment) => void
  readonly onDuplicate: (shipment: Shipment) => void
  readonly onDelete: (shipment: Shipment) => void
}

export function ShipmentTableRow({
  shipment,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: ShipmentTableRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={() => onSelect(shipment.id)} />
      </TableCell>
      <TableCell className="font-medium">
        <div>{shipment.id.substring(0, 5)}...{shipment.id.substring(shipment.id.length - 5)}</div>
        <div className="text-xs text-muted-foreground">{MyHashID(shipment.id)}</div>
      </TableCell>
      <TableCell>{shipment.customer}</TableCell>
      <TableCell className="hidden md:table-cell"><MySubstring key={shipment.id} item={shipment.origin} substring={35} /></TableCell>
      <TableCell className="hidden md:table-cell"><MySubstring key={shipment.id} item={shipment.destination} substring={35} /></TableCell>
      <TableCell className="hidden lg:table-cell">{formatDate(shipment.departureDate)}</TableCell>
      <TableCell className="hidden lg:table-cell">{FormatDuration(Number(shipment.estimatedArrival))}</TableCell>
      <TableCell>
        <ShipmentStatusBadge status={shipment.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2 ">
          <ShipmentTypeIcon type={shipment.type} />
          <span className="hidden lg:inline capitalize">{shipment.type}</span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        <ShipmentPriorityBadge priority={shipment.priority} />
      </TableCell>
      <TableCell className="cursor-not-allowed">
        <DropdownMenu >
          <DropdownMenuTrigger asChild >
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" >
            <DropdownMenuLabel >Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(shipment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(shipment)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Shipment
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onDuplicate(shipment)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(shipment)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
