export interface Shipment {
  id: string
  trackingNumber: string
  customer: string
  origin: string
  destination: string
  departureDate: string
  estimatedArrival: string
  status: string
  priority: string
  type: "road" | "air" | "sea" | "rail"
  carrier: string
  weight: number
  items: number
  value: number
  progress: number
  lastUpdated: string

  note: any
  deliveryPackage: any
  orderType: string
  vehicleTypeId: string
  vehicleTypeFeeAmount: number
  driverId: string
  pickup: Pickup
  pickupDate: string
  dropOff: DropOff[]
  currency: string
  feeBy: string
  baseFee: number
  totalFee: number
  paymentType: string
  totalDistance: number
  totalDurationEstimate: number
  totalDurationDelivery: number
  createdById: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export type OrderType =
  "EXPRESS" | "TAXI" | "GONOW" | "AGENT"

export interface ShipmentStats {
  total: number
  inTransit: number
  delivered: number
  pending: number
  delayed: number
  cancelled: number
  totalWeight: number
  totalValue: number
  totalItems: number
  accepted: number
}

export interface ShipmentFilters {
  searchQuery: string
  statusFilter: string
  typeFilter: string
  priorityFilter: string
  carrierFilter: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  createdById: string
  driverId: string
}

export interface Pickup {
  id: string
  name: string
  note: string
  latitude: number
  longitude: number
  addressName: string
  distance: any
  duration: any
  weight: number
  status: string
  files: any[]
}

export interface DropOff {
  id: string
  name: string
  note: string
  latitude: number
  longitude: number
  addressName: string
  distance: string
  duration: string
  weight: number
  status: string
  files: any[]
}
