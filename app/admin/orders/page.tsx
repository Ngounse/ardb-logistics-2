"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import {
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  Search,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { MyCancel, MySave } from "@/components/myFunction";
import user1 from "@/public/user2.png";
import user2 from "@/public/user3.png";
import user3 from "@/public/user4.png";
import user4 from "@/public/user5.png";
import user5 from "@/public/user6.png";
import Image, { StaticImageData } from "next/image";

// Define types
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  email: string;
  avatar: string | StaticImageData;
}

interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  totalValue: number;
  status: "processing" | "in-transit" | "delivered" | "delayed" | "cancelled";
  priority: "high" | "medium" | "low";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  orderDate: string;
  deliveryDate: string;
  shippingAddress: string;
  trackingNumber: string;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      avatar: user1,
    },
    items: [
      { name: "Electronics Package", quantity: 2, price: 1299.99 },
      { name: "Accessories", quantity: 1, price: 199.99 },
    ],
    totalValue: 2799.97,
    status: "processing",
    priority: "high",
    paymentStatus: "paid",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2024-002",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      avatar: user2,
    },
    items: [{ name: "Home Appliances", quantity: 1, price: 899.99 }],
    totalValue: 899.99,
    status: "in-transit",
    priority: "medium",
    paymentStatus: "paid",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-19",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-2024-003",
    customer: {
      name: "Mike Brown",
      email: "mike.brown@email.com",
      avatar: user3,
    },
    items: [{ name: "Office Supplies", quantity: 5, price: 299.99 }],
    totalValue: 1499.95,
    status: "delivered",
    priority: "low",
    paymentStatus: "paid",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-17",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    trackingNumber: "TRK456789123",
  },
  {
    id: "ORD-2024-004",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      avatar: user4,
    },
    items: [{ name: "Fashion Items", quantity: 3, price: 199.99 }],
    totalValue: 599.97,
    status: "delayed",
    priority: "high",
    paymentStatus: "pending",
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-18",
    shippingAddress: "321 Elm St, Miami, FL 33101",
    trackingNumber: "TRK789123456",
  },
  {
    id: "ORD-2024-005",
    customer: {
      name: "David Wilson",
      email: "david.w@email.com",
      avatar: user5,
    },
    items: [{ name: "Sports Equipment", quantity: 2, price: 449.99 }],
    totalValue: 899.98,
    status: "cancelled",
    priority: "medium",
    paymentStatus: "refunded",
    orderDate: "2024-01-08",
    deliveryDate: "2024-01-15",
    shippingAddress: "654 Maple Dr, Seattle, WA 98101",
    trackingNumber: "TRK321654987",
  },
];

