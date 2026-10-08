"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Truck,
  TrendingUp,
  Fuel,
  BarChart2,
  LineChartIcon,
  Download,
  Calendar,
  Search,
  Activity,
  Gauge,
  Wrench,
  ChevronDown,
  FileText,
  Printer,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for fleet efficiency
const fleetOverviewData = {
  totalVehicles: 156,
  activeVehicles: 142,
  utilizationRate: 91.0,
  avgFuelEfficiency: 8.2,
  totalMileage: 2847392,
  maintenanceCost: 284750,
  monthlyGrowth: 5.2,
  fuelCostSavings: 12.8,
};

const efficiencyTrendsData = [
  {
    month: "Jan",
    utilization: 88,
    fuelEfficiency: 7.8,
    maintenance: 22000,
    revenue: 450000,
  },
  {
    month: "Feb",
    utilization: 85,
    fuelEfficiency: 8.1,
    maintenance: 18500,
    revenue: 425000,
  },
  {
    month: "Mar",
    utilization: 92,
    fuelEfficiency: 8.3,
    maintenance: 25000,
    revenue: 520000,
  },
  {
    month: "Apr",
    utilization: 89,
    fuelEfficiency: 8.0,
    maintenance: 21000,
    revenue: 485000,
  },
  {
    month: "May",
    utilization: 94,
    fuelEfficiency: 8.4,
    maintenance: 19500,
    revenue: 545000,
  },
  {
    month: "Jun",
    utilization: 91,
    fuelEfficiency: 8.2,
    maintenance: 23500,
    revenue: 510000,
  },
  {
    month: "Jul",
    utilization: 93,
    fuelEfficiency: 8.5,
    maintenance: 20000,
    revenue: 535000,
  },
  {
    month: "Aug",
    utilization: 90,
    fuelEfficiency: 8.1,
    maintenance: 24000,
    revenue: 495000,
  },
  {
    month: "Sep",
    utilization: 95,
    fuelEfficiency: 8.6,
    maintenance: 18000,
    revenue: 560000,
  },
  {
    month: "Oct",
    utilization: 92,
    fuelEfficiency: 8.3,
    maintenance: 22500,
    revenue: 525000,
  },
  {
    month: "Nov",
    utilization: 89,
    fuelEfficiency: 8.0,
    maintenance: 26000,
    revenue: 480000,
  },
  {
    month: "Dec",
    utilization: 91,
    fuelEfficiency: 8.2,
    maintenance: 21500,
    revenue: 515000,
  },
];

const vehicleTypeData = [
  {
    type: "Heavy Trucks",
    count: 45,
    utilization: 94,
    efficiency: 6.8,
    color: "#8884d8",
  },
  {
    type: "Medium Trucks",
    count: 62,
    utilization: 89,
    efficiency: 8.5,
    color: "#82ca9d",
  },
  {
    type: "Light Trucks",
    count: 35,
    utilization: 87,
    efficiency: 12.2,
    color: "#ffc658",
  },
  {
    type: "Vans",
    count: 14,
    utilization: 92,
    efficiency: 15.8,
    color: "#ff7300",
  },
];

const routeEfficiencyData = [
  {
    route: "Route A-1",
    distance: 245,
    time: 4.2,
    fuel: 28.5,
    efficiency: 95,
    trips: 156,
  },
  {
    route: "Route B-2",
    distance: 180,
    time: 3.1,
    fuel: 21.2,
    efficiency: 92,
    trips: 134,
  },
  {
    route: "Route C-3",
    distance: 320,
    time: 5.8,
    fuel: 38.4,
    efficiency: 88,
    trips: 98,
  },
  {
    route: "Route D-4",
    distance: 150,
    time: 2.5,
    fuel: 17.8,
    efficiency: 96,
    trips: 187,
  },
  {
    route: "Route E-5",
    distance: 280,
    time: 4.9,
    fuel: 33.2,
    efficiency: 90,
    trips: 112,
  },
];

const maintenanceData = [
  { month: "Jan", scheduled: 12, unscheduled: 8, cost: 22000, downtime: 48 },
  { month: "Feb", scheduled: 15, unscheduled: 5, cost: 18500, downtime: 32 },
  { month: "Mar", scheduled: 18, unscheduled: 7, cost: 25000, downtime: 42 },
  { month: "Apr", scheduled: 14, unscheduled: 6, cost: 21000, downtime: 38 },
  { month: "May", scheduled: 16, unscheduled: 4, cost: 19500, downtime: 28 },
  { month: "Jun", scheduled: 13, unscheduled: 9, cost: 23500, downtime: 52 },
];

