"use client";
import { MyCancel, MySave } from "@/components/myFunction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileText,
  Mail,
  Map,
  MapPin,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  Printer,
  Search,
  Settings,
  Shield,
  Thermometer,
  Trash2,
  TrendingUp,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  manager: {
    name: string;
    avatar?: string;
    phone: string;
    email: string;
  };
  status: "operational" | "maintenance" | "closed" | "construction";
  type:
  | "distribution"
  | "storage"
  | "fulfillment"
  | "cross-dock"
  | "cold-storage";
  capacity: {
    total: number;
    used: number;
    available: number;
    unit: string;
  };
  inventory: {
    totalItems: number;
    categories: number;
    value: number;
  };
  staff: {
    total: number;
    present: number;
    shifts: number;
  };
  equipment: {
    forklifts: number;
    conveyors: number;
    scanners: number;
    operational: number;
  };
  performance: {
    efficiency: number;
    accuracy: number;
    throughput: number;
    uptime: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  certifications: string[];
  operatingHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  lastInspection: string;
  nextMaintenance: string;
}

const mockWarehouses: Warehouse[] = [
  {
    id: "WH001",
    name: "Central Distribution Hub",
    code: "CDH-001",
    address: "1250 Industrial Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90021",
    country: "USA",
    phone: "+1 (555) 123-4567",
    email: "cdh@ardb.com",
    manager: {
      name: "Sarah Johnson",
      avatar: "/stylized-letters-sj.png",
      phone: "+1 (555) 123-4568",
      email: "sarah.johnson@ardb.com",
    },
    status: "operational",
    type: "distribution",
    capacity: {
      total: 500000,
      used: 425000,
      available: 75000,
      unit: "sq ft",
    },
    inventory: {
      totalItems: 125000,
      categories: 45,
      value: 2500000,
    },
    staff: {
      total: 85,
      present: 72,
      shifts: 3,
    },
    equipment: {
      forklifts: 25,
      conveyors: 8,
      scanners: 45,
      operational: 76,
    },
    performance: {
      efficiency: 94,
      accuracy: 99.2,
      throughput: 1250,
      uptime: 98.5,
    },
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
    features: [
      "Climate Control",
      "24/7 Security",
      "Loading Docks",
      "Rail Access",
    ],
    certifications: ["ISO 9001", "OSHA Compliant", "FDA Approved"],
    operatingHours: {
      weekdays: "6:00 AM - 10:00 PM",
      weekends: "8:00 AM - 6:00 PM",
      holidays: "Closed",
    },
    lastInspection: "2024-01-15",
    nextMaintenance: "2024-02-15",
  },
  {
    id: "WH002",
    name: "East Coast Fulfillment",
    code: "ECF-002",
    address: "890 Commerce Drive",
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    country: "USA",
    phone: "+1 (555) 234-5678",
    email: "ecf@ardb.com",
    manager: {
      name: "Michael Brown",
      avatar: "/monogram-mb.png",
      phone: "+1 (555) 234-5679",
      email: "michael.brown@ardb.com",
    },
    status: "operational",
    type: "fulfillment",
    capacity: {
      total: 350000,
      used: 280000,
      available: 70000,
      unit: "sq ft",
    },
    inventory: {
      totalItems: 89000,
      categories: 32,
      value: 1800000,
    },
    staff: {
      total: 65,
      present: 58,
      shifts: 2,
    },
    equipment: {
      forklifts: 18,
      conveyors: 12,
      scanners: 35,
      operational: 63,
    },
    performance: {
      efficiency: 91,
      accuracy: 98.8,
      throughput: 950,
      uptime: 97.2,
    },
    coordinates: {
      lat: 33.749,
      lng: -84.388,
    },
    features: ["Automated Sorting", "Express Shipping", "Returns Processing"],
    certifications: ["ISO 14001", "LEED Certified"],
    operatingHours: {
      weekdays: "7:00 AM - 9:00 PM",
      weekends: "9:00 AM - 5:00 PM",
      holidays: "Limited Hours",
    },
    lastInspection: "2024-01-20",
    nextMaintenance: "2024-03-01",
  },
  {
    id: "WH003",
    name: "Cold Storage Facility",
    code: "CSF-003",
    address: "456 Refrigeration Way",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    phone: "+1 (555) 345-6789",
    email: "csf@ardb.com",
    manager: {
      name: "Emily Davis",
      avatar: "/ed-initials-abstract.png",
      phone: "+1 (555) 345-6790",
      email: "emily.davis@ardb.com",
    },
    status: "operational",
    type: "cold-storage",
    capacity: {
      total: 200000,
      used: 165000,
      available: 35000,
      unit: "sq ft",
    },
    inventory: {
      totalItems: 45000,
      categories: 15,
      value: 3200000,
    },
    staff: {
      total: 45,
      present: 42,
      shifts: 3,
    },
    equipment: {
      forklifts: 12,
      conveyors: 6,
      scanners: 25,
      operational: 41,
    },
    performance: {
      efficiency: 96,
      accuracy: 99.5,
      throughput: 650,
      uptime: 99.1,
    },
    coordinates: {
      lat: 41.8781,
      lng: -87.6298,
    },
    features: [
      "Temperature Control",
      "Humidity Control",
      "Blast Freezing",
      "Quality Control",
    ],
    certifications: ["HACCP", "SQF", "Organic Certified"],
    operatingHours: {
      weekdays: "24/7",
      weekends: "24/7",
      holidays: "24/7",
    },
    lastInspection: "2024-01-10",
    nextMaintenance: "2024-02-28",
  },
  {
    id: "WH004",
    name: "Cross-Dock Terminal",
    code: "CDT-004",
    address: "789 Transit Hub Rd",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    country: "USA",
    phone: "+1 (555) 456-7890",
    email: "cdt@ardb.com",
    manager: {
      name: "David Wilson",
      avatar: "/abstract-dw.png",
      phone: "+1 (555) 456-7891",
      email: "david.wilson@ardb.com",
    },
    status: "maintenance",
    type: "cross-dock",
    capacity: {
      total: 150000,
      used: 0,
      available: 150000,
      unit: "sq ft",
    },
    inventory: {
      totalItems: 0,
      categories: 0,
      value: 0,
    },
    staff: {
      total: 35,
      present: 8,
      shifts: 1,
    },
    equipment: {
      forklifts: 15,
      conveyors: 10,
      scanners: 20,
      operational: 35,
    },
    performance: {
      efficiency: 0,
      accuracy: 0,
      throughput: 0,
      uptime: 0,
    },
    coordinates: {
      lat: 32.7767,
      lng: -96.797,
    },
    features: ["Quick Turnaround", "Multi-Modal Access", "Staging Areas"],
    certifications: ["C-TPAT", "TSA Approved"],
    operatingHours: {
      weekdays: "Closed for Maintenance",
      weekends: "Closed for Maintenance",
      holidays: "Closed for Maintenance",
    },
    lastInspection: "2024-01-05",
    nextMaintenance: "2024-02-10",
  },
];

