"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Truck,
  Wrench,
  CheckCircle,
  Clock,
  Ban,
  MapPin,
  RefreshCw,
  Filter,
  Package,
  Car,
  Forklift,
  X,
  Search,
  CalendarIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import PageHeader from "@/components/shared/PageHeader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for vehicles
const allVehicles = [
  {
    id: "TRK-001",
    type: "truck",
    model: "Freightliner Cascadia",
    status: "active",
    driver: "John Smith",
    location: "New York, NY",
    coordinates: [-74.006, 40.7128],
    lastMaintenance: "2023-04-15",
    nextMaintenance: "2023-07-15",
    fuelLevel: 85,
    mileage: 45892,
  },
  {
    id: "TRK-002",
    type: "truck",
    model: "Kenworth T680",
    status: "maintenance",
    driver: "Sarah Johnson",
    location: "Chicago, IL",
    coordinates: [-87.6298, 41.8781],
    lastMaintenance: "2023-05-20",
    nextMaintenance: "2023-08-20",
    fuelLevel: 42,
    mileage: 78541,
  },
  {
    id: "VAN-001",
    type: "van",
    model: "Mercedes-Benz Sprinter",
    status: "active",
    driver: "Michael Brown",
    location: "Los Angeles, CA",
    coordinates: [-118.2437, 34.0522],
    lastMaintenance: "2023-03-10",
    nextMaintenance: "2023-06-10",
    fuelLevel: 72,
    mileage: 32145,
  },
  {
    id: "CAR-001",
    type: "car",
    model: "Toyota Camry",
    status: "available",
    driver: "Unassigned",
    location: "Houston, TX",
    coordinates: [-95.3698, 29.7604],
    lastMaintenance: "2023-05-05",
    nextMaintenance: "2023-08-05",
    fuelLevel: 90,
    mileage: 12567,
  },
  {
    id: "TRK-003",
    type: "truck",
    model: "Volvo VNL",
    status: "active",
    driver: "David Wilson",
    location: "Miami, FL",
    coordinates: [-80.1918, 25.7617],
    lastMaintenance: "2023-04-25",
    nextMaintenance: "2023-07-25",
    fuelLevel: 65,
    mileage: 56789,
  },
  {
    id: "FRK-001",
    type: "forklift",
    model: "Toyota 8FGU25",
    status: "outOfService",
    driver: "Unassigned",
    location: "Chicago, IL",
    coordinates: [-87.6298, 41.8781],
    lastMaintenance: "2023-02-15",
    nextMaintenance: "2023-05-15",
    fuelLevel: 20,
    mileage: 8765,
  },
  {
    id: "VAN-002",
    type: "van",
    model: "Ford Transit",
    status: "active",
    driver: "Emily Davis",
    location: "Seattle, WA",
    coordinates: [-122.3321, 47.6062],
    lastMaintenance: "2023-05-10",
    nextMaintenance: "2023-08-10",
    fuelLevel: 78,
    mileage: 28976,
  },
]

// Mock data for performance metrics
const fuelEfficiencyData = [
  { month: "Jan", actual: 7.2, target: 7.5 },
  { month: "Feb", actual: 7.3, target: 7.5 },
  { month: "Mar", actual: 7.6, target: 7.5 },
  { month: "Apr", actual: 7.8, target: 7.5 },
  { month: "May", actual: 7.9, target: 7.5 },
  { month: "Jun", actual: 7.7, target: 7.5 },
]

const maintenanceCostData = [
  { month: "Jan", preventive: 12500, repair: 8500 },
  { month: "Feb", preventive: 13200, repair: 7800 },
  { month: "Mar", preventive: 14000, repair: 6500 },
  { month: "Apr", preventive: 13800, repair: 5900 },
  { month: "May", preventive: 14200, repair: 5200 },
  { month: "Jun", preventive: 14500, repair: 4800 },
]

