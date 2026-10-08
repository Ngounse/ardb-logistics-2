"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Building2,
  DollarSign,
  Package,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  Printer,
} from "lucide-react";

import Image, { StaticImageData } from "next/image";
import company1 from "@/public/abstract-dw.png";
import company2 from "@/public/ed-initials-abstract.png";
import company3 from "@/public/monogram-mb.png";
import company4 from "@/public/stylized-letters-sj.png";
import Link from "next/link";
import { MyCancel, MySave } from "@/components/myFunction";

interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  type: "Enterprise" | "SMB" | "Individual";
  status: "Active" | "Inactive" | "Pending" | "Suspended";
  tier: "Premium" | "Standard" | "Basic";
  joinDate: string;
  lastOrder: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  satisfactionScore: number;
  paymentTerms: string;
  creditLimit: number;
  outstandingBalance: number;
  preferredServices: string[];
  notes: string;
  avatar?: string | StaticImageData;
}

const mockClients: Client[] = [
  {
    id: "CL-001",
    avatar: company1,
    name: "TechCorp Solutions",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street",
    city: "San Francisco",
    country: "USA",
    type: "Enterprise",
    status: "Active",
    tier: "Premium",
    joinDate: "2022-01-15",
    lastOrder: "2024-01-20",
    totalOrders: 156,
    totalRevenue: 2450000,
    averageOrderValue: 15705,
    satisfactionScore: 4.8,
    paymentTerms: "Net 30",
    creditLimit: 500000,
    outstandingBalance: 45000,
    preferredServices: [
      "Express Delivery",
      "International Shipping",
      "Warehousing",
    ],
    notes: "Key enterprise client with consistent high-volume orders.",
  },
  {
    id: "CL-002",
    avatar: company2,
    name: "Global Retail Inc",
    contactPerson: "Michael Chen",
    email: "m.chen@globalretail.com",
    phone: "+1 (555) 234-5678",
    address: "456 Commerce Ave",
    city: "New York",
    country: "USA",
    type: "Enterprise",
    status: "Active",
    tier: "Premium",
    joinDate: "2021-08-22",
    lastOrder: "2024-01-18",
    totalOrders: 203,
    totalRevenue: 3200000,
    averageOrderValue: 15764,
    satisfactionScore: 4.6,
    paymentTerms: "Net 15",
    creditLimit: 750000,
    outstandingBalance: 0,
    preferredServices: [
      "Same-Day Delivery",
      "Bulk Shipping",
      "Custom Packaging",
    ],
    notes: "Excellent payment history, prefers expedited services.",
  },
  {
    id: "CL-003",
    avatar: company3,
    name: "StartupXYZ",
    contactPerson: "Emily Rodriguez",
    email: "emily@startupxyz.com",
    phone: "+1 (555) 345-6789",
    address: "789 Innovation Blvd",
    city: "Austin",
    country: "USA",
    type: "SMB",
    status: "Active",
    tier: "Standard",
    joinDate: "2023-03-10",
    lastOrder: "2024-01-19",
    totalOrders: 42,
    totalRevenue: 185000,
    averageOrderValue: 4405,
    satisfactionScore: 4.9,
    paymentTerms: "Net 15",
    creditLimit: 50000,
    outstandingBalance: 12000,
    preferredServices: ["Standard Delivery", "Tracking"],
    notes: "Growing startup with increasing order frequency.",
  },
  {
    id: "CL-004",
    avatar: company4,
    name: "European Imports Ltd",
    contactPerson: "Hans Mueller",
    email: "h.mueller@euroimports.de",
    phone: "+49 30 12345678",
    address: "Hauptstraße 123",
    city: "Berlin",
    country: "Germany",
    type: "Enterprise",
    status: "Active",
    tier: "Premium",
    joinDate: "2020-11-05",
    lastOrder: "2024-01-17",
    totalOrders: 298,
    totalRevenue: 4100000,
    averageOrderValue: 13758,
    satisfactionScore: 4.7,
    paymentTerms: "Net 30",
    creditLimit: 600000,
    outstandingBalance: 28000,
    preferredServices: [
      "International Shipping",
      "Customs Clearance",
      "Insurance",
    ],
    notes: "Long-term international client with complex shipping requirements.",
  },
  {
    id: "CL-005",
    avatar: company1,
    name: "Local Business Co",
    contactPerson: "David Wilson",
    email: "david@localbiz.com",
    phone: "+1 (555) 456-7890",
    address: "321 Main Street",
    city: "Denver",
    country: "USA",
    type: "SMB",
    status: "Inactive",
    tier: "Basic",
    joinDate: "2023-06-18",
    lastOrder: "2023-12-15",
    totalOrders: 18,
    totalRevenue: 45000,
    averageOrderValue: 2500,
    satisfactionScore: 4.2,
    paymentTerms: "Net 30",
    creditLimit: 25000,
    outstandingBalance: 5000,
    preferredServices: ["Standard Delivery"],
    notes: "Seasonal business, typically inactive during winter months.",
  },
  {
    id: "CL-006",
    avatar: company2,
    name: "Fashion Forward",
    contactPerson: "Lisa Thompson",
    email: "lisa@fashionforward.com",
    phone: "+1 (555) 567-8901",
    address: "654 Style Avenue",
    city: "Los Angeles",
    country: "USA",
    type: "SMB",
    status: "Active",
    tier: "Standard",
    joinDate: "2022-09-12",
    lastOrder: "2024-01-21",
    totalOrders: 87,
    totalRevenue: 320000,
    averageOrderValue: 3678,
    satisfactionScore: 4.5,
    paymentTerms: "Net 15",
    creditLimit: 75000,
    outstandingBalance: 8500,
    preferredServices: ["Express Delivery", "Fragile Handling"],
    notes: "Fashion retailer with seasonal peaks, requires careful handling.",
  },
];

