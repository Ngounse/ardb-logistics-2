"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Mock data for restock requests
const mockRestockRequests = [
  {
    id: "RST-1001",
    itemName: "Shipping Boxes (Large)",
    warehouse: "Los Angeles Warehouse",
    currentStock: 125,
    minThreshold: 200,
    requestedQuantity: 300,
    unitPrice: 2.5,
    totalCost: 750.0,
    status: "Pending Approval",
    priority: "High",
    requestedBy: "John Smith",
    requestDate: "2023-05-15T09:30:00",
    expectedDelivery: "2023-05-22T00:00:00",
    vendor: "BoxCo Supplies",
    notes: "Urgent need for peak season shipping",
  },
  {
    id: "RST-1002",
    itemName: "Packing Tape",
    warehouse: "Chicago Distribution Center",
    currentStock: 50,
    minThreshold: 100,
    requestedQuantity: 200,
    unitPrice: 1.25,
    totalCost: 250.0,
    status: "Approved",
    priority: "Medium",
    requestedBy: "Sarah Johnson",
    requestDate: "2023-05-14T14:45:00",
    expectedDelivery: "2023-05-21T00:00:00",
    vendor: "Office Supply Co.",
    notes: "Standard restock order",
  },
  {
    id: "RST-1003",
    itemName: "Bubble Wrap Rolls",
    warehouse: "New York Fulfillment Center",
    currentStock: 30,
    minThreshold: 50,
    requestedQuantity: 100,
    unitPrice: 15.75,
    totalCost: 1575.0,
    status: "In Transit",
    priority: "Medium",
    requestedBy: "Michael Brown",
    requestDate: "2023-05-10T11:20:00",
    expectedDelivery: "2023-05-18T00:00:00",
    vendor: "Packaging Specialists Inc.",
    notes: "Increased demand for fragile item shipping",
  },
  {
    id: "RST-1004",
    itemName: "Shipping Labels",
    warehouse: "Miami Logistics Hub",
    currentStock: 500,
    minThreshold: 1000,
    requestedQuantity: 2000,
    unitPrice: 0.1,
    totalCost: 200.0,
    status: "Delivered",
    priority: "Low",
    requestedBy: "Emily Davis",
    requestDate: "2023-05-05T08:15:00",
    expectedDelivery: "2023-05-12T00:00:00",
    vendor: "Label Makers Ltd.",
    notes: "Standard restock",
  },
  {
    id: "RST-1005",
    itemName: "Pallets",
    warehouse: "Seattle Warehouse",
    currentStock: 15,
    minThreshold: 25,
    requestedQuantity: 50,
    unitPrice: 22.0,
    totalCost: 1100.0,
    status: "Pending Approval",
    priority: "High",
    requestedBy: "David Wilson",
    requestDate: "2023-05-16T10:00:00",
    expectedDelivery: "2023-05-23T00:00:00",
    vendor: "Industrial Supplies Co.",
    notes: "Need for upcoming large shipments",
  },
  {
    id: "RST-1006",
    itemName: "Hand Trucks",
    warehouse: "Dallas Distribution Center",
    currentStock: 5,
    minThreshold: 10,
    requestedQuantity: 15,
    unitPrice: 89.99,
    totalCost: 1349.85,
    status: "Approved",
    priority: "Medium",
    requestedBy: "Jessica Martinez",
    requestDate: "2023-05-13T13:30:00",
    expectedDelivery: "2023-05-27T00:00:00",
    vendor: "Warehouse Equipment Inc.",
    notes: "Replacing damaged equipment",
  },
  {
    id: "RST-1007",
    itemName: "Shrink Wrap",
    warehouse: "Atlanta Fulfillment Center",
    currentStock: 10,
    minThreshold: 20,
    requestedQuantity: 30,
    unitPrice: 45.5,
    totalCost: 1365.0,
    status: "In Transit",
    priority: "High",
    requestedBy: "Robert Taylor",
    requestDate: "2023-05-11T09:45:00",
    expectedDelivery: "2023-05-19T00:00:00",
    vendor: "Packaging Solutions",
    notes: "Critical for current operations",
  },
  {
    id: "RST-1008",
    itemName: "Safety Gloves",
    warehouse: "Denver Warehouse",
    currentStock: 75,
    minThreshold: 100,
    requestedQuantity: 150,
    unitPrice: 3.99,
    totalCost: 598.5,
    status: "Delivered",
    priority: "Low",
    requestedBy: "Amanda Clark",
    requestDate: "2023-05-07T14:20:00",
    expectedDelivery: "2023-05-14T00:00:00",
    vendor: "Safety Supplies Co.",
    notes: "Regular PPE restock",
  },
  {
    id: "RST-1009",
    itemName: "Barcode Scanners",
    warehouse: "Phoenix Distribution Center",
    currentStock: 3,
    minThreshold: 5,
    requestedQuantity: 8,
    unitPrice: 129.99,
    totalCost: 1039.92,
    status: "Pending Approval",
    priority: "Critical",
    requestedBy: "Kevin Lee",
    requestDate: "2023-05-16T11:15:00",
    expectedDelivery: "2023-05-23T00:00:00",
    vendor: "Tech Solutions Inc.",
    notes: "Urgent need for inventory management",
  },
  {
    id: "RST-1010",
    itemName: "Packaging Foam",
    warehouse: "Boston Fulfillment Center",
    currentStock: 40,
    minThreshold: 75,
    requestedQuantity: 100,
    unitPrice: 8.25,
    totalCost: 825.0,
    status: "Approved",
    priority: "Medium",
    requestedBy: "Lisa Robinson",
    requestDate: "2023-05-12T10:30:00",
    expectedDelivery: "2023-05-20T00:00:00",
    vendor: "Foam & Packaging Co.",
    notes: "Needed for fragile electronics shipping",
  },
];

