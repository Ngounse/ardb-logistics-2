"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Search,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  MapPin,
  Filter,
  ArrowUpDown,
  BarChart2,
  LineChartIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ChevronDown,
  FileText,
  Printer,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for delivery performance
const deliveryPerformanceData = {
  summary: {
    totalDeliveries: 1248,
    onTimeDeliveries: 1072,
    delayedDeliveries: 171,
    onTimePercentage: 85.9,
    averageDeliveryTime: "2.3 days",
    customerSatisfaction: 4.2,
  },
  trends: [
    { month: "Jan", onTime: 82, delayed: 18 },
    { month: "Feb", onTime: 84, delayed: 16 },
    { month: "Mar", onTime: 80, delayed: 20 },
    { month: "Apr", onTime: 83, delayed: 17 },
    { month: "May", onTime: 86, delayed: 14 },
    { month: "Jun", onTime: 88, delayed: 12 },
    { month: "Jul", onTime: 85, delayed: 15 },
    { month: "Aug", onTime: 87, delayed: 13 },
    { month: "Sep", onTime: 89, delayed: 11 },
    { month: "Oct", onTime: 86, delayed: 14 },
    { month: "Nov", onTime: 84, delayed: 16 },
    { month: "Dec", onTime: 85, delayed: 15 },
  ],
  carriers: [
    { name: "Express Logistics", onTimePercentage: 92, deliveries: 420, averageDelay: "0.8 days" },
    { name: "Swift Carriers", onTimePercentage: 88, deliveries: 356, averageDelay: "1.2 days" },
    { name: "Global Shipping", onTimePercentage: 79, deliveries: 284, averageDelay: "1.9 days" },
    { name: "Metro Delivery", onTimePercentage: 84, deliveries: 188, averageDelay: "1.5 days" },
  ],
  regions: [
    {
      name: "North",
      onTimePercentage: 88,
      deliveries: 312,
      coordinates: { x: 45, y: 20 },
      cities: ["New York", "Boston", "Chicago", "Detroit"],
      averageDelay: "1.2 days",
      topIssues: ["Weather Conditions", "Traffic Congestion"],
    },
    {
      name: "South",
      onTimePercentage: 82,
      deliveries: 298,
      coordinates: { x: 45, y: 70 },
      cities: ["Miami", "Atlanta", "Houston", "Dallas"],
      averageDelay: "1.8 days",
      topIssues: ["Hurricane Season", "Port Congestion"],
    },
    {
      name: "East",
      onTimePercentage: 86,
      deliveries: 342,
      coordinates: { x: 75, y: 45 },
      cities: ["Philadelphia", "Washington DC", "Charlotte", "Jacksonville"],
      averageDelay: "1.4 days",
      topIssues: ["Urban Traffic", "Infrastructure"],
    },
    {
      name: "West",
      onTimePercentage: 87,
      deliveries: 296,
      coordinates: { x: 15, y: 45 },
      cities: ["Los Angeles", "San Francisco", "Seattle", "Portland"],
      averageDelay: "1.3 days",
      topIssues: ["Wildfires", "Port Delays"],
    },
  ],
  delayReasons: [
    { reason: "Weather Conditions", percentage: 32 },
    { reason: "Traffic Congestion", percentage: 28 },
    { reason: "Vehicle Breakdown", percentage: 15 },
    { reason: "Staff Shortage", percentage: 12 },
    { reason: "Incorrect Address", percentage: 8 },
    { reason: "Other", percentage: 5 },
  ],
  deliveryDetails: [
    {
      id: "DEL-001",
      orderId: "ORD-2024-001",
      customer: "John Doe",
      destination: "New York, NY",
      carrier: "Express Logistics",
      status: "delivered",
      scheduledDate: "2024-01-15",
      actualDate: "2024-01-15",
      onTime: true,
      delay: "0 days",
    },
    {
      id: "DEL-002",
      orderId: "ORD-2024-045",
      customer: "Jane Smith",
      destination: "Los Angeles, CA",
      carrier: "Swift Carriers",
      status: "delivered",
      scheduledDate: "2024-01-18",
      actualDate: "2024-01-20",
      onTime: false,
      delay: "2 days",
    },
    {
      id: "DEL-003",
      orderId: "ORD-2024-089",
      customer: "Mike Johnson",
      destination: "Chicago, IL",
      carrier: "Global Shipping",
      status: "delivered",
      scheduledDate: "2024-01-20",
      actualDate: "2024-01-20",
      onTime: true,
      delay: "0 days",
    },
    {
      id: "DEL-004",
      orderId: "ORD-2024-102",
      customer: "Sarah Wilson",
      destination: "Houston, TX",
      carrier: "Metro Delivery",
      status: "delivered",
      scheduledDate: "2024-01-22",
      actualDate: "2024-01-25",
      onTime: false,
      delay: "3 days",
    },
    {
      id: "DEL-005",
      orderId: "ORD-2024-156",
      customer: "Robert Brown",
      destination: "Phoenix, AZ",
      carrier: "Express Logistics",
      status: "delivered",
      scheduledDate: "2024-01-25",
      actualDate: "2024-01-25",
      onTime: true,
      delay: "0 days",
    },
    {
      id: "DEL-006",
      orderId: "ORD-2024-178",
      customer: "Emily Davis",
      destination: "Philadelphia, PA",
      carrier: "Swift Carriers",
      status: "in-transit",
      scheduledDate: "2024-01-28",
      actualDate: "",
      onTime: null,
      delay: "N/A",
    },
    {
      id: "DEL-007",
      orderId: "ORD-2024-203",
      customer: "David Wilson",
      destination: "San Antonio, TX",
      carrier: "Global Shipping",
      status: "delayed",
      scheduledDate: "2024-01-26",
      actualDate: "",
      onTime: false,
      delay: "Estimated 2 days",
    },
  ],
}

