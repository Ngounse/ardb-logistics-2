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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Tag,
  Paperclip,
  Send,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Image from "next/image";
import user1 from "@/public/user10.png";
import user2 from "@/public/user2.png";
import user3 from "@/public/user3.png";
import user4 from "@/public/user4.png";
import user5 from "@/public/user5.png";

// Mock data for tickets
const mockTickets = [
  {
    id: "TKT-001",
    title: "Unable to track shipment SHP-2024-001",
    description:
      "The tracking page shows an error when I try to view shipment details.",
    status: "open",
    priority: "high",
    category: "shipments",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    assignedTo: "Sarah Johnson",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: user1,
    },
    replies: 3,
    attachments: 2,
  },
  {
    id: "TKT-002",
    title: "Fleet vehicle maintenance scheduling issue",
    description:
      "Cannot schedule maintenance for vehicle VH-2024-045. The system shows conflicting dates.",
    status: "in-progress",
    priority: "medium",
    category: "fleet",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    assignedTo: "Mike Chen",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: user2,
    },
    replies: 5,
    attachments: 1,
  },
  {
    id: "TKT-003",
    title: "Report generation timeout error",
    description:
      "Monthly delivery reports are timing out when trying to generate for large date ranges.",
    status: "resolved",
    priority: "low",
    category: "reports",
    createdAt: "2024-01-12T16:20:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
    assignedTo: "Alex Rodriguez",
    customer: {
      name: "David Wilson",
      email: "david.wilson@example.com",
      avatar: user3,
    },
    replies: 8,
    attachments: 0,
  },
  {
    id: "TKT-004",
    title: "User permissions not working correctly",
    description:
      "New user cannot access the dashboard despite being assigned the correct role.",
    status: "closed",
    priority: "high",
    category: "account",
    createdAt: "2024-01-10T14:45:00Z",
    updatedAt: "2024-01-12T09:20:00Z",
    assignedTo: "Sarah Johnson",
    customer: {
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      avatar: user4,
    },
    replies: 12,
    attachments: 3,
  },
  {
    id: "TKT-005",
    title: "Order creation form validation errors",
    description:
      "The order creation form shows validation errors even when all required fields are filled.",
    status: "open",
    priority: "medium",
    category: "orders",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
    assignedTo: null,
    customer: {
      name: "Robert Brown",
      email: "robert.brown@example.com",
      avatar: user5,
    },
    replies: 0,
    attachments: 1,
  },
];

// Mock data for ticket conversation
const mockConversation = [
  {
    id: 1,
    author: "John Smith",
    role: "customer",
    avatar: user1,
    message:
      "I'm having trouble tracking my shipment SHP-2024-001. When I click on the tracking link, I get an error message saying 'Shipment not found'.",
    timestamp: "2024-01-15T10:30:00Z",
    attachments: ["screenshot-error.png", "shipment-receipt.pdf"],
  },
  {
    id: 2,
    author: "Sarah Johnson",
    role: "support",
    avatar: user2,
    message:
      "Hi John, thank you for reaching out. I can see the issue with your shipment tracking. Let me investigate this for you and get back to you shortly.",
    timestamp: "2024-01-15T11:15:00Z",
    attachments: [],
  },
  {
    id: 3,
    author: "Sarah Johnson",
    role: "support",
    avatar: user3,
    message:
      "I've identified the issue - there was a sync problem with our tracking database. Your shipment is currently in transit and should arrive tomorrow. I've updated the tracking information and you should now be able to view it properly.",
    timestamp: "2024-01-15T14:20:00Z",
    attachments: ["updated-tracking.png"],
  },
];

const statusConfig = {
  open: { label: "Open", color: "bg-red-100 text-red-800", icon: AlertCircle },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-blue-100 text-blue-800" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
};

const categoryConfig = {
  shipments: { label: "Shipments", color: "bg-purple-100 text-purple-800" },
  fleet: { label: "Fleet", color: "bg-green-100 text-green-800" },
  orders: { label: "Orders", color: "bg-blue-100 text-blue-800" },
  reports: { label: "Reports", color: "bg-orange-100 text-orange-800" },
  account: { label: "Account", color: "bg-pink-100 text-pink-800" },
  other: { label: "Other", color: "bg-gray-100 text-gray-800" },
};

