"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Box,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Navigation,
  Package,
  Route,
  Scale,
  User,
  Wallet
} from "lucide-react"
import { MyHashID } from "../myFunction"
import { ShipmentPriorityBadge } from "./shipmentsComponent/shipment-priority-badge"
import { Shipment } from "./types/shipment"
import { ShipmentStatusBadge } from "./shipment-status-badge"
interface ShipmentDetailsProps {
  readonly shipment: Shipment
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount?: number | null, currency = "KHR") => {
  if (amount == null) return "-";

  return `${amount.toLocaleString()} ${currency}`;
};

const formatDistance = (meters?: number | null) => {
  if (meters == null) return "-";

  return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds?: number | null) => {
  if (seconds == null) return "-";

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes} mins`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
};

export function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  if (!shipment) {
    return <div>No shipment details available</div>
  }

  const pickup = shipment.pickup;
  const dropOff = shipment.dropOff?.[0];

  const directionsUrl =
    pickup && dropOff
      ? `https://www.google.com/maps/dir/?api=1&origin=${pickup.latitude},${pickup.longitude}&destination=${dropOff.latitude},${dropOff.longitude}`
      : null;

  return (
    <div className="space-y-6">

      {/* Shipment Overview */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Shipment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Shipment Information
          </h3>

          <div className="space-y-2">

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Shipment ID
                </span>
              </div>

              <span className="max-w-[250px] truncate font-mono text-xs">
                {shipment.id}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Route className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Order Type
                </span>
              </div>
              <ShipmentPriorityBadge priority={shipment.orderType} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Status
                </span>
              </div>
              < ShipmentStatusBadge status={shipment.status} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Pickup Date
                </span>
              </div>

              <span className="text-sm">
                {formatDate(shipment.pickupDate)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Created By
                </span>
              </div>

              <span className="text-sm">
                {shipment.createdBy || "-"}
              </span>
            </div>

          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Delivery Information
          </h3>

          <div className="space-y-2">

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Drop-off Points
                </span>
              </div>

              <span className="text-sm">
                {shipment.dropOff?.length ?? 0}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Route className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Total Distance
                </span>
              </div>

              <span className="text-sm">
                {formatDistance(shipment.totalDistance)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Estimated Duration
                </span>
              </div>

              <span className="text-sm">
                {formatDuration(shipment.totalDurationEstimate)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Driver
                </span>
              </div>

              <span className="text-sm">
                {MyHashID(shipment.driverId) || "Not assigned"}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Box className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Vehicle Type Fee
                </span>
              </div>

              <span className="text-sm font-medium">
                {formatMoney(
                  shipment.vehicleTypeFeeAmount,
                  shipment.currency
                )}
              </span>
            </div>

          </div>
        </div>
      </div>

      <Separator />

      {/* Route */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Shipment Route
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Pickup */}
          {/* <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Pickup
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.pickup?.name}
                  </p>
                </div>
              </div>

              <Badge variant="outline">
                {shipment.pickup?.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {shipment.pickup?.addressName || "-"}
            </p>

            {shipment.pickup?.note && (
              <p className="mt-2 text-xs text-muted-foreground">
                Note: {shipment.pickup.note}
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>
                Lat: {shipment.pickup?.latitude}
              </span>

              <span>
                Lng: {shipment.pickup?.longitude}
              </span>
            </div>
          </div> */}

          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>

                <div>
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.pickup?.name}
                  </p>
                </div>
              </div>

              < ShipmentStatusBadge status={shipment.pickup.status} />
            </div>

            <p className="text-sm text-muted-foreground">
              {shipment.pickup?.addressName}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {shipment.pickup?.latitude},{" "}
                {shipment.pickup?.longitude}
              </span>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${shipment.pickup?.latitude},${shipment.pickup?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <MapPin className="h-3.5 w-3.5" />
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Drop Off */}
          {shipment.dropOff?.map((drop: any, index: number) => (
            <div
              key={drop.id}
              className="rounded-lg border p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Drop-off {index + 1}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {drop.name}
                    </p>
                  </div>
                </div>

                < ShipmentStatusBadge status={drop.status} />

              </div>

              <p className="text-sm text-muted-foreground">
                {drop.addressName || "-"}
              </p>

              {drop.note && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: {drop.note}
                </p>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <span className="text-muted-foreground">
                  Distance:{" "}
                  <span className="font-medium text-foreground">
                    {drop.distance || "-"}
                  </span>
                </span>

                <span className="text-muted-foreground">
                  Duration:{" "}
                  <span className="font-medium text-foreground">
                    {drop.duration || "-"}
                  </span>
                </span>

                <span className="text-muted-foreground">
                  Weight:{" "}
                  <span className="font-medium text-foreground">
                    {drop.weight ?? 0} kg
                  </span>
                </span>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${drop.latitude},${drop.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-centergap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          ))}

        </div>
      </div>

      {directionsUrl && (
        <div className="flex justify-center">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          >
            <Navigation className="h-4 w-4" />
            Directions on Map
          </a>
        </div>
      )}

      <Separator />

      {/* Package Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Package Details
        </h3>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Scale className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Weight
                </span>
              </div>

              <span className="text-sm">
                {shipment.dropOff?.reduce(
                  (total: number, item: any) =>
                    total + (item.weight || 0),
                  0
                )}{" "}
                kg
              </span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Package
                </span>
              </div>

              <span className="text-sm">
                {shipment.deliveryPackage || "-"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Delivery Time
                </span>
              </div>

              <span className="text-sm">
                {formatDuration(shipment.totalDurationDelivery)}
              </span>
            </div>
          </div>

        </div>
      </div>

      <Separator />

      {/* Payment & Fee */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Payment & Fees
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-lg border p-4">
            <div className="space-y-3">

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Base Fee
                  </span>
                </div>

                <span className="text-sm">
                  {formatMoney(
                    shipment.baseFee,
                    shipment.currency
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Vehicle Fee
                  </span>
                </div>

                <span className="text-sm">
                  {formatMoney(
                    shipment.vehicleTypeFeeAmount,
                    shipment.currency
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Total Fee
                </span>

                <span className="text-lg font-bold">
                  {formatMoney(
                    shipment.totalFee,
                    shipment.currency
                  )}
                </span>
              </div>

            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-3">

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Fee By
                  </span>
                </div>

                <Badge variant="outline">
                  {shipment.feeBy || "-"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Payment Type
                  </span>
                </div>

                <Badge variant="outline">
                  {shipment.paymentType || "-"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Currency
                </span>

                <span className="text-sm font-medium">
                  {shipment.currency}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Separator />

      {/* Note */}
      {shipment.note && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Note
          </h3>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              {shipment.note}
            </p>
          </div>
        </div>
      )}

      {/* Audit Information */}
      <div className="rounded-lg bg-muted/40 p-4">
        <div className="grid gap-3 text-sm md:grid-cols-2">

          <div>
            <span className="text-muted-foreground">
              Created:
            </span>{" "}
            {formatDate(shipment.createdAt)}
          </div>

          <div>
            <span className="text-muted-foreground">
              Updated:
            </span>{" "}
            {formatDate(shipment.updatedAt)}
          </div>

          <div>
            <span className="text-muted-foreground">
              Created By:
            </span>{" "}
            {shipment.createdBy || "-"}
          </div>

          <div>
            <span className="text-muted-foreground">
              Updated By:
            </span>{" "}
            {shipment.updatedBy || "-"}
          </div>

        </div>
      </div>

    </div>
  )
}