// Status configuration for styling
const statusConfig = {
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: Truck,
  },
  delayed: {
    label: "Delayed",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: AlertTriangle,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
  },
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

// Interactive Map Component
function DeliveryPerformanceMap({
  regions,
  selectedRegion,
  onRegionSelect,
}: {
  regions: typeof deliveryPerformanceData.regions
  selectedRegion: (typeof deliveryPerformanceData.regions)[0] | null
  onRegionSelect: (region: (typeof deliveryPerformanceData.regions)[0]) => void
}) {
  const [mapZoom, setMapZoom] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })

  const getRegionColor = (onTimePercentage: number) => {
    if (onTimePercentage >= 90) return "#10b981" // green-500
    if (onTimePercentage >= 85) return "#3b82f6" // blue-500
    if (onTimePercentage >= 80) return "#f59e0b" // amber-500
    return "#ef4444" // red-500
  }

  const resetMap = () => {
    setMapZoom(1)
    setMapPosition({ x: 0, y: 0 })
  }

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 2))}
          className="bg-background/80 backdrop-blur-sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.5))}
          className="bg-background/80 backdrop-blur-sm"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={resetMap} className="bg-background/80 backdrop-blur-sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div
        className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border"
        style={{
          transform: `scale(${mapZoom}) translate(${mapPosition.x}px, ${mapPosition.y}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* US Map Outline (Simplified) */}
        <svg
          viewBox="0 0 100 60"
          className="absolute inset-0 w-full h-full"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
        >
          {/* Simplified US Map Path */}
          <path
            d="M10,15 L85,15 L85,45 L75,50 L25,50 L15,45 Z"
            fill="rgba(156, 163, 175, 0.3)"
            stroke="rgba(156, 163, 175, 0.5)"
            strokeWidth="0.5"
          />

          {/* State Boundaries (Simplified) */}
          <g stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.3" fill="none">
            <line x1="30" y1="15" x2="30" y2="50" />
            <line x1="50" y1="15" x2="50" y2="50" />
            <line x1="70" y1="15" x2="70" y2="50" />
            <line x1="10" y1="30" x2="85" y2="30" />
          </g>
        </svg>

        {/* Regional Performance Indicators */}
        {regions.map((region, index) => (
          <div
            key={region.name}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
            style={{
              left: `${region.coordinates.x}%`,
              top: `${region.coordinates.y}%`,
            }}
            onClick={() => onRegionSelect(region)}
          >
            {/* Performance Circle */}
            <div
              className={`w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm ${
                selectedRegion?.name === region.name ? "ring-4 ring-blue-400 ring-opacity-50" : ""
              }`}
              style={{
                backgroundColor: getRegionColor(region.onTimePercentage),
                animation: selectedRegion?.name === region.name ? "pulse 2s infinite" : "none",
              }}
            >
              {region.onTimePercentage}%
            </div>

            {/* Region Label */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border shadow-sm whitespace-nowrap">
              {region.name}
            </div>

            {/* Delivery Count Badge */}
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              {region.deliveries}
            </div>
          </div>
        ))}

        {/* Performance Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
          <h4 className="text-sm font-medium mb-2">Performance Scale</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>90%+ Excellent</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>85-89% Good</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>80-84% Fair</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{"<80%"} Poor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{selectedRegion.name} Region Details</h3>
            <Badge
              variant="secondary"
              className={`${
                selectedRegion.onTimePercentage >= 90
                  ? "bg-green-100 text-green-800"
                  : selectedRegion.onTimePercentage >= 85
                    ? "bg-blue-100 text-blue-800"
                    : selectedRegion.onTimePercentage >= 80
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {selectedRegion.onTimePercentage}% On-Time
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Deliveries:</span>
                  <span className="font-medium">{selectedRegion.deliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Delay:</span>
                  <span className="font-medium">{selectedRegion.averageDelay}</span>
                </div>
                <div className="flex justify-between">
                  <span>On-Time Rate:</span>
                  <span className="font-medium">{selectedRegion.onTimePercentage}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Major Cities</h4>
              <div className="flex flex-wrap gap-1">
                {selectedRegion.cities.map((city, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {city}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Top Issues</h4>
              <div className="space-y-1">
                {selectedRegion.topIssues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DeliveryPerformancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [carrierFilter, setCarrierFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("scheduledDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [chartType, setChartType] = useState("bar")
  const [selectedRegion, setSelectedRegion] = useState<(typeof deliveryPerformanceData.regions)[0] | null>(null)

  // Filter delivery details based on search and filters
  const filteredDeliveries = deliveryPerformanceData.deliveryDetails.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCarrier = carrierFilter === "all" || delivery.carrier === carrierFilter
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter

    return matchesSearch && matchesCarrier && matchesStatus
  })

  // Sort filtered deliveries
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a]
    let bValue: any = b[sortField as keyof typeof b]

    // Handle date comparison
    if (sortField === "scheduledDate" || sortField === "actualDate") {
      aValue = aValue && typeof aValue === "string" ? new Date(aValue).getTime() : 0
      bValue = bValue && typeof bValue === "string" ? new Date(bValue).getTime() : 0
    }

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openDeliveryDetails = (delivery: any) => {
    setSelectedDelivery(delivery)
    setShowDetailModal(true)
  }

  const handleRegionSelect = (region: (typeof deliveryPerformanceData.regions)[0]) => {
    setSelectedRegion(region)
  }

  // Prepare data for the on-time vs delayed chart
  const onTimeVsDelayedData = [
    { name: "On Time", value: deliveryPerformanceData.summary.onTimeDeliveries },
    { name: "Delayed", value: deliveryPerformanceData.summary.delayedDeliveries },
  ]

  // Prepare data for the delay reasons chart
  const delayReasonsData = deliveryPerformanceData.delayReasons.map((item) => ({
    name: item.reason,
    value: item.percentage,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Delivery Performance</h1>
          <p className="text-muted-foreground">Monitor and analyze delivery metrics and carrier performance</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="flex flex-wrap gap-2 sm:w-max h-max justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery Rate</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryPerformanceData.summary.onTimePercentage}%</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </div>
                <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${deliveryPerformanceData.summary.onTimePercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
                <div className="p-2 bg-green-100 rounded-full">
                  <Clock className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryPerformanceData.summary.averageDeliveryTime}</div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-xs text-muted-foreground">-0.3 days from last month</p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Fastest</span>
                    <span>1.1 days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Average</span>
                    <span>2.3 days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Slowest</span>
                    <span>4.7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryPerformanceData.summary.customerSatisfaction}/5</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-xs text-muted-foreground">+0.3 from last month</p>
                </div>
                <div className="mt-3 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(deliveryPerformanceData.summary.customerSatisfaction)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <CardTitle>Delivery Performance Trends</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={chartType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    <LineChartIcon className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                </div>
              </div>
              <CardDescription>Monthly on-time vs. delayed delivery percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={deliveryPerformanceData.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" name="On Time" fill="#0088FE" />
                      <Bar dataKey="delayed" name="Delayed" fill="#FF8042" />
                    </BarChart>
                  ) : (
                    <LineChart data={deliveryPerformanceData.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="onTime"
                        name="On Time"
                        stroke="#0088FE"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="delayed"
                        name="Delayed"
                        stroke="#FF8042"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Charts Row */}
          <div className="grid gap-4 xl:grid-cols-2">
            {/* On-Time vs Delayed Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>On-Time vs Delayed Deliveries</CardTitle>
                <CardDescription>Distribution of delivery statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={onTimeVsDelayedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {onTimeVsDelayedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} deliveries`, ""]} labelFormatter={() => ""} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Delay Reasons Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Delay Reasons</CardTitle>
                <CardDescription>Common causes for delivery delays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={delayReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {delayReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, ""]} labelFormatter={(name) => name} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carriers Tab */}
        <TabsContent value="carriers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Performance</CardTitle>
              <CardDescription>Comparison of delivery performance across carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deliveryPerformanceData.carriers}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="onTimePercentage" name="On-Time Percentage" fill="#0088FE" />
                    <Bar yAxisId="right" dataKey="deliveries" name="Total Deliveries" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Details</CardTitle>
              <CardDescription>Detailed performance metrics for each carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium">Carrier</th>
                        <th className="p-4 text-left font-medium">On-Time %</th>
                        <th className="p-4 text-left font-medium">Total Deliveries</th>
                        <th className="p-4 text-left font-medium">Avg. Delay</th>
                        <th className="p-4 text-left font-medium">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryPerformanceData.carriers.map((carrier, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{carrier.name}</td>
                          <td className="p-4">{carrier.onTimePercentage}%</td>
                          <td className="p-4">{carrier.deliveries}</td>
                          <td className="p-4">{carrier.averageDelay}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    carrier.onTimePercentage >= 90
                                      ? "bg-green-500"
                                      : carrier.onTimePercentage >= 80
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${carrier.onTimePercentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs">{carrier.onTimePercentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Delivery performance across different regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deliveryPerformanceData.regions}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="onTimePercentage" name="On-Time Percentage" fill="#0088FE" />
                    <Bar yAxisId="right" dataKey="deliveries" name="Total Deliveries" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Delivery Performance Map */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <CardTitle>Delivery Performance Map</CardTitle>
                  <CardDescription>Interactive visualization of regional delivery performance</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DeliveryPerformanceMap
                regions={deliveryPerformanceData.regions}
                selectedRegion={selectedRegion}
                onRegionSelect={handleRegionSelect}
              />
            </CardContent>
          </Card>

          {/* Regional Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Details</CardTitle>
              <CardDescription>Detailed performance metrics for each region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium">Region</th>
                        <th className="p-4 text-left font-medium">On-Time %</th>
                        <th className="p-4 text-left font-medium">Total Deliveries</th>
                        <th className="p-4 text-left font-medium">Avg. Delay</th>
                        <th className="p-4 text-left font-medium">Major Cities</th>
                        <th className="p-4 text-left font-medium">Top Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryPerformanceData.regions.map((region, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{region.name}</td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className={`${
                                region.onTimePercentage >= 90
                                  ? "bg-green-100 text-green-800"
                                  : region.onTimePercentage >= 85
                                    ? "bg-blue-100 text-blue-800"
                                    : region.onTimePercentage >= 80
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {region.onTimePercentage}%
                            </Badge>
                          </td>
                          <td className="p-4">{region.deliveries}</td>
                          <td className="p-4">{region.averageDelay}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {region.cities.slice(0, 2).map((city, cityIndex) => (
                                <Badge key={cityIndex} variant="outline" className="text-xs">
                                  {city}
                                </Badge>
                              ))}
                              {region.cities.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{region.cities.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {region.topIssues.map((issue, issueIndex) => (
                                <div key={issueIndex} className="flex items-center gap-1 text-xs">
                                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                                  <span>{issue}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliveries Tab */}
        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Detailed list of recent deliveries and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by ID, order, customer, or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      {deliveryPerformanceData.carriers.map((carrier, index) => (
                        <SelectItem key={index} value={carrier.name}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Deliveries Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium cursor-pointer" onClick={() => handleSort("id")}>
                          <div className="flex items-center">
                            Delivery ID
                            {sortField === "id" && <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />}
                          </div>
                        </th>
                        <th className="p-4 text-left font-medium cursor-pointer" onClick={() => handleSort("customer")}>
                          <div className="flex items-center">
                            Customer
                            {sortField === "customer" && <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />}
                          </div>
                        </th>
                        <th
                          className="p-4 text-left font-medium cursor-pointer"
                          onClick={() => handleSort("destination")}
                        >
                          <div className="flex items-center">
                            Destination
                            {sortField === "destination" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </th>
                        <th className="p-4 text-left font-medium cursor-pointer" onClick={() => handleSort("carrier")}>
                          <div className="flex items-center">
                            Carrier
                            {sortField === "carrier" && <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />}
                          </div>
                        </th>
                        <th className="p-4 text-left font-medium cursor-pointer" onClick={() => handleSort("status")}>
                          <div className="flex items-center">
                            Status
                            {sortField === "status" && <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />}
                          </div>
                        </th>
                        <th
                          className="p-4 text-left font-medium cursor-pointer"
                          onClick={() => handleSort("scheduledDate")}
                        >
                          <div className="flex items-center">
                            Scheduled
                            {sortField === "scheduledDate" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </th>
                        <th
                          className="p-4 text-left font-medium cursor-pointer"
                          onClick={() => handleSort("actualDate")}
                        >
                          <div className="flex items-center">
                            Actual
                            {sortField === "actualDate" && (
                              <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </th>
                        <th className="p-4 text-left font-medium cursor-pointer" onClick={() => handleSort("onTime")}>
                          <div className="flex items-center">
                            On Time
                            {sortField === "onTime" && <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDeliveries.map((delivery, index) => {
                        const StatusIcon = delivery.status
                          ? statusConfig[delivery.status as keyof typeof statusConfig].icon
                          : Clock
                        return (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => openDeliveryDetails(delivery)}
                          >
                            <td className="p-4">
                              <div className="font-medium">{delivery.id}</div>
                              <div className="text-sm text-muted-foreground">{delivery.orderId}</div>
                            </td>
                            <td className="p-4">{delivery.customer}</td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                {delivery.destination}
                              </div>
                            </td>
                            <td className="p-4">{delivery.carrier}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <StatusIcon className="h-4 w-4" />
                                <Badge
                                  variant="secondary"
                                  className={
                                    delivery.status
                                      ? statusConfig[delivery.status as keyof typeof statusConfig].color
                                      : ""
                                  }
                                >
                                  {delivery.status
                                    ? statusConfig[delivery.status as keyof typeof statusConfig].label
                                    : "Unknown"}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4">{delivery.scheduledDate}</td>
                            <td className="p-4">{delivery.actualDate || "-"}</td>
                            <td className="p-4">
                              {delivery.onTime === null ? (
                                <span className="text-muted-foreground">Pending</span>
                              ) : delivery.onTime ? (
                                <span className="flex items-center text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Yes
                                </span>
                              ) : (
                                <span className="flex items-center text-red-600 dark:text-red-400">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  No
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delivery Detail Modal */}
      {showDetailModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDelivery.id}</h2>
                  <p className="text-muted-foreground">Order: {selectedDelivery.orderId}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailModal(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="secondary"
                        className={
                          selectedDelivery.status
                            ? statusConfig[selectedDelivery.status as keyof typeof statusConfig].color
                            : ""
                        }
                      >
                        {selectedDelivery.status
                          ? statusConfig[selectedDelivery.status as keyof typeof statusConfig].label
                          : "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span>{selectedDelivery.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled Date:</span>
                      <span>{selectedDelivery.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actual Date:</span>
                      <span>{selectedDelivery.actualDate || "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">On Time:</span>
                      {selectedDelivery.onTime === null ? (
                        <span>Pending</span>
                      ) : selectedDelivery.onTime ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Yes
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400">
                          <XCircle className="h-4 w-4 mr-1" />
                          No
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delay:</span>
                      <span>{selectedDelivery.delay}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>{selectedDelivery.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span>{selectedDelivery.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact:</span>
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>customer@example.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Delivery Timeline</h3>
                <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 pl-6 py-2 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">Jan 15, 2024 - 10:23 AM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">Jan 15, 2024 - 2:45 PM</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">Jan 16, 2024 - 9:12 AM</p>
                  </div>
                  {selectedDelivery.status === "delivered" ? (
                    <div className="relative">
                      <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">{selectedDelivery.actualDate} - 2:30 PM</p>
                    </div>
                  ) : selectedDelivery.status === "delayed" ? (
                    <div className="relative">
                      <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-yellow-500"></div>
                      <p className="font-medium">Delayed</p>
                      <p className="text-sm text-muted-foreground">
                        Expected delay: {selectedDelivery.delay.replace("Estimated ", "")}
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-muted-foreground">
                        Expected delivery: {selectedDelivery.scheduledDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