export default function WarehouseLocationsPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || warehouse.status === statusFilter;
    const matchesType = typeFilter === "all" || warehouse.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalWarehouses = warehouses.length;
  const operationalWarehouses = warehouses.filter(
    (w) => w.status === "operational"
  ).length;
  const totalCapacity = warehouses.reduce(
    (sum, w) => sum + w.capacity.total,
    0
  );
  const usedCapacity = warehouses.reduce((sum, w) => sum + w.capacity.used, 0);
  const capacityUtilization =
    totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "closed":
        return "bg-red-500";
      case "construction":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      case "construction":
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "distribution":
        return <Truck className="h-4 w-4" />;
      case "storage":
        return <Package className="h-4 w-4" />;
      case "fulfillment":
        return <Zap className="h-4 w-4" />;
      case "cross-dock":
        return <Activity className="h-4 w-4" />;
      case "cold-storage":
        return <Thermometer className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-2xl font-bold tracking-tight">
            Warehouse Locations
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all warehouse facilities across your network
          </p>
        </div>
        <div className="flex gap-2">
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

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[90vh] sm:h-max overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Warehouse</DialogTitle>
                <DialogDescription>
                  Create a new warehouse location in your network
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Warehouse Name</Label>
                    <Input id="name" placeholder="Enter warehouse name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Warehouse Code</Label>
                    <Input id="code" placeholder="e.g., WH005" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter full address" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="ZIP" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Warehouse Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distribution">
                          Distribution
                        </SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="fulfillment">Fulfillment</SelectItem>
                        <SelectItem value="cross-dock">Cross-Dock</SelectItem>
                        <SelectItem value="cold-storage">
                          Cold Storage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Total Capacity (sq ft)</Label>
                    <Input id="capacity" type="number" placeholder="500000" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="warehouse@ardb.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input id="manager" placeholder="Manager name" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Warehouse
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Warehouses
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              {((operationalWarehouses / totalWarehouses) * 100).toFixed(1)}% of
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Capacity
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalCapacity / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">sq ft total space</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {capacityUtilization.toFixed(1)}%
            </div>
            <Progress value={capacityUtilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Management</CardTitle>
          <CardDescription>
            Search, filter, and manage your warehouse locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="fulfillment">Fulfillment</SelectItem>
                  <SelectItem value="cross-dock">Cross-Dock</SelectItem>
                  <SelectItem value="cold-storage">Cold Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Grid */}
      <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {warehouse.code}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getTypeIcon(warehouse.type)}
                      <span className="ml-1 capitalize">
                        {warehouse.type.replace("-", " ")}
                      </span>
                    </Badge>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Warehouse
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/admin/dashboard/map" className="flex gap-2 items-center">
                        <Map className="mr-2 h-4 w-4" />
                        View on Map
                      </Link>
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Warehouse
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(
                    warehouse.status
                  )} text-white border-0`}
                >
                  {getStatusIcon(warehouse.status)}
                  <span className="ml-1 capitalize">{warehouse.status}</span>
                </Badge>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {warehouse.city}, {warehouse.state}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground pl-6">
                  {warehouse.address}
                </div>
              </div>

              {/* Manager */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={warehouse.manager.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {warehouse.manager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {warehouse.manager.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Manager</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span>
                    {(
                      (warehouse.capacity.used / warehouse.capacity.total) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (warehouse.capacity.used / warehouse.capacity.total) * 100
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {(warehouse.capacity.used / 1000).toFixed(0)}K used
                  </span>
                  <span>
                    {(warehouse.capacity.total / 1000).toFixed(0)}K total
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {warehouse.inventory.totalItems.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {warehouse.staff.present}/{warehouse.staff.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Staff</div>
                </div>
              </div>

              {/* Performance Indicators */}
              {warehouse.status === "operational" && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      {warehouse.performance.efficiency}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Efficiency
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">
                      {warehouse.performance.accuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accuracy
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warehouse Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedWarehouse?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed information and analytics for {selectedWarehouse?.code}
            </DialogDescription>
          </DialogHeader>

          {selectedWarehouse && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex gap-2 flex-wrap justify-start w-full h-max">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Warehouse Code:
                        </span>
                        <span className="font-medium">
                          {selectedWarehouse.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">
                          {getTypeIcon(selectedWarehouse.type)}
                          <span className="ml-1 capitalize">
                            {selectedWarehouse.type.replace("-", " ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          className={`${getStatusColor(
                            selectedWarehouse.status
                          )} text-white border-0`}
                        >
                          {getStatusIcon(selectedWarehouse.status)}
                          <span className="ml-1 capitalize">
                            {selectedWarehouse.status}
                          </span>
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedWarehouse.address}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6">
                          {selectedWarehouse.city}, {selectedWarehouse.state}{" "}
                          {selectedWarehouse.zipCode}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedWarehouse.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedWarehouse.email}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manager Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Manager Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              selectedWarehouse.manager.avatar ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {selectedWarehouse.manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedWarehouse.manager.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Warehouse Manager
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedWarehouse.manager.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedWarehouse.manager.email}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Capacity and Utilization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Capacity & Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Space Utilization
                        </span>
                        <span className="font-medium">
                          {(
                            (selectedWarehouse.capacity.used /
                              selectedWarehouse.capacity.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (selectedWarehouse.capacity.used /
                            selectedWarehouse.capacity.total) *
                          100
                        }
                      />
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">
                            {(selectedWarehouse.capacity.total / 1000).toFixed(
                              0
                            )}
                            K
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total sq ft
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">
                            {(selectedWarehouse.capacity.used / 1000).toFixed(
                              0
                            )}
                            K
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Used sq ft
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">
                            {(
                              selectedWarehouse.capacity.available / 1000
                            ).toFixed(0)}
                            K
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available sq ft
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features and Certifications */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedWarehouse.features.map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedWarehouse.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">
                            <Shield className="mr-1 h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {selectedWarehouse.performance.efficiency}%
                      </div>
                      <Progress
                        value={selectedWarehouse.performance.efficiency}
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedWarehouse.performance.accuracy}%
                      </div>
                      <Progress
                        value={selectedWarehouse.performance.accuracy}
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Throughput</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedWarehouse.performance.throughput}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        items/hour
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedWarehouse.performance.uptime}%
                      </div>
                      <Progress
                        value={selectedWarehouse.performance.uptime}
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Equipment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {selectedWarehouse.equipment.forklifts}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Forklifts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {selectedWarehouse.equipment.conveyors}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Conveyors
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {selectedWarehouse.equipment.scanners}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Scanners
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {selectedWarehouse.equipment.operational}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Operational
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                {/* Inventory Overview */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedWarehouse.inventory.totalItems.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                        +5.2% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedWarehouse.inventory.categories}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Product categories
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        {(selectedWarehouse.inventory.value / 1000000).toFixed(
                          1
                        )}
                        M
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Inventory value
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="space-y-4">
                {/* Operating Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operating Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekdays:</span>
                      <span className="font-medium">
                        {selectedWarehouse.operatingHours.weekdays}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekends:</span>
                      <span className="font-medium">
                        {selectedWarehouse.operatingHours.weekends}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holidays:</span>
                      <span className="font-medium">
                        {selectedWarehouse.operatingHours.holidays}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {selectedWarehouse.staff.total}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Staff
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {selectedWarehouse.staff.present}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Present Today
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {selectedWarehouse.staff.shifts}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active Shifts
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Maintenance Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Inspection:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedWarehouse.lastInspection
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Next Maintenance:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedWarehouse.nextMaintenance
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Warehouse Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>
              Update warehouse information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedWarehouse && (
            <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Warehouse Name</Label>
                  <Input id="edit-name" defaultValue={selectedWarehouse.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Warehouse Code</Label>
                  <Input id="edit-code" defaultValue={selectedWarehouse.code} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  defaultValue={selectedWarehouse.address}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input id="edit-city" defaultValue={selectedWarehouse.city} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    defaultValue={selectedWarehouse.state}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-zip">ZIP Code</Label>
                  <Input
                    id="edit-zip"
                    defaultValue={selectedWarehouse.zipCode}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedWarehouse.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select defaultValue={selectedWarehouse.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="fulfillment">Fulfillment</SelectItem>
                      <SelectItem value="cross-dock">Cross-Dock</SelectItem>
                      <SelectItem value="cold-storage">Cold Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    defaultValue={selectedWarehouse.phone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    defaultValue={selectedWarehouse.email}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Manager Name</Label>
                <Input
                  id="edit-manager"
                  defaultValue={selectedWarehouse.manager.name}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <MyCancel />
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              <MySave />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