// Mock data for vendors
const mockVendors = [
  {
    id: 1,
    name: "BoxCo Supplies",
    rating: 4.8,
    leadTime: "3-5 days",
    contactPerson: "James Wilson",
    phone: "555-123-4567",
  },
  {
    id: 2,
    name: "Office Supply Co.",
    rating: 4.5,
    leadTime: "2-4 days",
    contactPerson: "Maria Garcia",
    phone: "555-234-5678",
  },
  {
    id: 3,
    name: "Packaging Specialists Inc.",
    rating: 4.7,
    leadTime: "4-6 days",
    contactPerson: "Robert Johnson",
    phone: "555-345-6789",
  },
  {
    id: 4,
    name: "Label Makers Ltd.",
    rating: 4.2,
    leadTime: "3-5 days",
    contactPerson: "Susan Brown",
    phone: "555-456-7890",
  },
  {
    id: 5,
    name: "Industrial Supplies Co.",
    rating: 4.6,
    leadTime: "5-7 days",
    contactPerson: "David Chen",
    phone: "555-567-8901",
  },
  {
    id: 6,
    name: "Warehouse Equipment Inc.",
    rating: 4.4,
    leadTime: "7-10 days",
    contactPerson: "Jennifer Smith",
    phone: "555-678-9012",
  },
  {
    id: 7,
    name: "Packaging Solutions",
    rating: 4.9,
    leadTime: "2-3 days",
    contactPerson: "Michael Davis",
    phone: "555-789-0123",
  },
  {
    id: 8,
    name: "Safety Supplies Co.",
    rating: 4.3,
    leadTime: "3-6 days",
    contactPerson: "Sarah Miller",
    phone: "555-890-1234",
  },
  {
    id: 9,
    name: "Tech Solutions Inc.",
    rating: 4.7,
    leadTime: "4-7 days",
    contactPerson: "Thomas Wilson",
    phone: "555-901-2345",
  },
  {
    id: 10,
    name: "Foam & Packaging Co.",
    rating: 4.5,
    leadTime: "3-5 days",
    contactPerson: "Jessica Lee",
    phone: "555-012-3456",
  },
];