const statusConfig = {
  processing: { label: "Processing", color: "bg-blue-500", icon: Package },
  "in-transit": { label: "In Transit", color: "bg-yellow-500", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500", icon: CheckCircle },
  delayed: { label: "Delayed", color: "bg-red-500", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-gray-500", icon: XCircle },
} as const;

const priorityConfig = {
  high: {
    label: "High",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  low: {
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
} as const;

const paymentStatusConfig = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
} as const;

export default function AllOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editOrderOpen, setEditOrderOpen] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || order.priority === priorityFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesPayment &&
      matchesTab
    );
  });

  const orderStats = {
    total: mockOrders.length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    inTransit: mockOrders.filter((o) => o.status === "in-transit").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
    delayed: mockOrders.filter((o) => o.status === "delayed").length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalValue, 0),
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
            <p className="text-muted-foreground">
              Manage and track all customer orders
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
            <Button size="sm" onClick={() => setNewOrderOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Truck className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.inTransit}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+5%</span> from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.delivered}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delayed</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.delayed}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-2%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <DollarSign className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${orderStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              Search, filter, and manage all orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap flex-col sm:flex-row gap-4">
              <div className="relative min-w-[250px] flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap justify-start gap-1 h-auto p-1">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All ({mockOrders.length})
                </TabsTrigger>
                <TabsTrigger value="processing" className="text-xs sm:text-sm">
                  Processing ({orderStats.processing})
                </TabsTrigger>
                <TabsTrigger value="in-transit" className="text-xs sm:text-sm">
                  In Transit ({orderStats.inTransit})
                </TabsTrigger>
                <TabsTrigger value="delivered" className="text-xs sm:text-sm">
                  Delivered ({orderStats.delivered})
                </TabsTrigger>
                <TabsTrigger value="delayed" className="text-xs sm:text-sm">
                  Delayed ({orderStats.delayed})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
                  Cancelled
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {/* Orders Table - Desktop */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[140px]">
                              Order ID
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              Customer
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              Items
                            </TableHead>
                            <TableHead className="min-w-[120px]">
                              Total Value
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Status
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Priority
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Payment
                            </TableHead>
                            <TableHead className="min-w-[120px]">
                              Delivery Date
                            </TableHead>
                            <TableHead className="min-w-[80px] text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={9}
                                className="text-center py-8 text-muted-foreground"
                              >
                                No orders found matching the current filters.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="whitespace-nowrap">
                                      {order.id}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyOrderId(order.id)}
                                      className="h-6 w-6 p-0 flex-shrink-0"
                                    >
                                      {copiedId === order.id ? (
                                        <Check className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <Image
                                        src={
                                          order.customer.avatar ||
                                          "/placeholder.svg"
                                        }
                                        alt={order.customer.name}
                                      />
                                      <AvatarFallback>
                                        {order.customer.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium truncate">
                                        {order.customer.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground truncate">
                                        {order.customer.email}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {order.items
                                      .slice(0, 2)
                                      .map((item, index) => (
                                        <div key={index} className="text-sm">
                                          {item.name} (x{item.quantity})
                                        </div>
                                      ))}
                                    {order.items.length > 2 && (
                                      <div className="text-xs text-muted-foreground">
                                        +{order.items.length - 2} more items
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                  ${order.totalValue.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`${statusConfig[order.status].color
                                      } text-white whitespace-nowrap`}
                                  >
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`${priorityConfig[order.priority].color
                                      } whitespace-nowrap`}
                                  >
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`${paymentStatusConfig[order.paymentStatus]
                                      .color
                                      } whitespace-nowrap`}
                                  >
                                    {
                                      paymentStatusConfig[order.paymentStatus]
                                        .label
                                    }
                                  </Badge>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {order.deliveryDate}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedOrder(order);
                                          setViewDetailsOpen(true);
                                        }}
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedOrder(order);
                                          setEditOrderOpen(true);
                                        }}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Order
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Cancel Order
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                {/* Orders Cards - Mobile/Tablet */}
                <div className="lg:hidden space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found matching the current filters.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.id}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyOrderId(order.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {copiedId === order.id ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
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
                                      setSelectedOrder(order);
                                      setViewDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setEditOrderOpen(true);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <Image
                                  src={
                                    order.customer.avatar || "/placeholder.svg"
                                  }
                                  alt={order.customer.name}
                                />
                                <AvatarFallback>
                                  {order.customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {order.customer.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.customer.email}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Items: </span>
                                {order.items.slice(0, 2).map((item, index) => (
                                  <span key={index}>
                                    {item.name} (x{item.quantity})
                                    {index <
                                      Math.min(order.items.length, 2) - 1 &&
                                      ", "}
                                  </span>
                                ))}
                                {order.items.length > 2 && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    +{order.items.length - 2} more
                                  </span>
                                )}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Total: </span>
                                <span className="font-bold">
                                  ${order.totalValue.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Delivery: </span>
                                {order.deliveryDate}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className={`${statusConfig[order.status].color
                                  } text-white`}
                              >
                                {statusConfig[order.status].label}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={priorityConfig[order.priority].color}
                              >
                                {priorityConfig[order.priority].label}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={
                                  paymentStatusConfig[order.paymentStatus].color
                                }
                              >
                                {paymentStatusConfig[order.paymentStatus].label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <Image
                              src={
                                selectedOrder.customer.avatar ||
                                "/placeholder.svg"
                              }
                              alt={selectedOrder.customer.name}
                            />
                            <AvatarFallback>
                              {selectedOrder.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {selectedOrder.customer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedOrder.customer.email}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Order Date:</span>
                          <span>{selectedOrder.orderDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Date:</span>
                          <span>{selectedOrder.deliveryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-medium">
                            ${selectedOrder.totalValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Status:</span>
                          <Badge
                            variant="secondary"
                            className={`${statusConfig[selectedOrder.status].color
                              } text-white`}
                          >
                            {statusConfig[selectedOrder.status].label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ${item.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                per item
                              </div>
                            </div>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between items-center font-medium text-lg">
                          <span>Total:</span>
                          <span>
                            ${selectedOrder.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipping" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Shipping Address
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Tracking Number
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedOrder.trackingNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Delivery Progress
                        </Label>
                        <div className="mt-2">
                          <Progress
                            value={
                              selectedOrder.status === "delivered"
                                ? 100
                                : selectedOrder.status === "in-transit"
                                  ? 60
                                  : 30
                            }
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedOrder.status === "delivered"
                              ? "Package delivered"
                              : selectedOrder.status === "in-transit"
                                ? "Package in transit"
                                : "Package being processed"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Order Placed</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedOrder.orderDate} - Order was successfully
                              placed
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                          <Package className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Processing</div>
                            <div className="text-sm text-muted-foreground">
                              Order is being prepared for shipment
                            </div>
                          </div>
                        </div>
                        {selectedOrder.status !== "processing" && (
                          <div className="flex items-center gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                            <Truck className="h-5 w-5 text-yellow-600" />
                            <div>
                              <div className="font-medium">Shipped</div>
                              <div className="text-sm text-muted-foreground">
                                Package is on its way
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editOrderOpen} onOpenChange={setEditOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Update order information and status
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedOrder.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={selectedOrder.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input type="date" defaultValue={selectedOrder.deliveryDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea placeholder="Add any notes about this order..." />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditOrderOpen(false)}
                  className="w-full sm:w-auto"
                >
                  <MyCancel />
                </Button>
                <Button
                  onClick={() => setEditOrderOpen(false)}
                  className="w-full sm:w-auto"
                >
                  <MySave />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Add a new order to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-full">
                <TabsTrigger value="customer" className="text-xs sm:text-sm">
                  Customer
                </TabsTrigger>
                <TabsTrigger value="items" className="text-xs sm:text-sm">
                  Items
                </TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs sm:text-sm">
                  Shipping
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs sm:text-sm">
                  Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name *</Label>
                        <Input
                          id="customer-name"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-email">Email Address *</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="customer@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone Number</Label>
                        <Input
                          id="customer-phone"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-company">Company</Label>
                        <Input
                          id="customer-company"
                          placeholder="Company name (optional)"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        <div className="sm:col-span-5 space-y-2">
                          <Label htmlFor="item-name">Item Name *</Label>
                          <Input id="item-name" placeholder="Enter item name" />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label htmlFor="item-quantity">Quantity *</Label>
                          <Input
                            id="item-quantity"
                            type="number"
                            placeholder="1"
                            min="1"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label htmlFor="item-price">Price *</Label>
                          <Input
                            id="item-price"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label>Total</Label>
                          <Input value="$0.00" disabled />
                        </div>
                        <div className="sm:col-span-1">
                          <Button size="sm" className="w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Subtotal:</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tax (8.5%):</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Shipping:</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-address">
                          Street Address *
                        </Label>
                        <Input
                          id="shipping-address"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-city">City *</Label>
                        <Input id="shipping-city" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-state">State/Province *</Label>
                        <Input id="shipping-state" placeholder="NY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-zip">ZIP/Postal Code *</Label>
                        <Input id="shipping-zip" placeholder="10001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-country">Country *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="mx">Mexico</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-date">
                          Requested Delivery Date
                        </Label>
                        <Input id="delivery-date" type="date" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-method">
                          Shipping Method *
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">
                              Standard Shipping (5-7 days) - $9.99
                            </SelectItem>
                            <SelectItem value="express">
                              Express Shipping (2-3 days) - $19.99
                            </SelectItem>
                            <SelectItem value="overnight">
                              Overnight Shipping (1 day) - $39.99
                            </SelectItem>
                            <SelectItem value="pickup">
                              Store Pickup - Free
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Order Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit-card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="debit-card">
                              Debit Card
                            </SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="bank-transfer">
                              Bank Transfer
                            </SelectItem>
                            <SelectItem value="cash-on-delivery">
                              Cash on Delivery
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-terms">Payment Terms</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">
                                Immediate Payment
                              </SelectItem>
                              <SelectItem value="net-15">
                                Net 15 Days
                              </SelectItem>
                              <SelectItem value="net-30">
                                Net 30 Days
                              </SelectItem>
                              <SelectItem value="net-60">
                                Net 60 Days
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-status">Payment Status</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="partial">
                                Partially Paid
                              </SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="special-instructions">
                          Special Instructions
                        </Label>
                        <Textarea
                          id="special-instructions"
                          placeholder="Any special delivery instructions or notes..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internal-notes">Internal Notes</Label>
                        <Textarea
                          id="internal-notes"
                          placeholder="Internal notes for staff (not visible to customer)..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setNewOrderOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Here you would typically save the order
                  setNewOrderOpen(false);
                  // Show success message or redirect
                }}
                className="w-full sm:w-auto"
              >
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