export default function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Filter tickets based on search and filters
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getTicketCounts = () => {
    return {
      all: mockTickets.length,
      open: mockTickets.filter((t) => t.status === "open").length,
      "in-progress": mockTickets.filter((t) => t.status === "in-progress")
        .length,
      resolved: mockTickets.filter((t) => t.status === "resolved").length,
      closed: mockTickets.filter((t) => t.status === "closed").length,
    };
  };

  const counts = getTicketCounts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const handleCreateTicket = () => {
    // Handle ticket creation
    setNewTicketOpen(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        pageTitle="Support Tickets"
        pageDes="Manage and track customer support requests"
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Tickets List */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>
                    Track and manage customer support requests
                  </CardDescription>
                </div>
                <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Support Ticket</DialogTitle>
                      <DialogDescription>
                        Create a new support ticket for customer assistance
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer">Customer</Label>
                          <Input
                            id="customer"
                            placeholder="Customer name or email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shipments">Shipments</SelectItem>
                            <SelectItem value="fleet">Fleet</SelectItem>
                            <SelectItem value="orders">Orders</SelectItem>
                            <SelectItem value="reports">Reports</SelectItem>
                            <SelectItem value="account">Account</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of the issue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed description of the issue"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setNewTicketOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTicket}>
                          Create Ticket
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap flex-col sm:flex-row gap-4">
                  <div className="relative min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="shipments">Shipments</SelectItem>
                        <SelectItem value="fleet">Fleet</SelectItem>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status Tabs */}
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList className="flex flex-wrap gap-2 h-max justify-start">
                    <TabsTrigger value="all" className="text-xs">
                      All ({counts.all})
                    </TabsTrigger>
                    <TabsTrigger value="open" className="text-xs">
                      Open ({counts.open})
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="text-xs">
                      In Progress ({counts["in-progress"]})
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs">
                      Resolved ({counts.resolved})
                    </TabsTrigger>
                    <TabsTrigger value="closed" className="text-xs">
                      Closed ({counts.closed})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const StatusIcon =
                    statusConfig[ticket.status as keyof typeof statusConfig]
                      .icon;
                  return (
                    <Card
                      key={ticket.id}
                      className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-muted/50 duration-300 ${
                        selectedTicket === ticket.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between ">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-sm text-gray-500">
                                {ticket.id}
                              </span>
                              <Badge
                                className={
                                  statusConfig[
                                    ticket.status as keyof typeof statusConfig
                                  ].color
                                }
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {
                                  statusConfig[
                                    ticket.status as keyof typeof statusConfig
                                  ].label
                                }
                              </Badge>
                              <Badge
                                className={
                                  priorityConfig[
                                    ticket.priority as keyof typeof priorityConfig
                                  ].color
                                }
                              >
                                {
                                  priorityConfig[
                                    ticket.priority as keyof typeof priorityConfig
                                  ].label
                                }
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  categoryConfig[
                                    ticket.category as keyof typeof categoryConfig
                                  ].color
                                }
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {
                                  categoryConfig[
                                    ticket.category as keyof typeof categoryConfig
                                  ].label
                                }
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1 truncate">
                              {ticket.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Avatar className="h-5 w-5">
                                  <Image
                                    src={
                                      ticket.customer.avatar ||
                                      "/placeholder.svg"
                                    }
                                    alt="..."
                                  />
                                  <AvatarFallback>
                                    {ticket.customer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{ticket.customer.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(ticket.createdAt)}</span>
                              </div>
                              {ticket.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>Assigned to {ticket.assignedTo}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{ticket.replies}</span>
                                </div>
                                {ticket.attachments > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    <span>{ticket.attachments}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tickets found
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    priorityFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No support tickets have been created yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        {selectedTicket && (
          <div className="col-span-12 xl:col-span-4">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Ticket Details</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const ticket = mockTickets.find(
                    (t) => t.id === selectedTicket
                  );
                  if (!ticket) return null;

                  const StatusIcon =
                    statusConfig[ticket.status as keyof typeof statusConfig]
                      .icon;

                  return (
                    <div className="space-y-6">
                      {/* Ticket Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-gray-500">
                            {ticket.id}
                          </span>
                          <Badge
                            className={
                              statusConfig[
                                ticket.status as keyof typeof statusConfig
                              ].color
                            }
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {
                              statusConfig[
                                ticket.status as keyof typeof statusConfig
                              ].label
                            }
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.description}
                        </p>
                      </div>

                      <Separator />

                      {/* Ticket Info */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Priority
                          </span>
                          <Badge
                            className={
                              priorityConfig[
                                ticket.priority as keyof typeof priorityConfig
                              ].color
                            }
                          >
                            {
                              priorityConfig[
                                ticket.priority as keyof typeof priorityConfig
                              ].label
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Category
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              categoryConfig[
                                ticket.category as keyof typeof categoryConfig
                              ].color
                            }
                          >
                            {
                              categoryConfig[
                                ticket.category as keyof typeof categoryConfig
                              ].label
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Customer
                          </span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <Image
                                src={
                                  ticket.customer.avatar || "/placeholder.svg"
                                }
                                alt="..."
                              />
                              <AvatarFallback>
                                {ticket.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {ticket.customer.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Assigned To
                          </span>
                          <span className="text-sm">
                            {ticket.assignedTo || "Unassigned"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Created
                          </span>
                          <span className="text-sm">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Last Updated
                          </span>
                          <span className="text-sm">
                            {formatDate(ticket.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      {/* Conversation */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200  mb-4">
                          Conversation
                        </h4>
                        
                          <div className="space-y-4">
                            {mockConversation.map((message) => (
                              <div
                                key={message.id}
                                className="flex flex-wrap sm:flex-nowrap gap-3"
                              >
                                <Avatar className="h-8 w-8">
                                  <Image src={message.avatar} alt="..." />
                                  <AvatarFallback>
                                    {message.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-nowrap">
                                      {message.author}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {message.role === "customer"
                                        ? "Customer"
                                        : "Support"}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(message.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-400  mb-2">
                                    {message.message}
                                  </p>
                                  {message.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {message.attachments.map(
                                        (attachment, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            <Paperclip className="h-3 w-3 mr-1" />
                                            {attachment}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                       
                      </div>

                      {/* Reply */}
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your reply..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach
                          </Button>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