// Mock data for warehouses
const mockWarehouses = [
  "Los Angeles Warehouse",
  "Chicago Distribution Center",
  "New York Fulfillment Center",
  "Miami Logistics Hub",
  "Seattle Warehouse",
  "Dallas Distribution Center",
  "Atlanta Fulfillment Center",
  "Denver Warehouse",
  "Phoenix Distribution Center",
  "Boston Fulfillment Center",
];

export default function RestockRequestsPage() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mockRestockRequests)[0];
    direction: "ascending" | "descending";
  } | null>(null);

  // Filter requests based on search query and filters
  const filteredRequests = mockRestockRequests.filter((request) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      request.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;

    // Filter by priority
    const matchesPriority =
      selectedPriority === "all" || request.priority === selectedPriority;

    // Filter by warehouse
    const matchesWarehouse =
      selectedWarehouse === "all" || request.warehouse === selectedWarehouse;

    // Filter by tab
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "pending" && request.status === "Pending Approval") ||
      (selectedTab === "approved" && request.status === "Approved") ||
      (selectedTab === "inTransit" && request.status === "In Transit") ||
      (selectedTab === "delivered" && request.status === "Delivered") ||
      (selectedTab === "critical" && request.priority === "Critical");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesWarehouse &&
      matchesTab
    );
  });

  // Sort requests
  const sortedRequests = sortConfig
    ? [...filteredRequests].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      })
    : filteredRequests;

  // Request counts by status
  const pendingCount = mockRestockRequests.filter(
    (r) => r.status === "Pending Approval"
  ).length;
  const approvedCount = mockRestockRequests.filter(
    (r) => r.status === "Approved"
  ).length;
  const inTransitCount = mockRestockRequests.filter(
    (r) => r.status === "In Transit"
  ).length;
  const deliveredCount = mockRestockRequests.filter(
    (r) => r.status === "Delivered"
  ).length;
  const criticalCount = mockRestockRequests.filter(
    (r) => r.priority === "Critical"
  ).length;

  // Calculate total value of pending requests
  const pendingValue = mockRestockRequests
    .filter((r) => r.status === "Pending Approval")
    .reduce((sum, request) => sum + request.totalCost, 0);

  // Calculate total value of approved requests
  const approvedValue = mockRestockRequests
    .filter((r) => r.status === "Approved" || r.status === "In Transit")
    .reduce((sum, request) => sum + request.totalCost, 0);

  // Handle sort
  const requestSort = (key: keyof (typeof mockRestockRequests)[0]) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle view request
  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  // Handle edit request
  const handleEditRequest = (request: any) => {
    setSelectedRequest(request);
    setIsEditDialogOpen(true);
  };

  // Handle approve request dialog
  const handleOpenApproveDialog = (request: any) => {
    setSelectedRequest(request);
    setApprovalNotes("");
    setIsApproveDialogOpen(true);
  };

  // Handle reject request dialog
  const handleOpenRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  // Handle approve request
  const handleApproveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the request status
    toast({
      title: "Request Approved",
      description: `Request ${selectedRequest?.id} has been approved successfully.`,
    });
    setIsApproveDialogOpen(false);
    setSelectedRequest(null);
    setApprovalNotes("");
  };

  // Handle reject request
  const handleRejectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this request.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, this would call an API to update the request status
    toast({
      title: "Request Rejected",
      description: `Request ${selectedRequest?.id} has been rejected.`,
    });
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(sortedRequests.map((request) => request.id));
    } else {
      setSelectedRequests([]);
    }
  };

  // Handle select request
  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      setSelectedRequests(selectedRequests.filter((id) => id !== requestId));
    }
  };

  // Handle bulk approve
  const handleBulkApprove = () => {
    // In a real app, this would call an API to update the request status
    toast({
      title: "Requests Approved",
      description: `${selectedRequests.length} requests have been approved.`,
    });
    setSelectedRequests([]);
  };

  // Handle bulk reject
  const handleBulkReject = () => {
    // In a real app, this would call an API to update the request status
    toast({
      title: "Requests Rejected",
      description: `${selectedRequests.length} requests have been rejected.`,
    });
    setSelectedRequests([]);
  };

  // Handle create request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to create a new request
    toast({
      title: "Request Created",
      description: "Your restock request has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  // Handle update request
  const handleUpdateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the request
    toast({
      title: "Request Updated",
      description: `Request ${selectedRequest?.id} has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV.",
    });
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            Pending Approval
          </Badge>
        );
      case "Approved":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            Approved
          </Badge>
        );
      case "In Transit":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          >
            In Transit
          </Badge>
        );
      case "Delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            Delivered
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render priority badge
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case "High":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
        );
      case "Medium":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Restock Requests
            </h1>
            <p className="text-muted-foreground">
              Manage inventory restock requests across all warehouses
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Value: ${pendingValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Approved & In Transit
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Truck className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedCount + inTransitCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Value: ${approvedValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Delivered This Month
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <Package className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredCount}</div>
              <p className="text-xs text-muted-foreground">
                Last delivery:{" "}
                {format(
                  new Date(
                    mockRestockRequests.find((r) => r.status === "Delivered")
                      ?.requestDate || new Date()
                  ),
                  "MMM d, yyyy"
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Requests
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <div className="space-y-4">
          -
          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <div className="flex flex-wrap gap-2 flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList className="flex flex-wrap gap-2 h-full justify-start">
                <TabsTrigger value="all">
                  All Requests
                  <Badge className="ml-2 bg-muted text-muted-foreground">
                    {mockRestockRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  <Badge className="ml-2 bg-yellow-500 text-white">
                    {pendingCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {approvedCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inTransit">
                  In Transit
                  <Badge className="ml-2 bg-purple-500 text-white">
                    {inTransitCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  Delivered
                  <Badge className="ml-2 bg-green-500 text-white">
                    {deliveredCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="critical">
                  Critical
                  <Badge className="ml-2 bg-red-500 text-white">
                    {criticalCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>

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

            <div className="flex flex-wrap justify-between gap-2 flex-col space-y-4 sm:flex-row   sm:space-y-0 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending Approval">
                      Pending Approval
                    </SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filter by warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {mockWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedRequests.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-2 mt-2">
                <div className="text-sm">
                  <span className="font-medium">{selectedRequests.length}</span>{" "}
                  requests selected
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkApprove}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkReject}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            )}

            {/* Restock Requests Table */}
            <TabsContent value={selectedTab} className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <Table className="whitespace-nowrap">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox
                            checked={
                              sortedRequests.length > 0 &&
                              selectedRequests.length === sortedRequests.length
                            }
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead className="w-[100px]">
                          <div className="flex items-center space-x-1">
                            <span>ID</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => requestSort("id")}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Item</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => requestSort("itemName")}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead className="text-right">
                          Current Stock
                        </TableHead>
                        <TableHead className="text-right">
                          Requested Qty
                        </TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">
                          Request Date
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={11} className="h-24 text-center">
                            No restock requests found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedRequests.includes(request.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectRequest(
                                    request.id,
                                    checked as boolean
                                  )
                                }
                                aria-label={`Select ${request.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.id}
                            </TableCell>
                            <TableCell>{request.itemName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Warehouse className="h-4 w-4 text-muted-foreground" />
                                <span>{request.warehouse}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {request.currentStock.toLocaleString()}
                              {request.currentStock < request.minThreshold && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  Low
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {request.requestedQuantity.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {request.totalCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              {renderStatusBadge(request.status)}
                            </TableCell>
                            <TableCell>
                              {renderPriorityBadge(request.priority)}
                            </TableCell>
                            <TableCell className="text-right">
                              {format(
                                new Date(request.requestDate),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleViewRequest(request)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditRequest(request)}
                                  >
                                    Edit Request
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {request.status === "Pending Approval" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOpenApproveDialog(request)
                                        }
                                      >
                                        Approve Request
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOpenRejectDialog(request)
                                        }
                                      >
                                        Reject Request
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {request.status === "Approved" && (
                                    <DropdownMenuItem>
                                      Mark as Shipped
                                    </DropdownMenuItem>
                                  )}
                                  {request.status === "In Transit" && (
                                    <DropdownMenuItem>
                                      Mark as Delivered
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 items-center justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{sortedRequests.length}</strong> of{" "}
                    <strong>{mockRestockRequests.length}</strong> requests
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-sm text-muted-foreground">
                      Page 1 of 1
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Request Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Restock Request</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new restock request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRequest}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select defaultValue={mockWarehouses[0]}>
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse} value={warehouse}>
                          {warehouse}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-stock">Current Stock</Label>
                  <Input
                    id="current-stock"
                    type="number"
                    min="0"
                    placeholder="Enter current stock"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-threshold">Minimum Threshold</Label>
                  <Input
                    id="min-threshold"
                    type="number"
                    min="0"
                    placeholder="Enter minimum threshold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requested-quantity">Requested Quantity</Label>
                  <Input
                    id="requested-quantity"
                    type="number"
                    min="1"
                    placeholder="Enter requested quantity"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-price">Unit Price ($)</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter unit price"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="Medium">
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select defaultValue={mockVendors[0].name}>
                    <SelectTrigger id="vendor">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.name}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-delivery">Expected Delivery</Label>
                  <Input id="expected-delivery" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes or requirements"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Approve Request Dialog */}
      {selectedRequest && (
        <Dialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                Approve Request
              </DialogTitle>
              <DialogDescription>
                You are about to approve request {selectedRequest.id} for{" "}
                {selectedRequest.itemName}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleApproveRequest}>
              <div className="space-y-4 py-4">
                {/* Request Summary */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Item:</span>
                    <span className="text-sm">{selectedRequest.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Quantity:</span>
                    <span className="text-sm">
                      {selectedRequest.requestedQuantity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="text-sm font-semibold">
                      $
                      {selectedRequest.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Vendor:</span>
                    <span className="text-sm">{selectedRequest.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Priority:</span>
                    <span className="text-sm">
                      {renderPriorityBadge(selectedRequest.priority)}
                    </span>
                  </div>
                </div>

                {/* Approval Notes */}
                <div className="space-y-2">
                  <Label htmlFor="approval-notes">
                    Approval Notes (Optional)
                  </Label>
                  <Textarea
                    id="approval-notes"
                    placeholder="Add any notes or conditions for this approval..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Confirmation */}
                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Approval Confirmation
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        This request will be approved and the vendor will be
                        notified to proceed with the order. The expected
                        delivery date is{" "}
                        {format(
                          new Date(selectedRequest.expectedDelivery),
                          "MMM d, yyyy"
                        )}
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Request Dialog */}
      {selectedRequest && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <X className="h-4 w-4 text-red-600" />
                </div>
                Reject Request
              </DialogTitle>
              <DialogDescription>
                You are about to reject request {selectedRequest.id} for{" "}
                {selectedRequest.itemName}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRejectRequest}>
              <div className="space-y-4 py-4">
                {/* Request Summary */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Item:</span>
                    <span className="text-sm">{selectedRequest.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Requested By:</span>
                    <span className="text-sm">
                      {selectedRequest.requestedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="text-sm font-semibold">
                      $
                      {selectedRequest.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Priority:</span>
                    <span className="text-sm">
                      {renderPriorityBadge(selectedRequest.priority)}
                    </span>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={rejectionReason}
                    onValueChange={setRejectionReason}
                  >
                    <SelectTrigger id="rejection-reason">
                      <SelectValue placeholder="Select a reason for rejection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget-constraints">
                        Budget Constraints
                      </SelectItem>
                      <SelectItem value="alternative-supplier">
                        Alternative Supplier Available
                      </SelectItem>
                      <SelectItem value="quantity-excessive">
                        Requested Quantity Too High
                      </SelectItem>
                      <SelectItem value="timing-inappropriate">
                        Inappropriate Timing
                      </SelectItem>
                      <SelectItem value="duplicate-request">
                        Duplicate Request
                      </SelectItem>
                      <SelectItem value="vendor-issues">
                        Vendor Performance Issues
                      </SelectItem>
                      <SelectItem value="policy-violation">
                        Policy Violation
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <Label htmlFor="rejection-comments">
                    Additional Comments (Optional)
                  </Label>
                  <Textarea
                    id="rejection-comments"
                    placeholder="Provide additional details about the rejection..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Warning */}
                <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Rejection Warning
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        This request will be rejected and the requester will be
                        notified. This action cannot be undone. Consider if
                        modifications to the request would be acceptable
                        instead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Request Dialog */}
      {selectedRequest && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Detailed information about this restock request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  {renderStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <h3 className="font-semibold">Priority</h3>
                  {renderPriorityBadge(selectedRequest.priority)}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold">Item Name</h3>
                  <p>{selectedRequest.itemName}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Warehouse</h3>
                  <p>{selectedRequest.warehouse}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Current Stock</h3>
                  <p>{selectedRequest.currentStock.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Minimum Threshold</h3>
                  <p>{selectedRequest.minThreshold.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Requested Quantity</h3>
                  <p>{selectedRequest.requestedQuantity.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Unit Price</h3>
                  <p>${selectedRequest.unitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Cost</h3>
                  <p>
                    $
                    {selectedRequest.totalCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Vendor</h3>
                  <p>{selectedRequest.vendor}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Requested By</h3>
                  <p>{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Request Date</h3>
                  <p>
                    {format(
                      new Date(selectedRequest.requestDate),
                      "MMM d, yyyy h:mm a"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Expected Delivery</h3>
                  <p>
                    {format(
                      new Date(selectedRequest.expectedDelivery),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Notes</h3>
                <p>{selectedRequest.notes}</p>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              {selectedRequest.status === "Pending Approval" && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 bg-transparent"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleOpenApproveDialog(selectedRequest);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 bg-transparent"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleOpenRejectDialog(selectedRequest);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Request Dialog */}
      {selectedRequest && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] h-max overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Request - {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                Update the details of this restock request.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateRequest}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-name">Item Name</Label>
                    <Input
                      id="edit-item-name"
                      defaultValue={selectedRequest.itemName}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-warehouse">Warehouse</Label>
                    <Select defaultValue={selectedRequest.warehouse}>
                      <SelectTrigger id="edit-warehouse">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockWarehouses.map((warehouse) => (
                          <SelectItem key={warehouse} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-current-stock">Current Stock</Label>
                    <Input
                      id="edit-current-stock"
                      type="number"
                      min="0"
                      defaultValue={selectedRequest.currentStock.toString()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-min-threshold">
                      Minimum Threshold
                    </Label>
                    <Input
                      id="edit-min-threshold"
                      type="number"
                      min="0"
                      defaultValue={selectedRequest.minThreshold.toString()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-requested-quantity">
                      Requested Quantity
                    </Label>
                    <Input
                      id="edit-requested-quantity"
                      type="number"
                      min="1"
                      defaultValue={selectedRequest.requestedQuantity.toString()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit-price">Unit Price ($)</Label>
                    <Input
                      id="edit-unit-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={selectedRequest.unitPrice.toString()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select defaultValue={selectedRequest.priority}>
                      <SelectTrigger id="edit-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select defaultValue={selectedRequest.status}>
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending Approval">
                          Pending Approval
                        </SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor">Vendor</Label>
                    <Select defaultValue={selectedRequest.vendor}>
                      <SelectTrigger id="edit-vendor">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.name}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-expected-delivery">
                      Expected Delivery
                    </Label>
                    <Input
                      id="edit-expected-delivery"
                      type="date"
                      defaultValue={format(
                        new Date(selectedRequest.expectedDelivery),
                        "yyyy-MM-dd"
                      )}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    defaultValue={selectedRequest.notes}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