export default function FleetEfficiencyPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("line");
  const [selectedVehicleType, setSelectedVehicleType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Fleet Efficiency Analysis"
        pageDes="Monitor and analyze fleet performance, utilization, and operational efficiency"
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="period">Time Period:</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="12M">12 Months</SelectItem>
                  <SelectItem value="2Y">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="vehicle-type">Vehicle Type:</Label>
              <Select
                value={selectedVehicleType}
                onValueChange={setSelectedVehicleType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="heavy">Heavy Trucks</SelectItem>
                  <SelectItem value="medium">Medium Trucks</SelectItem>
                  <SelectItem value="light">Light Trucks</SelectItem>
                  <SelectItem value="vans">Vans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
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
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fleet Utilization
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Gauge className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetOverviewData.utilizationRate}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+
              {fleetOverviewData.monthlyGrowth}% from last month
            </div>
            <Progress
              value={fleetOverviewData.utilizationRate}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fuel Efficiency
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Fuel className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetOverviewData.avgFuelEfficiency} km/L
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {fleetOverviewData.fuelCostSavings}% cost savings
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              vs industry average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vehicles
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetOverviewData.activeVehicles}
            </div>
            <div className="text-xs text-muted-foreground">
              of {fleetOverviewData.totalVehicles} total vehicles
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              {Math.round(
                (fleetOverviewData.activeVehicles /
                  fleetOverviewData.totalVehicles) *
                100
              )}
              % operational
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maintenance Cost
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Wrench className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(fleetOverviewData.maintenanceCost)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(fleetOverviewData.totalMileage)} km total
            </div>
            <div className="text-xs text-orange-600 mt-1">
              $
              {(
                (fleetOverviewData.maintenanceCost /
                  fleetOverviewData.totalMileage) *
                1000
              ).toFixed(2)}
              /1000km
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 justify-start sm:w-max h-max">
          <TabsTrigger value="trends">Efficiency Trends</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Analysis</TabsTrigger>
          <TabsTrigger value="routes">Route Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          {/* Efficiency Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <CardTitle>Fleet Efficiency Trends</CardTitle>
                  <CardDescription>
                    Monthly utilization, fuel efficiency, and maintenance costs
                  </CardDescription>
                </div>
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
                  <Button
                    variant={chartType === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Area
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={efficiencyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "maintenance")
                            return [
                              formatCurrency(Number(value)),
                              "Maintenance Cost",
                            ];
                          if (name === "revenue")
                            return [formatCurrency(Number(value)), "Revenue"];
                          if (name === "utilization")
                            return [`${value}%`, "Utilization"];
                          if (name === "fuelEfficiency")
                            return [`${value} km/L`, "Fuel Efficiency"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="utilization"
                        name="Utilization (%)"
                        fill="#8884d8"
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="fuelEfficiency"
                        name="Fuel Efficiency"
                        fill="#82ca9d"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="maintenance"
                        name="Maintenance Cost"
                        fill="#ffc658"
                      />
                    </BarChart>
                  ) : chartType === "line" ? (
                    <LineChart data={efficiencyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "maintenance")
                            return [
                              formatCurrency(Number(value)),
                              "Maintenance Cost",
                            ];
                          if (name === "revenue")
                            return [formatCurrency(Number(value)), "Revenue"];
                          if (name === "utilization")
                            return [`${value}%`, "Utilization"];
                          if (name === "fuelEfficiency")
                            return [`${value} km/L`, "Fuel Efficiency"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="utilization"
                        name="Utilization (%)"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="fuelEfficiency"
                        name="Fuel Efficiency"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="maintenance"
                        name="Maintenance Cost"
                        stroke="#ffc658"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={efficiencyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "utilization")
                            return [`${value}%`, "Utilization"];
                          if (name === "fuelEfficiency")
                            return [`${value} km/L`, "Fuel Efficiency"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="utilization"
                        stackId="1"
                        name="Utilization (%)"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="fuelEfficiency"
                        stackId="2"
                        name="Fuel Efficiency"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vehicle Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Fleet Composition</CardTitle>
                <CardDescription>Vehicle distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {/* <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, count }) => `${type}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie> */}
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Type Performance</CardTitle>
                <CardDescription>
                  Utilization and efficiency by vehicle type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypeData.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{vehicle.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.count} vehicles
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {vehicle.utilization}% util
                          </Badge>
                          <Badge variant="outline">
                            {vehicle.efficiency} km/L
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
              <CardDescription>
                Efficiency metrics for different routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Route</th>
                      <th className="text-left p-2">Distance (km)</th>
                      <th className="text-left p-2">Avg Time (hrs)</th>
                      <th className="text-left p-2">Fuel Usage (L)</th>
                      <th className="text-left p-2">Efficiency</th>
                      <th className="text-left p-2">Total Trips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeEfficiencyData.map((route, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{route.route}</td>
                        <td className="p-2">{route.distance}</td>
                        <td className="p-2">{route.time}</td>
                        <td className="p-2">{route.fuel}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={route.efficiency}
                              className="w-16"
                            />
                            <span className="text-sm">{route.efficiency}%</span>
                          </div>
                        </td>
                        <td className="p-2">{route.trips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            {/* Maintenance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Trends</CardTitle>
                <CardDescription>
                  Scheduled vs unscheduled maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="scheduled"
                        name="Scheduled"
                        fill="#82ca9d"
                      />
                      <Bar
                        dataKey="unscheduled"
                        name="Unscheduled"
                        fill="#ff7300"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Costs & Downtime</CardTitle>
                <CardDescription>
                  Monthly maintenance expenses and vehicle downtime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={maintenanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "cost")
                            return [
                              formatCurrency(Number(value)),
                              "Maintenance Cost",
                            ];
                          if (name === "downtime")
                            return [`${value} hours`, "Downtime"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="cost"
                        name="Cost"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="downtime"
                        name="Downtime (hrs)"
                        stroke="#ff7300"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
