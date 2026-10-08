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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Download,
  RefreshCw,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Truck,
  DollarSign,
  Camera,
  MessageSquare,
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

// Sample data
const returnsData = [
  {
    id: "RET-001",
    orderId: "ORD-2024-001",
    customer: "John Doe",
    email: "john.doe@example.com",
    items: ["Widget Pro X1", "Cable Set"],
    reason: "Defective Product",
    status: "pending",
    requestDate: "2024-01-20",
    value: 299.99,
    warehouse: "Main Warehouse",
    trackingNumber: "TRK123456789",
    images: 2,
    notes: "Customer reports device not turning on",
  },
  {
    id: "RET-002",
    orderId: "ORD-2024-045",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    items: ["Smart Monitor 27"],
    reason: "Wrong Item Sent",
    status: "approved",
    requestDate: "2024-01-19",
    value: 549.99,
    warehouse: "East Distribution",
    trackingNumber: "TRK987654321",
    images: 3,
    notes: "Received 24 inch instead of 27 inch",
  },
  {
    id: "RET-003",
    orderId: "ORD-2024-089",
    customer: "Mike Johnson",
    email: "mike.j@example.com",
    items: ["Laptop Stand", "USB Hub"],
    reason: "Changed Mind",
    status: "processing",
    requestDate: "2024-01-18",
    value: 129.99,
    warehouse: "West Hub",
    trackingNumber: "TRK456789123",
    images: 0,
    notes: "Within return window",
  },
  {
    id: "RET-004",
    orderId: "ORD-2024-102",
    customer: "Sarah Wilson",
    email: "sarah.w@example.com",
    items: ["Wireless Keyboard"],
    reason: "Damaged in Transit",
    status: "completed",
    requestDate: "2024-01-17",
    value: 89.99,
    warehouse: "Main Warehouse",
    trackingNumber: "TRK789123456",
    images: 4,
    notes: "Box was damaged, product has scratches",
  },
  {
    id: "RET-005",
    orderId: "ORD-2024-156",
    customer: "Robert Brown",
    email: "robert.b@example.com",
    items: ["Gaming Mouse", "Mouse Pad"],
    reason: "Not as Described",
    status: "rejected",
    requestDate: "2024-01-16",
    value: 159.99,
    warehouse: "North Center",
    trackingNumber: "TRK321654987",
    images: 1,
    notes: "Product matches description, return denied",
  },
];

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-500", icon: Clock },
  approved: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-blue-500", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-gray-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
};

export default function ReturnsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<
    (typeof returnsData)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter returns based on search and status
  const filteredReturns = returnsData.filter((ret) => {
    const matchesSearch =
      ret.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || ret.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: returnsData.length,
    pending: returnsData.filter((r) => r.status === "pending").length,
    processing: returnsData.filter((r) => r.status === "processing").length,
    totalValue: returnsData.reduce((sum, r) => sum + r.value, 0),
  };

  const openReturnDetails = (returnItem: (typeof returnsData)[0]) => {
    setSelectedReturn(returnItem);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Returns Management
          </h1>
          <p className="text-muted-foreground">
            Process and track product returns and refunds
          </p>
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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Clock className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <RefreshCw className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Potential refunds</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Returns List</CardTitle>
          <CardDescription>View and manage all return requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by return ID, order ID, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Returns Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Return ID</th>
                    <th className="p-4 text-left font-medium">Customer</th>
                    <th className="p-4 text-left font-medium">Items</th>
                    <th className="p-4 text-left font-medium">Reason</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Value</th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReturns.map((returnItem) => {
                    const StatusIcon =
                      statusConfig[
                        returnItem.status as keyof typeof statusConfig
                      ].icon;
                    return (
                      <tr
                        key={returnItem.id}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => openReturnDetails(returnItem)}
                      >
                        <td className="p-4">
                          <div className="font-medium">{returnItem.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {returnItem.orderId}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {returnItem.customer}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {returnItem.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {returnItem.items.join(", ")}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{returnItem.reason}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge variant="secondary">
                              {
                                statusConfig[
                                  returnItem.status as keyof typeof statusConfig
                                ].label
                              }
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">
                            ${returnItem.value.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {returnItem.requestDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <ChevronRight className="h-4 w-4" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedReturn && (
            <>
              <DialogHeader>
                <DialogTitle>Return Details - {selectedReturn.id}</DialogTitle>
                <DialogDescription>
                  Review and process return request
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="flex flex-wrap gap-2 h-max justify-start">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Return ID</Label>
                      <div className="font-medium">{selectedReturn.id}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Order ID</Label>
                      <div className="font-medium">
                        {selectedReturn.orderId}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Badge variant="secondary">
                        {
                          statusConfig[
                            selectedReturn.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label>Request Date</Label>
                      <div className="font-medium">
                        {selectedReturn.requestDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Warehouse</Label>
                      <div className="font-medium">
                        {selectedReturn.warehouse}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tracking Number</Label>
                      <div className="font-medium">
                        {selectedReturn.trackingNumber}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Return Reason</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{selectedReturn.reason}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedReturn.notes}
                      </p>
                    </div>
                  </div>

                  {selectedReturn.images > 0 && (
                    <div className="space-y-2">
                      <Label>Attached Images</Label>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        <span>
                          {selectedReturn.images} images uploaded by customer
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                  <div className="space-y-3">
                    {selectedReturn.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item}</h4>
                            <p className="text-sm text-muted-foreground">
                              SKU: SKU-
                              {Math.random()
                                .toString(36)
                                .substr(2, 9)
                                .toUpperCase()}
                            </p>
                          </div>
                          <Badge variant="outline">Returning</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Return Value</span>
                      <span className="text-xl font-bold">
                        ${selectedReturn.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Customer Name</Label>
                      <div className="font-medium">
                        {selectedReturn.customer}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="font-medium">{selectedReturn.email}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Order History</Label>
                      <div className="text-sm text-muted-foreground">
                        15 orders (2 previous returns)
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Since</Label>
                      <div className="text-sm text-muted-foreground">
                        January 2023
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  {selectedReturn.status === "pending" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <div className="space-y-1">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Action Required
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              This return request needs to be reviewed and
                              approved or rejected.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Internal Notes</Label>
                        <Textarea
                          placeholder="Add notes about this return..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button className="flex-1" variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Return
                        </Button>
                        <Button className="flex-1" variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Return
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedReturn.status === "approved" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm">
                          Return has been approved. Waiting for customer to ship
                          items back.
                        </p>
                      </div>
                      <Button className="w-full">
                        <Truck className="h-4 w-4 mr-2" />
                        Generate Return Label
                      </Button>
                    </div>
                  )}

                  {selectedReturn.status === "processing" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm">
                          Items have been received and are being inspected.
                        </p>
                      </div>
                      <Button className="w-full">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Refund
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Customer
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
