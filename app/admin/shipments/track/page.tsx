"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clipboard,
  Clock,
  FileText,
  MapPin,
  Navigation,
  Package,
  Printer,
  Search,
  Share2,
  Truck,
} from "lucide-react"
import { useState } from "react"
import ShipmentMap from "./ShipmentMap"

export default function TrackShipmentPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shipment, setShipment] = useState<any>(null)
  const [recentTrackingNumbers, setRecentTrackingNumbers] = useState([
    "TRK-2024-001234",
    "TRK-2024-001235",
    "TRK-2024-001236",
  ])

  const handleTrackShipment = () => {
    if (!trackingNumber) {
      toast({
        title: "Tracking number required",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      setShipment({
        id: trackingNumber,
        trackingNumber: trackingNumber,
        status: "in_transit",
        statusText: "In Transit",
        origin: "Los Angeles, CA",
        destination: "New York, NY",
        customer: "Acme Corporation",
        carrier: "FastFreight Logistics",
        shipDate: "2023-05-15T08:30:00",
        estimatedDelivery: "2023-05-19T17:00:00",
        actualDelivery: null,
        weight: "1,250 kg",
        dimensions: "240 × 120 × 80 cm",
        packageCount: 3,
        shipmentType: "LTL",
        priority: "Standard",
        specialInstructions: "Handle with care. Signature required upon delivery.",
        currentLocation: {
          city: "Columbus, OH",
          coordinates: [39.9612, -82.9988],
          timestamp: "2023-05-17T14:22:00",
          status: "In transit to next facility",
        },
        route: [
          {
            city: "Los Angeles, CA",
            status: "Picked up",
            timestamp: "2023-05-15T08:30:00",
            coordinates: [34.0522, -118.2437],
          },
          {
            city: "Phoenix, AZ",
            status: "Departed",
            timestamp: "2023-05-16T06:45:00",
            coordinates: [33.4484, -112.074],
          },
          {
            city: "Columbus, OH",
            status: "In transit",
            timestamp: "2023-05-17T14:22:00",
            coordinates: [39.9612, -82.9988],
          },
          { city: "Pittsburgh, PA", status: "Scheduled", timestamp: null, coordinates: [40.4406, -79.9959] },
          { city: "New York, NY", status: "Scheduled", timestamp: null, coordinates: [40.7128, -74.006] },
        ],
        documents: [
          { id: "doc1", name: "Bill of Lading", type: "PDF", size: "1.2 MB", date: "2023-05-15" },
          { id: "doc2", name: "Commercial Invoice", type: "PDF", size: "0.8 MB", date: "2023-05-15" },
          { id: "doc3", name: "Packing List", type: "PDF", size: "0.5 MB", date: "2023-05-15" },
        ],
        updates: [
          { status: "Picked up by carrier", location: "Los Angeles, CA", timestamp: "2023-05-15T08:30:00" },
          { status: "Departed origin facility", location: "Los Angeles, CA", timestamp: "2023-05-15T10:15:00" },
          { status: "Arrived at sort facility", location: "Phoenix, AZ", timestamp: "2023-05-16T04:30:00" },
          { status: "Departed sort facility", location: "Phoenix, AZ", timestamp: "2023-05-16T06:45:00" },
          { status: "In transit to destination", location: "Columbus, OH", timestamp: "2023-05-17T14:22:00" },
        ],
        progress: 60,
        temperature: "18°C",
        humidity: "45%",
        lastUpdated: "2023-05-17T14:22:00",
      })

      // Add to recent tracking numbers if not already there
      if (!recentTrackingNumbers.includes(trackingNumber)) {
        setRecentTrackingNumbers((prev) => [trackingNumber, ...prev.slice(0, 2)])
      }

      setIsLoading(false)
    }, 1500)
  }

  const handleCopyTrackingNumber = () => {
    if (shipment?.trackingNumber) {
      navigator.clipboard.writeText(shipment.trackingNumber)
      toast({
        title: "Tracking number copied",
        description: `${shipment.trackingNumber} copied to clipboard`,
      })
    }
  }

  const handlePrintDetails = () => {
    toast({
      title: "Printing shipment details",
      description: "Preparing document for printing...",
    })
    // In a real app, this would trigger the print functionality
  }

  const handleShareShipment = () => {
    toast({
      title: "Share shipment",
      description: "Shipment sharing options would appear here",
    })
    // In a real app, this would open sharing options
  }

  const calculateDeliveryStatus = () => {
    if (!shipment) return null

    const now = new Date()
    const estimatedDelivery = new Date(shipment.estimatedDelivery)
    const shipDate = new Date(shipment.shipDate)

    const totalTime = estimatedDelivery.getTime() - shipDate.getTime()
    const elapsedTime = now.getTime() - shipDate.getTime()

    let progress = Math.min(Math.round((elapsedTime / totalTime) * 100), 100)

    if (shipment.status === "delivered") {
      progress = 100
    } else if (shipment.status === "pending") {
      progress = 0
    }

    return progress
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Navigation className="h-6 w-6 hidden sm:block" />
              Track Your Shipment
            </CardTitle>
            <CardDescription>Enter your tracking number to get real-time updates on your shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., TRK-2024-001234)"
                    className="pl-9"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrackShipment()}
                  />
                </div>
              </div>
              <Button onClick={handleTrackShipment} disabled={isLoading} className="md:w-auto">
                {isLoading ? "Tracking..." : "Track Shipment"}
              </Button>
            </div>

            {recentTrackingNumbers.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Recent Tracking Numbers</h4>
                <div className="flex flex-wrap gap-2">
                  {recentTrackingNumbers.map((number) => (
                    <Badge
                      key={number}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        setTrackingNumber(number)
                        setShipment(null)
                      }}
                    >
                      {number}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Tracking shipment...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {shipment && !isLoading && (
          <>
            <Card>
              <CardHeader className="flex flex-wrap gap-3 flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Shipment {shipment.trackingNumber}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Package className="mr-1 h-4 w-4" />
                    {shipment.shipmentType} Shipment • {shipment.packageCount} packages
                  </CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={handleCopyTrackingNumber}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintDetails}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareShipment}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <div className="flex items-center">
                      <Badge variant={shipment.status === "in_transit" ? "secondary" : "default"}>
                        {shipment.statusText}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Estimated Delivery</div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Current Location</div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      {shipment.currentLocation.city}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(shipment.lastUpdated).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      {" • "}
                      {new Date(shipment.lastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Shipment Progress</div>
                    <div className="text-sm text-muted-foreground">{shipment.progress}% Complete</div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${shipment.progress}%` }}></div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Package className="mr-1 h-3 w-3" />
                      Shipped
                      <span className="ml-1">
                        {new Date(shipment.shipDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-1 h-3 w-3" />
                      In Transit
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Estimated Delivery
                      <span className="ml-1">
                        {new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">From</div>
                      <Badge variant="outline" className="text-xs">
                        Origin
                      </Badge>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="font-medium">{shipment.origin}</div>
                      <div className="text-sm text-muted-foreground">
                        Shipped on{" "}
                        {new Date(shipment.shipDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">To</div>
                      <Badge variant="outline" className="text-xs">
                        Destination
                      </Badge>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="font-medium">{shipment.destination}</div>
                      <div className="text-sm text-muted-foreground">
                        Expected by{" "}
                        {new Date(shipment.estimatedDelivery).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="flex flex-wrap justify-start  h-full ">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Timeline</CardTitle>
                    <CardDescription>Track the journey of your shipment from origin to destination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {shipment.updates.map((update: any, index: number) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full border ${index === 0
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/20 bg-background"
                                }`}
                            >
                              {index === 0 ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">{index + 1}</span>
                              )}
                            </div>
                            {index < shipment.updates.length - 1 && (
                              <div className="h-full w-px bg-muted-foreground/20" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <p className="font-medium leading-none">{update.status}</p>
                            <p className="text-sm text-muted-foreground">{update.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(update.timestamp).toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Map</CardTitle>
                    <CardDescription>View the current location and route of your shipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Interactive map showing shipment route from {shipment.origin} to {shipment.destination}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Current location: {shipment.currentLocation.city}
                          </p>
                        </div>
                      </div>
                    </div> */}
                    <div className="overflow-hidden rounded-lg border">
                      <ShipmentMap
                        route={shipment.route}
                        currentLocation={shipment.currentLocation}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Details</CardTitle>
                    <CardDescription>Comprehensive information about your shipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-medium">Shipment Information</h3>
                          <div className="grid sm:grid-cols-2 gap-3 rounded-lg border p-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Tracking Number</p>
                              <p className="font-medium">{shipment.trackingNumber}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carrier</p>
                              <p className="font-medium">{shipment.carrier}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Shipment Type</p>
                              <p className="font-medium">{shipment.shipmentType}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Priority</p>
                              <p className="font-medium">{shipment.priority}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-medium">Package Details</h3>
                          <div className="grid sm:grid-cols-2 gap-3 rounded-lg border p-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Weight</p>
                              <p className="font-medium">{shipment.dropOff[0]?.weight ?? 0}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Dimensions</p>
                              <p className="font-medium">{shipment.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Package Count</p>
                              <p className="font-medium">{shipment.packageCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Temperature</p>
                              <p className="font-medium">{shipment.temperature}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-medium">Customer Information</h3>
                          <div className="rounded-lg border p-3 text-sm">
                            <p className="font-medium">{shipment.customer}</p>
                            <p className="text-muted-foreground">Account #: ACC-12345</p>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-muted-foreground">Contact</p>
                                <p className="font-medium">John Smith</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">+1 (555) 123-4567</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-medium">Special Instructions</h3>
                          <div className="rounded-lg border p-3 text-sm">
                            <p>{shipment.specialInstructions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Documents</CardTitle>
                    <CardDescription>Access and download documents related to your shipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shipment.documents.map((doc: any) => (
                        <div key={doc.id} className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-muted p-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Need Assistance?</CardTitle>
                <CardDescription>Contact our support team for help with this shipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Carrier Support</h4>
                        <p className="text-sm text-muted-foreground">{shipment.carrier}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1 items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="font-medium">+1 (800) 555-1234</span>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="font-medium">support@fastfreight.com</span>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">
                      Contact Carrier
                    </Button>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Report an Issue</h4>
                        <p className="text-sm text-muted-foreground">Having problems with this shipment?</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Report issues such as:</p>
                      <ul className="ml-5 list-disc">
                        <li>Damaged packages</li>
                        <li>Delivery delays</li>
                        <li>Incorrect tracking information</li>
                      </ul>
                    </div>
                    <Button className="mt-4 w-full">Report Issue</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <div className="flex flex-wrap gap-1 w-full items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Tracking ID: <span className="font-mono">{shipment.trackingNumber}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All Shipments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
