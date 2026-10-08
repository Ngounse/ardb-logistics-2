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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarIcon,
  Clock,
  Filter,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  CheckCircle,
  Timer,
  Phone,
  Mail,
  CalendarDays,
  Copy,
  Eye,
  UserCheck,
  RefreshCw,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import Image from "next/image";
import user1 from "@/public/user2.png";
import user2 from "@/public/user3.png";
import user3 from "@/public/user4.png";
import user4 from "@/public/user5.png";

export default function ScheduledDeliveriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showAssignDriverDialog, setShowAssignDriverDialog] = useState(false);
  const [showScheduleDeliveryDialog, setShowScheduleDeliveryDialog] =
    useState(false);
  const [scheduleDeliveryTab, setScheduleDeliveryTab] = useState("customer");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Order ID copied to clipboard",
    });
  };

  // Mock data for scheduled deliveries
  const scheduledDeliveries = [
    {
      id: "DEL-001",
      orderId: "ORD-2024-001",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        avatar: user1,
      },
      address: "123 Main St, New York, NY 10001",
      scheduledDate: "2024-01-20",
      timeSlot: "09:00 - 11:00",
      status: "scheduled",
      priority: "high",
      type: "express",
      driver: {
        name: "Mike Johnson",
        id: "DRV-001",
        phone: "+1 (555) 987-6543",
      },
      items: 3,
      value: "$1,250.00",
      distance: "12.5 km",
      estimatedTime: "25 mins",
    },
    {
      id: "DEL-002",
      orderId: "ORD-2024-002",
      customer: {
        name: "Sarah Williams",
        email: "sarah.w@email.com",
        phone: "+1 (555) 234-5678",
        avatar: user2,
      },
      address: "456 Oak Ave, Brooklyn, NY 11201",
      scheduledDate: "2024-01-20",
      timeSlot: "11:00 - 13:00",
      status: "in-transit",
      priority: "medium",
      type: "standard",
      driver: {
        name: "David Lee",
        id: "DRV-002",
        phone: "+1 (555) 876-5432",
      },
      items: 5,
      value: "$850.00",
      distance: "8.3 km",
      estimatedTime: "18 mins",
    },
    {
      id: "DEL-003",
      orderId: "ORD-2024-003",
      customer: {
        name: "Michael Brown",
        email: "m.brown@email.com",
        phone: "+1 (555) 345-6789",
        avatar: user3,
      },
      address: "789 Pine St, Queens, NY 11375",
      scheduledDate: "2024-01-20",
      timeSlot: "14:00 - 16:00",
      status: "delayed",
      priority: "high",
      type: "same-day",
      driver: {
        name: "Chris Wilson",
        id: "DRV-003",
        phone: "+1 (555) 765-4321",
      },
      items: 2,
      value: "$2,100.00",
      distance: "15.7 km",
      estimatedTime: "35 mins",
    },
    {
      id: "DEL-004",
      orderId: "ORD-2024-004",
      customer: {
        name: "Emma Davis",
        email: "emma.d@email.com",
        phone: "+1 (555) 456-7890",
        avatar: user4,
      },
      address: "321 Elm St, Manhattan, NY 10002",
      scheduledDate: "2024-01-21",
      timeSlot: "10:00 - 12:00",
      status: "scheduled",
      priority: "low",
      type: "next-day",
      driver: null,
      items: 4,
      value: "$650.00",
      distance: "6.2 km",
      estimatedTime: "15 mins",
    },
  ];

  // Mock data for calendar events
  const calendarEvents = [
    { date: new Date(), count: 8 },
    { date: addDays(new Date(), 1), count: 5 },
    { date: addDays(new Date(), 3), count: 3 },
    { date: addDays(new Date(), 5), count: 7 },
    { date: addDays(new Date(), 7), count: 2 },
    { date: addDays(new Date(), 10), count: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in-transit":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "delayed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "failed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "express":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "same-day":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "next-day":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "standard":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const filteredDeliveries = scheduledDeliveries.filter((delivery) => {
    const matchesSearch =
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || delivery.priority === priorityFilter;
    const matchesType = typeFilter === "all" || delivery.type === typeFilter;
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "today" && delivery.scheduledDate === "2024-01-20") ||
      (selectedTab === "tomorrow" && delivery.scheduledDate === "2024-01-21") ||
      (selectedTab === "week" && true); // Simplified for demo

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesType &&
      matchesTab
    );
  });

  // Get deliveries for selected date in calendar view
  const getDeliveriesForDate = (date: Date) => {
    return scheduledDeliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.scheduledDate);
      return (
        deliveryDate.getFullYear() === date.getFullYear() &&
        deliveryDate.getMonth() === date.getMonth() &&
        deliveryDate.getDate() === date.getDate()
      );
    });
  };

  // Custom calendar day rendering to show delivery counts
  const renderCalendarDay = (day: Date) => {
    const event = calendarEvents.find((e) => isSameDay(e.date, day));
    return event ? (
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div>{format(day, "d")}</div>
        <div className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary"></div>
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
          {event.count}
        </div>
      </div>
    ) : (
      <div>{format(day, "d")}</div>
    );
  };

  return (
    <div className="">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Deliveries
            </CardTitle>
             <div className="p-2 bg-primary/10 rounded-full">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">
                18 on schedule
              </span>
              <span className="mx-1">•</span>
              <span className="text-red-600 dark:text-red-400">6 delayed</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <CalendarDays className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">
                +12% from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
            <Timer className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <Progress value={94.5} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Delivery Time
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
            <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 mins</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">
                -3 mins
              </span>{" "}
              from average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Delivery Schedule</CardTitle>
            </div>
            <Button onClick={() => setShowScheduleDeliveryDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="same-day">Same Day</SelectItem>
                  <SelectItem value="next-day">Next Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Schedule Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="flex flex-wrap gap-3 h-full justify-start">
          <TabsTrigger value="all">All Deliveries</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Order ID</th>
                      <th className="p-4 text-left font-medium">Customer</th>
                      <th className="p-4 text-left font-medium">
                        Delivery Address
                      </th>
                      <th className="p-4 text-left font-medium">Schedule</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Priority</th>
                      <th className="p-4 text-left font-medium">Driver</th>
                      <th className="p-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr
                        key={delivery.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {delivery.orderId}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(delivery.orderId)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <Image
                                src={
                                  delivery.customer.avatar || "/placeholder.svg"
                                }
                                alt="user"
                              />
                              <AvatarFallback>
                                {delivery.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {delivery.customer.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {delivery.customer.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{delivery.address}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {delivery.scheduledDate}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {delivery.timeSlot}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={getPriorityColor(delivery.priority)}
                          >
                            {delivery.priority}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {delivery.driver ? (
                            <div>
                              <p className="font-medium">
                                {delivery.driver.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {delivery.driver.id}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowRescheduleDialog(true);
                                }}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowAssignDriverDialog(true);
                                }}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Assign Driver
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
         
        </TabsContent>
      </Tabs>

      {/* Delivery Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Complete information about the scheduled delivery
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="flex flex-wrap gap-2 justify-start h-max">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="route">Route</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Order ID</Label>
                      <p className="font-medium">{selectedDelivery.orderId}</p>
                    </div>
                    <div>
                      <Label>Delivery ID</Label>
                      <p className="font-medium">{selectedDelivery.id}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Customer Information</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="flex flex-wrap items-center gap-3">
                        <Avatar>
                          <Image
                            src={
                              selectedDelivery.customer.avatar ||
                              "/placeholder.svg"
                            }
                            alt="..."
                          />
                          <AvatarFallback>
                            {selectedDelivery.customer.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedDelivery.customer.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedDelivery.customer.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {selectedDelivery.customer.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Delivery Schedule</Label>
                    <div className="mt-2 grid sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {selectedDelivery.scheduledDate}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Time Slot
                        </p>
                        <p className="font-medium">
                          {selectedDelivery.timeSlot}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Delivery Status</Label>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <Badge
                        className={getStatusColor(selectedDelivery.status)}
                      >
                        {selectedDelivery.status.replace("-", " ")}
                      </Badge>
                      <Badge
                        className={getPriorityColor(selectedDelivery.priority)}
                      >
                        {selectedDelivery.priority} priority
                      </Badge>
                      <Badge className={getTypeColor(selectedDelivery.type)}>
                        {selectedDelivery.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="route" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Delivery Address</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {selectedDelivery.address}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Distance: {selectedDelivery.distance} • Est. Time:{" "}
                            {selectedDelivery.estimatedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Assigned Driver</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      {selectedDelivery.driver ? (
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {selectedDelivery.driver.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedDelivery.driver.id}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            {selectedDelivery.driver.phone}
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No driver assigned yet
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Map view would be displayed here
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="items" className="space-y-4">
                <div>
                  <Label>Package Details</Label>
                  <div className="mt-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {selectedDelivery.items} items
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Value: {selectedDelivery.value}
                        </p>
                      </div>
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Special Instructions</Label>
                  <Textarea
                    className="mt-2"
                    placeholder="No special instructions provided"
                    readOnly
                  />
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="h-full w-0.5 bg-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Order Scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        Jan 19, 2024 at 2:30 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="h-full w-0.5 bg-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Driver Assigned</p>
                      <p className="text-sm text-muted-foreground">
                        Jan 19, 2024 at 4:15 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Pending Pickup</p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {selectedDelivery.scheduledDate}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
      >
        <DialogContent className="max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reschedule Delivery</DialogTitle>
            <DialogDescription>
              Select a new date and time for this delivery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>New Delivery Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mt-2"
              />
            </div>
            <div>
              <Label>Time Slot</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00-11:00">09:00 - 11:00</SelectItem>
                  <SelectItem value="11:00-13:00">11:00 - 13:00</SelectItem>
                  <SelectItem value="14:00-16:00">14:00 - 16:00</SelectItem>
                  <SelectItem value="16:00-18:00">16:00 - 18:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason for Rescheduling</Label>
              <Textarea className="mt-2" placeholder="Enter reason..." />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowRescheduleDialog(false);
                toast({
                  title: "Delivery Rescheduled",
                  description:
                    "The delivery has been successfully rescheduled.",
                });
              }}
            >
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog
        open={showAssignDriverDialog}
        onOpenChange={setShowAssignDriverDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Select a driver for this delivery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Available Drivers</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRV-001">
                    Mike Johnson - 5 deliveries today
                  </SelectItem>
                  <SelectItem value="DRV-002">
                    David Lee - 3 deliveries today
                  </SelectItem>
                  <SelectItem value="DRV-003">
                    Chris Wilson - 4 deliveries today
                  </SelectItem>
                  <SelectItem value="DRV-004">
                    Tom Anderson - 2 deliveries today
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assignment Notes</Label>
              <Textarea
                className="mt-2"
                placeholder="Add any special instructions..."
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAssignDriverDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAssignDriverDialog(false);
                toast({
                  title: "Driver Assigned",
                  description:
                    "The driver has been successfully assigned to this delivery.",
                });
              }}
            >
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Delivery Dialog */}
      <Dialog
        open={showScheduleDeliveryDialog}
        onOpenChange={setShowScheduleDeliveryDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Delivery</DialogTitle>
            <DialogDescription>
              Enter delivery details to schedule a new delivery
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={scheduleDeliveryTab}
            onValueChange={setScheduleDeliveryTab}
            className="mt-4"
          >
            <TabsList className="flex flex-wrap gap-2 justify-start h-max">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Details</TabsTrigger>
              <TabsTrigger value="package">Package</TabsTrigger>
              <TabsTrigger value="driver">Driver</TabsTrigger>
            </TabsList>

            {/* Customer Tab */}
            <TabsContent value="customer" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroup
                    defaultValue="existing"
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-2 mr-4">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing">Existing Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">New Customer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cust-001">
                        John Smith - #CUST-001
                      </SelectItem>
                      <SelectItem value="cust-002">
                        Sarah Williams - #CUST-002
                      </SelectItem>
                      <SelectItem value="cust-003">
                        Michael Brown - #CUST-003
                      </SelectItem>
                      <SelectItem value="cust-004">
                        Emma Davis - #CUST-004
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      placeholder="Enter company name"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Customer Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any notes about this customer"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleDeliveryDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setScheduleDeliveryTab("delivery")}>
                  Next: Delivery Details
                </Button>
              </div>
            </TabsContent>

            {/* Delivery Details Tab */}
            <TabsContent value="delivery" className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full delivery address"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip/Postal Code</Label>
                    <Input
                      id="zip"
                      placeholder="Enter zip code"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border mt-2"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="time-slot">Time Slot</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00-11:00">
                            09:00 - 11:00
                          </SelectItem>
                          <SelectItem value="11:00-13:00">
                            11:00 - 13:00
                          </SelectItem>
                          <SelectItem value="14:00-16:00">
                            14:00 - 16:00
                          </SelectItem>
                          <SelectItem value="16:00-18:00">
                            16:00 - 18:00
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="delivery-type">Delivery Type</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select delivery type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="same-day">Same Day</SelectItem>
                          <SelectItem value="next-day">Next Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
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
                </div>

                <div>
                  <Label htmlFor="delivery-instructions">
                    Delivery Instructions (Optional)
                  </Label>
                  <Textarea
                    id="delivery-instructions"
                    placeholder="Enter any special delivery instructions"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setScheduleDeliveryTab("customer")}
                >
                  Back: Customer
                </Button>
                <Button onClick={() => setScheduleDeliveryTab("package")}>
                  Next: Package Details
                </Button>
              </div>
            </TabsContent>

            {/* Package Tab */}
            <TabsContent value="package" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="items">Number of Items</Label>
                    <Input
                      id="items"
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Total Value</Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="value"
                        placeholder="Enter package value"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Enter weight"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="length">Dimensions (cm)</Label>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2">
                      <Input id="length" placeholder="L" />
                      <Input id="width" placeholder="W" />
                      <Input id="height" placeholder="H" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="package-type">Package Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="envelope">Envelope</SelectItem>
                        <SelectItem value="pallet">Pallet</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Special Handling Requirements</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fragile" />
                      <Label htmlFor="fragile">Fragile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perishable" />
                      <Label htmlFor="perishable">Perishable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hazardous" />
                      <Label htmlFor="hazardous">Hazardous</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="temperature-controlled" />
                      <Label htmlFor="temperature-controlled">
                        Temperature Controlled
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="package-notes">
                    Package Notes (Optional)
                  </Label>
                  <Textarea
                    id="package-notes"
                    placeholder="Enter any notes about the package contents"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setScheduleDeliveryTab("delivery")}
                >
                  Back: Delivery Details
                </Button>
                <Button onClick={() => setScheduleDeliveryTab("driver")}>
                  Next: Driver Assignment
                </Button>
              </div>
            </TabsContent>

            {/* Driver Tab */}
            <TabsContent value="driver" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroup
                    defaultValue="auto"
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-2 mr-4">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Auto-Assign Driver</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Manually Assign Driver</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="driver">Select Driver (Optional)</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRV-001">
                        Mike Johnson - 5 deliveries today
                      </SelectItem>
                      <SelectItem value="DRV-002">
                        David Lee - 3 deliveries today
                      </SelectItem>
                      <SelectItem value="DRV-003">
                        Chris Wilson - 4 deliveries today
                      </SelectItem>
                      <SelectItem value="DRV-004">
                        Tom Anderson - 2 deliveries today
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">Delivery Summary</p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <p className="text-muted-foreground">Customer:</p>
                    <p>John Smith</p>
                    <p className="text-muted-foreground">Delivery Address:</p>
                    <p>123 Main St, New York, NY 10001</p>
                    <p className="text-muted-foreground">Scheduled Date:</p>
                    <p>
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Not selected"}
                    </p>
                    <p className="text-muted-foreground">Time Slot:</p>
                    <p>09:00 - 11:00</p>
                    <p className="text-muted-foreground">Package:</p>
                    <p>1 item, $150.00</p>
                    <p className="text-muted-foreground">Delivery Type:</p>
                    <p>Standard</p>
                    <p className="text-muted-foreground">Priority:</p>
                    <p>Medium</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setScheduleDeliveryTab("package")}
                >
                  Back: Package Details
                </Button>
                <Button
                  onClick={() => {
                    setShowScheduleDeliveryDialog(false);
                    toast({
                      title: "Delivery Scheduled",
                      description:
                        "The delivery has been successfully scheduled.",
                    });
                  }}
                >
                  Schedule Delivery
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
