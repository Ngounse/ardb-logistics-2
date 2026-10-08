"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Truck,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MapPin,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Star,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simple widget data structure
interface SimpleWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "list" | "progress" | "table";
  category: string;
  data: any;
  size: "small" | "medium" | "large";
  lastUpdated: string;
}

// Simple Metric Widget Component
function MetricWidget({ widget }: { widget: SimpleWidget }) {
  const { value, change, trend, icon: Icon, color, subtitle } = widget.data;

  return (
    <Card className="relative group hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className={`p-2 bg-primary/10 rounded-full`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          ) : trend === "down" ? (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          ) : null}
          <span
            className={
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : ""
            }
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="ml-1">from last month</span>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Updated: {widget.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}

// Simple Progress Widget Component
function ProgressWidget({ widget }: { widget: SimpleWidget }) {
  const { metrics } = widget.data;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex flex-wrap gap-2 items-center justify-between">
          {widget.title}
          <Badge variant="outline" className="text-xs">
            {metrics.filter((m: any) => m.value >= m.target).length}/
            {metrics.length} targets met
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {metrics.map((metric: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                {metric.label}
                {metric.value >= metric.target && (
                  <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
                )}
              </span>
              <span className="font-medium">
                {metric.value}% / {metric.target}%
              </span>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Updated: {widget.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}

// Simple List Widget Component
function ListWidget({ widget }: { widget: SimpleWidget }) {
  const { items } = widget.data;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {widget.title}
          <Badge variant="outline" className="text-xs">
            {items.filter((item: any) => item.priority === "high").length}{" "}
            urgent
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item: any) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-start space-x-3 p-2 rounded-lg ${
                  item.priority === "high"
                    ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                    : "bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 mt-0.5 ${
                    item.type === "warning"
                      ? "text-orange-500"
                      : item.type === "success"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{item.time}</p>
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground pt-3 border-t mt-3">
          Updated: {widget.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}

// Simple Chart Widget Component
function ChartWidget({ widget }: { widget: SimpleWidget }) {
  const { data, total } = widget.data;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex flex-wrap gap-2 items-center justify-between">
          {widget.title}
          <Badge variant="outline" className="text-xs">
            Total: {total}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg ${item.bgColor} border ${item.borderColor}`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.count} shipments
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <PieChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Chart Visualization</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-3 border-t mt-3">
          Updated: {widget.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}

// Simple Table Widget Component
function TableWidget({ widget }: { widget: SimpleWidget }) {
  const { headers, rows } = widget.data;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-b">
                {headers.map((header: string, index: number) => (
                  <TableHead
                    key={index}
                    className="text-left py-2 text-sm font-medium text-muted-foreground"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, index: number) => (
                <TableRow
                  key={index}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="py-2 text-sm font-medium">
                    {row.route}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    <Badge
                      variant={
                        Number.parseInt(row.efficiency) >= 90
                          ? "default"
                          : "secondary"
                      }
                    >
                      {row.efficiency}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {row.deliveries}
                  </TableCell>
                  <TableCell className="py-2 text-sm">{row.avgTime}</TableCell>
                  <TableCell className="py-2 text-sm">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      {row.rating}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground pt-3 border-t mt-3">
          Updated: {widget.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}

// Main Widget Renderer
function WidgetRenderer({ widget }: { widget: SimpleWidget }) {
  switch (widget.type) {
    case "metric":
      return <MetricWidget widget={widget} />;
    case "progress":
      return <ProgressWidget widget={widget} />;
    case "list":
      return <ListWidget widget={widget} />;
    case "chart":
      return <ChartWidget widget={widget} />;
    case "table":
      return <TableWidget widget={widget} />;
    default:
      return null;
  }
}

export default function WidgetsPage() {
  // Simple widget data
  const [widgets] = useState<SimpleWidget[]>([
    {
      id: "1",
      title: "Active Vehicles",
      type: "metric",
      category: "fleet",
      size: "small",
      lastUpdated: "6:29:25 PM",
      data: {
        value: 142,
        change: 8.2,
        trend: "up",
        icon: Truck,
        color: "text-blue-600 dark:text-blue-400",
        subtitle: "Currently on road",
      },
    },
    {
      id: "2",
      title: "Pending Shipments",
      type: "metric",
      category: "shipments",
      size: "small",
      lastUpdated: "6:29:20 PM",
      data: {
        value: 89,
        change: -3.1,
        trend: "down",
        icon: Package,
        color: "text-orange-600 dark:text-orange-400",
        subtitle: "Awaiting dispatch",
      },
    },
    {
      id: "3",
      title: "Monthly Revenue",
      type: "metric",
      category: "finance",
      size: "small",
      lastUpdated: "6:29:15 PM",
      data: {
        value: "$2.4M",
        change: 12.5,
        trend: "up",
        icon: DollarSign,
        color: "text-green-600 dark:text-green-400",
        subtitle: "This month",
      },
    },
    {
      id: "4",
      title: "Active Drivers",
      type: "metric",
      category: "operations",
      size: "small",
      lastUpdated: "6:29:10 PM",
      data: {
        value: 67,
        change: 2.3,
        trend: "up",
        icon: Users,
        color: "text-purple-600 dark:text-purple-400",
        subtitle: "On duty now",
      },
    },
    {
      id: "5",
      title: "Fleet Performance",
      type: "progress",
      category: "fleet",
      size: "medium",
      lastUpdated: "6:29:05 PM",
      data: {
        metrics: [
          { label: "Fuel Efficiency", value: 85, target: 90 },
          { label: "On-Time Delivery", value: 92, target: 95 },
          { label: "Vehicle Utilization", value: 78, target: 85 },
          { label: "Maintenance Score", value: 88, target: 90 },
        ],
      },
    },
    {
      id: "6",
      title: "System Alerts",
      type: "list",
      category: "operations",
      size: "medium",
      lastUpdated: "6:29:00 PM",
      data: {
        items: [
          {
            id: 1,
            type: "warning",
            message: "Vehicle TRK-001 requires maintenance",
            time: "2 minutes ago",
            icon: AlertTriangle,
            priority: "high",
          },
          {
            id: 2,
            type: "success",
            message: "Shipment delivered successfully",
            time: "15 minutes ago",
            icon: CheckCircle,
            priority: "normal",
          },
          {
            id: 3,
            type: "info",
            message: "Route optimization available",
            time: "1 hour ago",
            icon: MapPin,
            priority: "normal",
          },
        ],
      },
    },
    {
      id: "7",
      title: "Shipment Status",
      type: "chart",
      category: "shipments",
      size: "large",
      lastUpdated: "6:28:55 PM",
      data: {
        total: 234,
        data: [
          {
            name: "Delivered",
            value: 45,
            count: 105,
            color: "#10b981",
            bgColor: "bg-green-50 dark:bg-green-950/20",
            borderColor: "border-green-200 dark:border-green-800",
          },
          {
            name: "In Transit",
            value: 30,
            count: 70,
            color: "#3b82f6",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            borderColor: "border-blue-200 dark:border-blue-800",
          },
          {
            name: "Pending",
            value: 15,
            count: 35,
            color: "#f59e0b",
            bgColor: "bg-amber-50 dark:bg-amber-950/20",
            borderColor: "border-amber-200 dark:border-amber-800",
          },
          {
            name: "Delayed",
            value: 10,
            count: 24,
            color: "#ef4444",
            bgColor: "bg-red-50 dark:bg-red-950/20",
            borderColor: "border-red-200 dark:border-red-800",
          },
        ],
      },
    },
    {
      id: "8",
      title: "Top Routes",
      type: "table",
      category: "analytics",
      size: "large",
      lastUpdated: "6:28:50 PM",
      data: {
        headers: ["Route", "Efficiency", "Deliveries", "Avg Time", "Rating"],
        rows: [
          {
            route: "Route-A47",
            efficiency: "94%",
            deliveries: 28,
            avgTime: "2.3h",
            rating: 4.8,
          },
          {
            route: "Route-B23",
            efficiency: "91%",
            deliveries: 24,
            avgTime: "2.7h",
            rating: 4.6,
          },
          {
            route: "Route-C15",
            efficiency: "89%",
            deliveries: 31,
            avgTime: "3.1h",
            rating: 4.5,
          },
        ],
      },
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simple category filter
  const categories = [
    { value: "all", label: "All Widgets" },
    { value: "fleet", label: "Fleet" },
    { value: "shipments", label: "Shipments" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
    { value: "analytics", label: "Analytics" },
  ];

  // Filter widgets by category
  const filteredWidgets =
    selectedCategory === "all"
      ? widgets
      : widgets.filter((w) => w.category === selectedCategory);

  // Simple refresh all function
  const refreshAll = () => {
    toast({
      title: "Refreshed",
      description: "All widgets have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard Widgets</h2>
        <p className="text-muted-foreground">
          Monitor your logistics operations
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="flex gap-2 flex-wrap justify-start h-max">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              {autoRefresh && <Badge variant="outline">Auto-refresh</Badge>}
              <Button variant="outline" onClick={refreshAll}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh All
              </Button>
            </div>
          </div>

          {/* Small Widgets */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredWidgets
              .filter((w) => w.size === "small")
              .map((widget) => (
                <WidgetRenderer key={widget.id} widget={widget} />
              ))}
          </div>

          {/* Medium Widgets */}
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredWidgets
              .filter((w) => w.size === "medium")
              .map((widget) => (
                <WidgetRenderer key={widget.id} widget={widget} />
              ))}
          </div>

          {/* Large Widgets */}
          <div className="hidden sm:grid gap-4">
            {filteredWidgets
              .filter((w) => w.size === "large")
              .map((widget) => (
                <WidgetRenderer key={widget.id} widget={widget} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Usage Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Widgets</span>
                    <Badge>{widgets.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Categories</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Load Time</span>
                    <Badge variant="outline" className="text-green-600">
                      1.2s
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="outline" className="text-green-600">
                      99.9%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Top Widget
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fleet Performance
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Most Used
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active Vehicles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <Label>Auto-refresh widgets</Label>
                  <p className="text-sm text-muted-foreground">
                    Update data automatically
                  </p>
                </div>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh-interval">
                  Refresh Interval (seconds)
                </Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  defaultValue="30"
                  className="w-32"
                />
              </div>

              <Button onClick={() => toast({ title: "Settings saved" })}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