// Mock data for maintenance schedule
const maintenanceEvents = [
  {
    id: "M001",
    vehicleId: "TRK-002",
    type: "Regular Service",
    date: new Date("2023-05-25"),
    technician: "Robert Johnson",
    notes: "Oil change, filter replacement, brake inspection",
  },
  {
    id: "M002",
    vehicleId: "FRK-001",
    type: "Major Repair",
    date: new Date("2023-05-26"),
    technician: "Michael Chen",
    notes: "Hydraulic system repair, engine diagnostics",
  },
  {
    id: "M003",
    vehicleId: "VAN-001",
    type: "Regular Service",
    date: new Date("2023-05-28"),
    technician: "Robert Johnson",
    notes: "Tire rotation, fluid check, general inspection",
  },
  {
    id: "M004",
    vehicleId: "TRK-003",
    type: "Inspection",
    date: new Date("2023-05-30"),
    technician: "Sarah Williams",
    notes: "DOT compliance inspection",
  },
  {
    id: "M005",
    vehicleId: "CAR-001",
    type: "Regular Service",
    date: new Date("2023-06-02"),
    technician: "Michael Chen",
    notes: "Oil change, filter replacement",
  },
]

export default function FleetStatusPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [status, setStatus] = useState("")
  const [location, setLocation] = useState("")
  const [vehicleTab, setVehicleTab] = useState("all")
  const [performanceTab, setPerformanceTab] = useState("fuel")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    vehicleId: "",
    maintenanceType: "",
    scheduledDate: "",
    technician: "",
    notes: "",
  })

  // Filter vehicles based on search and filters
  const filteredVehicles = allVehicles.filter((vehicle) => {
    // Apply search filter
    if (
      searchQuery &&
      !vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Apply vehicle type filter
    if (vehicleType && vehicle.type !== vehicleType) {
      return false
    }

    // Apply status filter
    if (status && vehicle.status !== status) {
      return false
    }

    // Apply location filter
    if (location && !vehicle.location.includes(location)) {
      return false
    }

    // Apply tab filter
    if (vehicleTab !== "all" && vehicle.status !== vehicleTab) {
      return false
    }

    return true
  })

  // Get events for selected date
  const selectedDateEvents = maintenanceEvents.filter(
    (event) => selectedDate && event.date.toDateString() === selectedDate.toDateString(),
  )

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setVehicleType("")
    setStatus("")
    setLocation("")
  }

  // Handle schedule form submission
  const handleScheduleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Scheduling maintenance:", scheduleForm)

    // Reset form and close dialog
    setScheduleForm({
      vehicleId: "",
      maintenanceType: "",
      scheduledDate: "",
      technician: "",
      notes: "",
    })
    setIsScheduleDialogOpen(false)

    // Show success message (you could use a toast here)
    alert("Maintenance scheduled successfully!")
  }

  // Get vehicle type icon
  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "truck":
        return <Truck className="h-4 w-4 text-muted-foreground" />
      case "van":
        return <Package className="h-4 w-4 text-muted-foreground" />
      case "car":
        return <Car className="h-4 w-4 text-muted-foreground" />
      case "forklift":
        return <Forklift className="h-4 w-4 text-muted-foreground" />
      default:
        return <Truck className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Active</span>
          </Badge>
        )
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            <Wrench className="h-3 w-3 text-yellow-500" />
            <span>Maintenance</span>
          </Badge>
        )
      case "available":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            <Clock className="h-3 w-3 text-blue-500" />
            <span>Available</span>
          </Badge>
        )
      case "outOfService":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            <Ban className="h-3 w-3 text-red-500" />
            <span>Out of Service</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <span>Unknown</span>
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Fleet Status"
        pageDes="Monitor and manage your entire fleet with real-time status updates
            and analytics"
      />

      {/* Fleet Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold">{allVehicles.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Active
                </span>
                <span className="font-medium">{allVehicles.filter((v) => v.status === "active").length}</span>
              </div>
              <Progress
                value={(allVehicles.filter((v) => v.status === "active").length / allVehicles.length) * 100}
                className="h-1 bg-muted"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Wrench className="h-4 w-4 text-yellow-500 mr-1" />
                  Maintenance
                </span>
                <span className="font-medium">{allVehicles.filter((v) => v.status === "maintenance").length}</span>
              </div>
              <Progress
                value={(allVehicles.filter((v) => v.status === "maintenance").length / allVehicles.length) * 100}
                className="h-1 bg-muted"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  Available
                </span>
                <span className="font-medium">{allVehicles.filter((v) => v.status === "available").length}</span>
              </div>
              <Progress
                value={(allVehicles.filter((v) => v.status === "available").length / allVehicles.length) * 100}
                className="h-1 bg-muted"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Ban className="h-4 w-4 text-red-500 mr-1" />
                  Out of Service
                </span>
                <span className="font-medium">{allVehicles.filter((v) => v.status === "outOfService").length}</span>
              </div>
              <Progress
                value={(allVehicles.filter((v) => v.status === "outOfService").length / allVehicles.length) * 100}
                className="h-1 bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fleet Efficiency</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={87} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                Overall fleet performance based on uptime, fuel efficiency, and maintenance compliance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fuel Efficiency</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Truck className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={92} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                Average fuel efficiency across all vehicles compared to industry standards
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Maintenance Compliance</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Wrench className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={95} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                Percentage of vehicles with up-to-date maintenance schedules
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by vehicle ID, model, or driver..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:w-auto">
              <select
                className="px-3 py-2 border rounded-md"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="">Vehicle Type</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
                <option value="forklift">Forklift</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="available">Available</option>
                <option value="outOfService">Out of Service</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Miami">Miami</option>
                <option value="Seattle">Seattle</option>
              </select>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">More filters</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Fuel Level Range</DropdownMenuItem>
                    <DropdownMenuItem>Mileage Range</DropdownMenuItem>
                    <DropdownMenuItem>Maintenance Due Date</DropdownMenuItem>
                    <DropdownMenuItem>Driver Assignment</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Save Filter Preset</DropdownMenuItem>
                  <DropdownMenuItem>Load Filter Preset</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchQuery || vehicleType || status || location) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 px-3">
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || vehicleType || status || location) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQuery && (
                <Badge variant="secondary" className="rounded-sm">
                  Search: {searchQuery}
                  <button className="ml-1" onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {vehicleType && (
                <Badge variant="secondary" className="rounded-sm">
                  Type: {vehicleType}
                  <button className="ml-1" onClick={() => setVehicleType("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {status && (
                <Badge variant="secondary" className="rounded-sm">
                  Status: {status}
                  <button className="ml-1" onClick={() => setStatus("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {location && (
                <Badge variant="secondary" className="rounded-sm">
                  Location: {location}
                  <button className="ml-1" onClick={() => setLocation("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fleet Map */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fleet Location Map
            </CardTitle>
            <CardDescription>Real-time location of all vehicles</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-md overflow-hidden border h-[400px] bg-[#f8f9fa] dark:bg-[#111827]">
            {/* Simplified US map for demo */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid meet"
              className="opacity-20 dark:opacity-10"
            >
              <path
                d="M215,220 L240,220 L260,200 L280,210 L300,190 L330,190 L350,170 L380,170 L400,150 L430,150 L450,130 L480,130 L500,110 L530,110 L550,130 L580,130 L600,150 L630,150 L650,170 L680,170 L700,190 L730,190 L750,210 L780,210 L800,230 L830,230 L850,250 L880,250 L900,270 L930,270 L950,290 L980,290"
                fill="none"
                stroke="#ced4da"
                strokeWidth="2"
              />
              <path d="M215,290 L980,290" fill="none" stroke="#ced4da" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M215,350 L980,350" fill="none" stroke="#ced4da" strokeWidth="1" strokeDasharray="5,5" />
            </svg>

            {/* Vehicle markers */}
            {filteredVehicles.map((vehicle) => {
              // Convert coordinates to position on the map (simplified for demo)
              const x = ((vehicle.coordinates[0] + 125) / 70) * 100
              const y = ((vehicle.coordinates[1] - 25) / 25) * 100

              // Get status color
              let color
              switch (vehicle.status) {
                case "active":
                  color = "text-green-500 bg-green-100 dark:bg-green-900"
                  break
                case "maintenance":
                  color = "text-yellow-500 bg-yellow-100 dark:bg-yellow-900"
                  break
                case "available":
                  color = "text-blue-500 bg-blue-100 dark:bg-blue-900"
                  break
                case "outOfService":
                  color = "text-red-500 bg-red-100 dark:bg-red-900"
                  break
                default:
                  color = "text-gray-500 bg-gray-100 dark:bg-gray-900"
              }

              return (
                <div
                  key={vehicle.id}
                  className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center cursor-pointer transition-all ${color} ${selectedVehicle === vehicle.id ? "ring-2 ring-primary z-10 scale-125" : "hover:scale-110"
                    }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? null : vehicle.id)}
                  title={`${vehicle.id}: ${vehicle.model}`}
                >
                  <Truck className="h-5 w-5" />
                </div>
              )
            })}

            {/* Selected vehicle info */}
            {selectedVehicle &&
              (() => {
                const vehicle = allVehicles.find((v) => v.id === selectedVehicle)
                if (!vehicle) return null

                // Convert coordinates to position on the map (simplified for demo)
                const x = ((vehicle.coordinates[0] + 125) / 70) * 100
                const y = ((vehicle.coordinates[1] - 25) / 25) * 100

                return (
                  <div
                    className="absolute z-20 bg-background border rounded-lg shadow-lg p-3 w-64"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -130%)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{vehicle.id}</span>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    <div className="text-sm mb-1">{vehicle.model}</div>
                    <div className="text-sm mb-1">Driver: {vehicle.driver}</div>
                    <div className="text-sm mb-1">Location: {vehicle.location}</div>
                    <div className="flex justify-between text-sm">
                      <span>Fuel: {vehicle.fuelLevel}%</span>
                      <span>Mileage: {vehicle.mileage.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })()}

            {/* Map legend */}
            <div className="absolute bottom-4 right-4 bg-background border rounded-md p-2 shadow-sm">
              <div className="text-xs font-medium mb-1">Vehicle Status</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">Maintenance</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Out of Service</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={vehicleTab} onValueChange={setVehicleTab} className="overflow-x-auto !static">
            <TabsList className="flex flex-wrap gap-2 justify-start h-full w-full sm:w-max">
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
            </TabsList>
            <div className="rounded-md border overflow-x-auto mt-4 p-5">
              <Table className="w-full whitespace-nowrap">
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Type/Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Fuel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getVehicleTypeIcon(vehicle.type)}
                            <span>{vehicle.model}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>{vehicle.driver}</TableCell>
                        <TableCell>{vehicle.location}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              Next: {new Date(vehicle.nextMaintenance).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Last: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${vehicle.fuelLevel > 70
                                    ? "bg-green-500"
                                    : vehicle.fuelLevel > 30
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                style={{ width: `${vehicle.fuelLevel}%` }}
                              />
                            </div>
                            <span className="text-xs">{vehicle.fuelLevel}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No vehicles match your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* <div className="w-full overflow-x-auto">
                <div className="min-w-[800px] rounded-md border mt-4 p-5">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="w-[100px]">ID</th>
                        <th>Type/Model</th>
                        <th>Status</th>
                        <th className="hidden md:table-cell">Driver</th>
                        <th >Location</th>
                        <th >Maintenance</th>
                        <th className="hidden md:table-cell">Fuel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="font-medium">{vehicle.id}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                {getVehicleTypeIcon(vehicle.type)}
                                <span>{vehicle.model}</span>
                              </div>
                            </td>
                            <td>{getStatusBadge(vehicle.status)}</td>
                            <td className="hidden md:table-cell">
                              {vehicle.driver}
                            </td>
                            <td >
                              {vehicle.location}
                            </td>
                            <td >
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                  Next:{" "}
                                  {new Date(
                                    vehicle.nextMaintenance
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Last:{" "}
                                  {new Date(
                                    vehicle.lastMaintenance
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      vehicle.fuelLevel > 70
                                        ? "bg-green-500"
                                        : vehicle.fuelLevel > 30
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${vehicle.fuelLevel}%` }}
                                  />
                                </div>
                                <span className="text-xs">
                                  {vehicle.fuelLevel}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <TableRow>
                          <td colSpan={7} className="text-center py-4">
                            No vehicles match your filters
                          </td>
                        </TableRow>
                      )}
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance and Maintenance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fuel" value={performanceTab} onValueChange={setPerformanceTab}>
              <TabsList className="mb-4 flex  flex-wrap gap-1 h-full justify-start">
                <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance Cost</TabsTrigger>
              </TabsList>

              <TabsContent value="fuel">
                <ChartContainer
                  config={{
                    actual: {
                      label: "Actual (MPG)",
                      color: "hsl(var(--chart-1))",
                    },
                    target: {
                      label: "Target (MPG)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fuelEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[7, 8]} />
                      {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="var(--color-target)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Current Average</div>
                    <div className="mt-1 flex flex-wrap items-end justify-between">
                      <div className="text-2xl font-bold">7.9 MPG</div>
                      <div className="text-sm text-green-600">+5.3% YTD</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Projected Savings</div>
                    <div className="mt-1 flex flex-wrap items-end justify-between">
                      <div className="text-2xl font-bold">$42,800</div>
                      <div className="text-sm text-muted-foreground">Annual</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="maintenance">
                <ChartContainer
                  config={{
                    preventive: {
                      label: "Preventive",
                      color: "hsl(var(--chart-1))",
                    },
                    repair: {
                      label: "Repair",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceCostData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                      <Legend />
                      <Bar dataKey="preventive" fill="var(--color-preventive)" />
                      <Bar dataKey="repair" fill="var(--color-repair)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Preventive vs. Repair</div>
                    <div className="mt-1 flex flex-wrap items-end justify-between">
                      <div className="text-2xl font-bold">75% / 25%</div>
                      <div className="text-sm text-green-600">+12% YTD</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Cost per Mile</div>
                    <div className="mt-1 flex flex-wrap items-end justify-between">
                      <div className="text-2xl font-bold">$0.12</div>
                      <div className="text-sm text-green-600">-8% YTD</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Maintenance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap gap-2 items-center justify-between">
              <span>Maintenance Schedule</span>
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule Maintenance</DialogTitle>
                    <DialogDescription>
                      Schedule a new maintenance appointment for your fleet vehicles.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vehicle" className="text-right">
                        Vehicle
                      </Label>
                      <select
                        id="vehicle"
                        className="col-span-3 px-3 py-2 border rounded-md"
                        value={scheduleForm.vehicleId}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, vehicleId: e.target.value })}
                      >
                        <option value="">Select Vehicle</option>
                        {allVehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.id} - {vehicle.model}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <select
                        id="type"
                        className="col-span-3 px-3 py-2 border rounded-md"
                        value={scheduleForm.maintenanceType}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, maintenanceType: e.target.value })}
                      >
                        <option value="">Select Type</option>
                        <option value="Regular Service">Regular Service</option>
                        <option value="Major Repair">Major Repair</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Emergency Repair">Emergency Repair</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        className="col-span-3"
                        value={scheduleForm.scheduledDate}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="technician" className="text-right">
                        Technician
                      </Label>
                      <select
                        id="technician"
                        className="col-span-3 px-3 py-2 border rounded-md"
                        value={scheduleForm.technician}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, technician: e.target.value })}
                      >
                        <option value="">Select Technician</option>
                        <option value="Robert Johnson">Robert Johnson</option>
                        <option value="Michael Chen">Michael Chen</option>
                        <option value="Sarah Williams">Sarah Williams</option>
                        <option value="David Martinez">David Martinez</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Enter maintenance notes..."
                        className="col-span-3"
                        value={scheduleForm.notes}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleScheduleSubmit}
                      disabled={
                        !scheduleForm.vehicleId ||
                        !scheduleForm.maintenanceType ||
                        !scheduleForm.scheduledDate ||
                        !scheduleForm.technician
                      }
                    >
                      Schedule Maintenance
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
              <div className="w-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full border rounded-md"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    month_caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    button_previous: "absolute left-1 top-2 z-10",
                    button_next: "absolute right-1 top-2 z-10",
                    month_grid: "w-full border-collapse space-y-1",
                    weekdays: "flex",
                    weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",

                    range_end: "day-range-end",
                    selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    today: "bg-accent text-accent-foreground",
                    outside:
                      "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                    disabled: "text-muted-foreground opacity-50",
                    range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    hidden: "invisible",
                  }}
                  modifiers={{
                    maintenance: maintenanceEvents.map((event) => event.date),
                  }}
                  modifiersClassNames={{
                    maintenance: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 font-semibold",
                  }}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  {selectedDate
                    ? selectedDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "Select a date"}
                </h3>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="border rounded-md p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.vehicleId}</span>
                          <span className="text-sm text-muted-foreground">
                            {allVehicles.find((v) => v.id === event.vehicleId)?.model || ""}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">{event.notes}</div>
                        <div className="text-xs text-muted-foreground">Technician: {event.technician}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center border rounded-md p-4">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                    <p className="text-sm text-muted-foreground">
                      {selectedDate
                        ? "No maintenance scheduled for this date"
                        : "Select a date to view scheduled maintenance"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