export default function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Client>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status.toLowerCase() === statusFilter;
    const matchesType =
      typeFilter === "all" || client.type.toLowerCase() === typeFilter;
    const matchesTier =
      tierFilter === "all" || client.tier.toLowerCase() === tierFilter;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "enterprise" && client.type === "Enterprise") ||
      (activeTab === "smb" && client.type === "SMB") ||
      (activeTab === "individual" && client.type === "Individual") ||
      (activeTab === "premium" && client.tier === "Premium");

    return (
      matchesSearch && matchesStatus && matchesType && matchesTier && matchesTab
    );
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setTierFilter("all");
    setActiveTab("all");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Inactive: "secondary",
      Pending: "outline",
      Suspended: "destructive",
    } as const;

    const icons = {
      Active: CheckCircle,
      Inactive: XCircle,
      Pending: Clock,
      Suspended: AlertCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      Premium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Standard: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Basic: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

    return (
      <Badge className={colors[tier as keyof typeof colors]}>{tier}</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate overview metrics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const averageSatisfaction =
    clients.reduce((sum, c) => sum + c.satisfactionScore, 0) / clients.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients List</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and track performance
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
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
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsAddClientOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {((activeClients / totalClients) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Satisfaction
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Star className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageSatisfaction.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="search">Search Clients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, contact, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter">Client Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="smb">SMB</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tier-filter">Client Tier</Label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm ||
            statusFilter !== "all" ||
            typeFilter !== "all" ||
            tierFilter !== "all") && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge variant="secondary">Search: {searchTerm}</Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary">Status: {statusFilter}</Badge>
                )}
                {typeFilter !== "all" && (
                  <Badge variant="secondary">Type: {typeFilter}</Badge>
                )}
                {tierFilter !== "all" && (
                  <Badge variant="secondary">Tier: {tierFilter}</Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Client Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 flex-wrap h-max justify-start">
          <TabsTrigger value="all">
            All Clients ({filteredClients.length})
          </TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          <TabsTrigger value="smb">SMB</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                Showing {sortedClients.length} of {totalClients} clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="h-auto p-0 font-semibold"
                        >
                          Client
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("type")}
                          className="h-auto p-0 font-semibold"
                        >
                          Type
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("status")}
                          className="h-auto p-0 font-semibold"
                        >
                          Status
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("tier")}
                          className="h-auto p-0 font-semibold"
                        >
                          Tier
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("totalOrders")}
                          className="h-auto p-0 font-semibold"
                        >
                          Orders
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("totalRevenue")}
                          className="h-auto p-0 font-semibold"
                        >
                          Revenue
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("satisfactionScore")}
                          className="h-auto p-0 font-semibold"
                        >
                          Satisfaction
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <Image
                                src={client.avatar || "/placeholder.svg"}
                                alt="..."
                              />
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {client.contactPerson}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {client.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.type}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>{getTierBadge(client.tier)}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {client.totalOrders}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(client.averageOrderValue)} avg
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(client.totalRevenue)}
                          </div>
                          {client.outstandingBalance > 0 && (
                            <div className="text-sm text-orange-600">
                              {formatCurrency(client.outstandingBalance)}{" "}
                              outstanding
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {client.satisfactionScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(client.lastOrder).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsProfileOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsOrdersOpen(true);
                                }}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                View Orders
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href="/admin/reports/delivery" className="flex gap-2 items-center">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Report
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <Image
                  src={selectedClient?.avatar || "/placeholder.svg"}
                  alt="..."
                />
                <AvatarFallback>
                  {selectedClient?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl font-bold">{selectedClient?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedClient?.id}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Status and Tier */}
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(selectedClient.status)}
                {getTierBadge(selectedClient.tier)}
                <Badge variant="outline">{selectedClient.type}</Badge>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap gap-2 justify-start h-full w-full sm:w-max">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Client Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Type:</span>
                          <span>{selectedClient.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Joined:</span>
                          <span>
                            {new Date(
                              selectedClient.joinDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Last Order:</span>
                          <span>
                            {new Date(
                              selectedClient.lastOrder
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Orders:</span>
                          <span className="font-medium">
                            {selectedClient.totalOrders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Revenue:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedClient.totalRevenue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Order Value:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedClient.averageOrderValue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Satisfaction:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {selectedClient.satisfactionScore}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Preferred Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.preferredServices.map(
                          (service, index) => (
                            <Badge key={index} variant="secondary">
                              {service}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedClient.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedClient.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-sm font-medium">
                            Contact Person
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedClient.contactPerson}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedClient.phone}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Location
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {selectedClient.city}, {selectedClient.country}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {selectedClient.address}, {selectedClient.city},{" "}
                            {selectedClient.country}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Payment Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Payment Terms:</span>
                          <span className="font-medium">
                            {selectedClient.paymentTerms}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Credit Limit:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedClient.creditLimit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outstanding Balance:</span>
                          <span
                            className={`font-medium ${selectedClient.outstandingBalance > 0
                              ? "text-orange-600"
                              : "text-green-600"
                              }`}
                          >
                            {formatCurrency(selectedClient.outstandingBalance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Credit:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(
                              selectedClient.creditLimit -
                              selectedClient.outstandingBalance
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Revenue Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Revenue:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedClient.totalRevenue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Order:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedClient.averageOrderValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Orders:</span>
                          <span className="font-medium">
                            {selectedClient.totalOrders}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Customer Satisfaction</span>
                          <span className="font-medium">
                            {selectedClient.satisfactionScore}/5.0
                          </span>
                        </div>
                        <Progress
                          value={(selectedClient.satisfactionScore / 5) * 100}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Credit Utilization</span>
                          <span className="font-medium">
                            {(
                              (selectedClient.outstandingBalance /
                                selectedClient.creditLimit) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedClient.outstandingBalance /
                              selectedClient.creditLimit) *
                            100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            98%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            On-Time Delivery
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            4.2
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg Response Time (hrs)
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            12
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Months Relationship
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setSelectedClient(null);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setSelectedClient(null);
                    setIsOrdersOpen(true);
                  }}
                >
                  <Package className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client Details</DialogTitle>
            <DialogDescription>
              Update client information and settings
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-name">Company Name</Label>
                  <Input id="edit-name" defaultValue={selectedClient.name} />
                </div>
                <div>
                  <Label htmlFor="edit-contact">Contact Person</Label>
                  <Input
                    id="edit-contact"
                    defaultValue={selectedClient.contactPerson}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedClient.email}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedClient.phone} />
                </div>
                <div>
                  <Label htmlFor="edit-type">Client Type</Label>
                  <Select defaultValue={selectedClient.type.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="smb">SMB</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-tier">Client Tier</Label>
                  <Select defaultValue={selectedClient.tier.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedClient.status.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-payment-terms">Payment Terms</Label>
                  <Select
                    defaultValue={selectedClient.paymentTerms
                      .toLowerCase()
                      .replace(" ", "")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-credit-limit">Credit Limit</Label>
                  <Input
                    id="edit-credit-limit"
                    type="number"
                    defaultValue={selectedClient.creditLimit}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input id="edit-city" defaultValue={selectedClient.city} />
                </div>
                <div>
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    defaultValue={selectedClient.country}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  defaultValue={selectedClient.address}
                />
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  defaultValue={selectedClient.notes}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  <MyCancel />
                </Button>
                <Button
                  onClick={() => {
                    // Handle save logic here
                    setIsEditOpen(false);
                    setSelectedClient(null);
                  }}
                >
                  <MySave />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Orders Dialog */}
      <Dialog open={isOrdersOpen} onOpenChange={setIsOrdersOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Order History - {selectedClient?.name}</DialogTitle>
            <DialogDescription>
              View all orders and shipments for this client
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              {/* Overview Cards */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold">
                      {selectedClient.totalOrders}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Total Orders
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold">
                      {formatCurrency(selectedClient.totalRevenue)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Total Revenue
                    </div>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold">
                      {formatCurrency(selectedClient.averageOrderValue)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Average Order
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">
                            Order ID
                          </TableHead>
                          <TableHead className="min-w-[100px]">Date</TableHead>
                          <TableHead className="min-w-[100px]">
                            Status
                          </TableHead>
                          <TableHead className="min-w-[100px] text-right">
                            Value
                          </TableHead>
                          <TableHead className="min-w-[120px] hidden sm:table-cell">
                            Destination
                          </TableHead>
                          <TableHead className="min-w-[80px] text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-sm">
                            ORD-2024-001
                          </TableCell>
                          <TableCell className="text-sm">2024-01-20</TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-xs">
                              Delivered
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            $15,750
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            New York, NY
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-sm">
                            ORD-2024-002
                          </TableCell>
                          <TableCell className="text-sm">2024-01-18</TableCell>
                          <TableCell>
                            <Badge variant="default" className="text-xs">
                              In Transit
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            $8,200
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            Chicago, IL
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-sm">
                            ORD-2024-003
                          </TableCell>
                          <TableCell className="text-sm">2024-01-15</TableCell>
                          <TableCell>
                            <Badge variant="warning" className="text-xs">
                              Processing
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            $12,400
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            Los Angeles, CA
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-sm">
                            ORD-2024-004
                          </TableCell>
                          <TableCell className="text-sm">2024-01-12</TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-xs">
                              Delivered
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            $22,100
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            Miami, FL
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-sm">
                            ORD-2024-005
                          </TableCell>
                          <TableCell className="text-sm">2024-01-10</TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-xs">
                              Delivered
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            $9,850
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            Seattle, WA
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-4 border-t">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Showing 5 of 156 orders
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-xs bg-transparent"
                        >
                          1
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 w-8 p-0 text-xs"
                        >
                          2
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-xs bg-transparent"
                        >
                          3
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          ...
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-xs bg-transparent"
                        >
                          32
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4">
            <Button variant="outline" onClick={() => setIsOrdersOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client information to create a new account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact & Location</TabsTrigger>
                <TabsTrigger value="business">Business Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="new-name" className="required">
                      Company Name
                    </Label>
                    <Input
                      id="new-name"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-contact" className="required">
                      Contact Person
                    </Label>
                    <Input
                      id="new-contact"
                      placeholder="Enter primary contact name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-type" className="required">
                      Client Type
                    </Label>
                    <Select defaultValue="smb">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="smb">SMB</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-tier" className="required">
                      Client Tier
                    </Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-status" className="required">
                      Status
                    </Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-id" className="required">
                      Client ID
                    </Label>
                    <Input id="new-id" placeholder="CL-XXX" required />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a unique client ID or leave blank to auto-generate
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="new-email" className="required">
                      Email
                    </Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-phone" className="required">
                      Phone
                    </Label>
                    <Input
                      id="new-phone"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-address" className="required">
                      Address
                    </Label>
                    <Input
                      id="new-address"
                      placeholder="123 Business St"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-city" className="required">
                      City
                    </Label>
                    <Input id="new-city" placeholder="New York" required />
                  </div>
                  <div>
                    <Label htmlFor="new-state">State/Province</Label>
                    <Input id="new-state" placeholder="NY" />
                  </div>
                  <div>
                    <Label htmlFor="new-country" className="required">
                      Country
                    </Label>
                    <Input id="new-country" placeholder="USA" required />
                  </div>
                  <div>
                    <Label htmlFor="new-postal">Postal/ZIP Code</Label>
                    <Input id="new-postal" placeholder="10001" />
                  </div>
                  <div>
                    <Label htmlFor="new-website">Website</Label>
                    <Input id="new-website" placeholder="https://example.com" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="new-payment-terms" className="required">
                      Payment Terms
                    </Label>
                    <Select defaultValue="net30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net45">Net 45</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-credit-limit" className="required">
                      Credit Limit
                    </Label>
                    <Input
                      id="new-credit-limit"
                      type="number"
                      placeholder="50000"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Preferred Services</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-express"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-express"
                          className="font-normal"
                        >
                          Express Delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-international"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-international"
                          className="font-normal"
                        >
                          International Shipping
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-warehousing"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-warehousing"
                          className="font-normal"
                        >
                          Warehousing
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-customs"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-customs"
                          className="font-normal"
                        >
                          Customs Clearance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-insurance"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-insurance"
                          className="font-normal"
                        >
                          Insurance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="service-tracking"
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="service-tracking"
                          className="font-normal"
                        >
                          Advanced Tracking
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="new-notes">Notes</Label>
                    <Textarea
                      id="new-notes"
                      placeholder="Add any additional notes about this client..."
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddClientOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle save logic here
                  setIsAddClientOpen(false);
                  // In a real application, you would add the new client to the clients array
                  // and possibly make an API call to save it to the database
                }}
              >
                Create Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
