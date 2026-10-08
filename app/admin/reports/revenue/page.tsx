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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  BarChart2,
  LineChartIcon,
  PieChartIcon,
  Users,
  Package,
  Building,
  ChevronDown,
  FileText,
  Printer,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for revenue analysis
const revenueOverview = {
  totalRevenue: 2450000,
  monthlyGrowth: 12.5,
  quarterlyGrowth: 8.3,
  yearlyGrowth: 15.7,
  avgOrderValue: 1250,
  totalOrders: 1960,
  profitMargin: 18.5,
};

const monthlyRevenueData = [
  { month: "Jan", revenue: 180000, profit: 32400, orders: 144 },
  { month: "Feb", revenue: 195000, profit: 35100, orders: 156 },
  { month: "Mar", revenue: 210000, profit: 37800, orders: 168 },
  { month: "Apr", revenue: 225000, profit: 40500, orders: 180 },
  { month: "May", revenue: 240000, profit: 43200, orders: 192 },
  { month: "Jun", revenue: 255000, profit: 45900, orders: 204 },
  { month: "Jul", revenue: 270000, profit: 48600, orders: 216 },
  { month: "Aug", revenue: 285000, profit: 51300, orders: 228 },
  { month: "Sep", revenue: 300000, profit: 54000, orders: 240 },
  { month: "Oct", revenue: 315000, profit: 56700, orders: 252 },
  { month: "Nov", revenue: 330000, profit: 59400, orders: 264 },
  { month: "Dec", revenue: 345000, profit: 62100, orders: 276 },
];

const revenueByServiceData = [
  {
    service: "Freight Shipping",
    revenue: 980000,
    percentage: 40,
    color: "#8884d8",
  },
  { service: "Warehousing", revenue: 612500, percentage: 25, color: "#82ca9d" },
  {
    service: "Last Mile Delivery",
    revenue: 490000,
    percentage: 20,
    color: "#ffc658",
  },
  {
    service: "Express Services",
    revenue: 245000,
    percentage: 10,
    color: "#ff7300",
  },
  {
    service: "Logistics Consulting",
    revenue: 122500,
    percentage: 5,
    color: "#00ff00",
  },
];

const revenueByClientData = [
  {
    client: "Enterprise Clients",
    revenue: 1225000,
    percentage: 50,
    growth: 15.2,
  },
  { client: "SMB Clients", revenue: 735000, percentage: 30, growth: 8.7 },
  { client: "E-commerce", revenue: 367500, percentage: 15, growth: 22.1 },
  { client: "Government", revenue: 122500, percentage: 5, growth: 5.3 },
];

const quarterlyComparisonData = [
  { quarter: "Q1 2023", revenue: 585000, profit: 105300 },
  { quarter: "Q2 2023", revenue: 720000, profit: 129600 },
  { quarter: "Q3 2023", revenue: 855000, profit: 153900 },
  { quarter: "Q4 2023", revenue: 990000, profit: 178200 },
  { quarter: "Q1 2024", revenue: 675000, profit: 121500 },
];

export default function RevenueAnalysisPage() {
  const [dateRange, setDateRange] = useState("12months");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Analysis
          </h1>
          <p className="text-muted-foreground">
            Comprehensive revenue insights and financial performance metrics
          </p>
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="2years">Last 2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceFilter">Service Type</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="freight">Freight Shipping</SelectItem>
                  <SelectItem value="warehousing">Warehousing</SelectItem>
                  <SelectItem value="delivery">Last Mile Delivery</SelectItem>
                  <SelectItem value="express">Express Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientFilter">Client Segment</Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="smb">SMB</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <div className="flex space-x-1">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("area")}
                >
                  <PieChartIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueOverview.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {formatPercentage(revenueOverview.yearlyGrowth)} from last year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Growth
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(revenueOverview.monthlyGrowth)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Consistent upward trend
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueOverview.avgOrderValue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {revenueOverview.totalOrders.toLocaleString()} total orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Building className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueOverview.profitMargin}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Above industry average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 justify-start sm:w-max h-max">
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="services">By Services</TabsTrigger>
          <TabsTrigger value="clients">By Clients</TabsTrigger>
          <TabsTrigger value="comparison">Quarterly Comparison</TabsTrigger>
        </TabsList>

        {/* Revenue Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue & Profit Trends</CardTitle>
              <CardDescription>
                Revenue and profit performance over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === "revenue" ? "Revenue" : "Profit",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                      <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
                    </BarChart>
                  ) : chartType === "line" ? (
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === "revenue" ? "Revenue" : "Profit",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === "revenue" ? "Revenue" : "Profit",
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stackId="2"
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

        {/* Revenue by Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution by Service</CardTitle>
                <CardDescription>
                  Breakdown of revenue by service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByServiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${percent}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {revenueByServiceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Details</CardTitle>
                <CardDescription>
                  Detailed breakdown with percentages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByServiceData.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: service.color }}
                        />
                        <div>
                          <p className="font-medium">{service.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.percentage}% of total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(service.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue by Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Client Segment</CardTitle>
              <CardDescription>
                Client segment performance and growth rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByClientData.map((client, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{client.client}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.percentage}% of total revenue
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-lg">
                        {formatCurrency(client.revenue)}
                      </p>
                      <Badge
                        variant={client.growth > 10 ? "default" : "secondary"}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {formatPercentage(client.growth)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quarterly Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Revenue Comparison</CardTitle>
              <CardDescription>
                Quarter-over-quarter revenue and profit analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name === "revenue" ? "Revenue" : "Profit",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                    <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
