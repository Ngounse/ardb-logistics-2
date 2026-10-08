"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  DollarSign,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  FileText,
  Printer,
  MessageSquare,
  AlertCircle,
  Trash2,
  PenLine,
  Eye,
  X,
  ArrowLeft,
  ArrowRight,
  Ban,
  RotateCcw,
  CreditCard,
  BarChart,
  Download,
  ChevronDown,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Sample data for cancellations
const cancellationsData = [
  {
    id: "CAN-001",
    orderId: "ORD-2024-001",
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "Widget Pro X1", sku: "WDG-PRO-X1", price: 249.99, quantity: 1 },
      { name: "Cable Set", sku: "CBL-SET-001", price: 49.99, quantity: 1 },
    ],
    reason: "Changed Mind",
    status: "pending",
    requestDate: "2024-01-20",
    value: 299.99,
    paymentMethod: "Credit Card",
    refundStatus: "pending",
    notes: "Customer requested cancellation before shipping",
    priority: "medium",
    cancellationFee: 0,
    address: "123 Main St, Anytown, CA 94321",
    timeElapsed: "2 hours",
    orderDate: "2024-01-20",
  },
  {
    id: "CAN-002",
    orderId: "ORD-2024-045",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    items: [
      {
        name: "Smart Monitor 27",
        sku: "SM-MON-27",
        price: 549.99,
        quantity: 1,
      },
    ],
    reason: "Found Better Price",
    status: "approved",
    requestDate: "2024-01-19",
    value: 549.99,
    paymentMethod: "PayPal",
    refundStatus: "processing",
    notes: "Customer found same item for $50 less",
    priority: "low",
    cancellationFee: 0,
    address: "456 Oak Ave, Springfield, IL 62701",
    timeElapsed: "5 hours",
    orderDate: "2024-01-19",
  },
  {
    id: "CAN-003",
    orderId: "ORD-2024-089",
    customer: "Mike Johnson",
    email: "mike.j@example.com",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "Laptop Stand", sku: "LPT-STD-001", price: 79.99, quantity: 1 },
      { name: "USB Hub", sku: "USB-HUB-4P", price: 49.99, quantity: 1 },
    ],
    reason: "Shipping Delay",
    status: "processing",
    requestDate: "2024-01-18",
    value: 129.99,
    paymentMethod: "Credit Card",
    refundStatus: "pending",
    notes: "Customer needed item sooner than our estimated delivery date",
    priority: "high",
    cancellationFee: 0,
    address: "789 Pine St, Portland, OR 97205",
    timeElapsed: "1 day",
    orderDate: "2024-01-17",
  },
  {
    id: "CAN-004",
    orderId: "ORD-2024-102",
    customer: "Sarah Wilson",
    email: "sarah.w@example.com",
    phone: "+1 (555) 234-5678",
    items: [
      {
        name: "Wireless Keyboard",
        sku: "WL-KBD-001",
        price: 89.99,
        quantity: 1,
      },
    ],
    reason: "Payment Issue",
    status: "completed",
    requestDate: "2024-01-17",
    value: 89.99,
    paymentMethod: "Debit Card",
    refundStatus: "completed",
    notes: "Customer's card was declined, requested cancellation",
    priority: "medium",
    cancellationFee: 0,
    address: "321 Elm St, Boston, MA 02108",
    timeElapsed: "3 days",
    orderDate: "2024-01-14",
  },
  {
    id: "CAN-005",
    orderId: "ORD-2024-156",
    customer: "Robert Brown",
    email: "robert.b@example.com",
    phone: "+1 (555) 876-5432",
    items: [
      { name: "Gaming Mouse", sku: "GM-MSE-PRO", price: 129.99, quantity: 1 },
      { name: "Mouse Pad", sku: "MSE-PAD-LG", price: 29.99, quantity: 1 },
    ],
    reason: "Ordered by Mistake",
    status: "denied",
    requestDate: "2024-01-16",
    value: 159.99,
    paymentMethod: "Credit Card",
    refundStatus: "denied",
    notes:
      "Cancellation requested after shipping, customer advised to return item instead",
    priority: "low",
    cancellationFee: 15.99,
    address: "654 Maple Dr, Austin, TX 78701",
    timeElapsed: "4 days",
    orderDate: "2024-01-12",
  },
  {
    id: "CAN-006",
    orderId: "ORD-2024-178",
    customer: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 345-6789",
    items: [
      {
        name: "Bluetooth Speaker",
        sku: "BT-SPK-001",
        price: 199.99,
        quantity: 1,
      },
    ],
    reason: "Changed Mind",
    status: "pending",
    requestDate: "2024-01-15",
    value: 199.99,
    paymentMethod: "PayPal",
    refundStatus: "pending",
    notes: "Customer decided they don't need the item",
    priority: "medium",
    cancellationFee: 0,
    address: "987 Cedar Ln, Seattle, WA 98101",
    timeElapsed: "6 hours",
    orderDate: "2024-01-15",
  },
  {
    id: "CAN-007",
    orderId: "ORD-2024-203",
    customer: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 (555) 567-8901",
    items: [
      {
        name: "Wireless Earbuds",
        sku: "WL-EAR-PRO",
        price: 149.99,
        quantity: 1,
      },
    ],
    reason: "Duplicate Order",
    status: "approved",
    requestDate: "2024-01-14",
    value: 149.99,
    paymentMethod: "Credit Card",
    refundStatus: "processing",
    notes: "Customer accidentally placed the same order twice",
    priority: "high",
    cancellationFee: 0,
    address: "246 Birch Ave, Denver, CO 80202",
    timeElapsed: "1 day",
    orderDate: "2024-01-13",
  },
];

const statusConfig = {
  pending: {
    label: "Pending Review",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: RefreshCw,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: CheckCircle,
  },
  denied: {
    label: "Denied",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  high: {
    label: "High",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

const reasonOptions = [
  "Changed Mind",
  "Found Better Price",
  "Shipping Delay",
  "Payment Issue",
  "Ordered by Mistake",
  "Duplicate Order",
  "Customer Service Issue",
  "Product Unavailable",
  "Other",
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCancellation, setSelectedCancellation] = useState<
    (typeof cancellationsData)[0] | null
  >(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState("requestDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter cancellations based on search and filters
  const filteredCancellations = cancellationsData.filter((can) => {
    const matchesSearch =
      can.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      can.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      can.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      can.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || can.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || can.priority === priorityFilter;
    const matchesReason = reasonFilter === "all" || can.reason === reasonFilter;

    // Simple date filtering
    let matchesDate = true;
    const cancellationDate = new Date(can.requestDate);
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateFilter === "today") {
      matchesDate =
        cancellationDate.getDate() === today.getDate() &&
        cancellationDate.getMonth() === today.getMonth() &&
        cancellationDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === "week") {
      matchesDate = cancellationDate >= lastWeek;
    } else if (dateFilter === "month") {
      matchesDate = cancellationDate >= lastMonth;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesReason &&
      matchesDate
    );
  });

  // Sort cancellations
  const sortedCancellations = [...filteredCancellations].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];

    // Handle nested properties
    if (sortField === "items") {
      aValue = a.items.map((item) => item.name).join(", ");
      bValue = b.items.map((item) => item.name).join(", ");
    }

    // Handle date comparison
    if (sortField === "requestDate" || sortField === "orderDate") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCancellations.length / itemsPerPage);
  const paginatedCancellations = sortedCancellations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    total: cancellationsData.length,
    pending: cancellationsData.filter((r) => r.status === "pending").length,
    approved: cancellationsData.filter((r) => r.status === "approved").length,
    processing: cancellationsData.filter((r) => r.status === "processing")
      .length,
    completed: cancellationsData.filter((r) => r.status === "completed").length,
    denied: cancellationsData.filter((r) => r.status === "denied").length,
    totalValue: cancellationsData.reduce((sum, r) => sum + r.value, 0),
    avgValue:
      cancellationsData.reduce((sum, r) => sum + r.value, 0) /
      cancellationsData.length,
    cancellationRate: 4.2, // This would be calculated from total orders in a real app
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openCancellationDetails = (
    cancellation: (typeof cancellationsData)[0]
  ) => {
    setSelectedCancellation(cancellation);
    setDetailsOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedCancellations.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedCancellations.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    // In a real app, this would call an API to perform the action
    console.log(`Performing ${action} on items:`, selectedItems);
    // Reset selection after action
    setSelectedItems([]);
  };

  const handleStatusChange = (newStatus: string) => {
    // In a real app, this would update the status via API
    console.log(
      `Changing status to ${newStatus} for cancellation:`,
      selectedCancellation?.id
    );
    setDetailsOpen(false);
  };

  return (
    <div>
        <div className="flex flex-wrap flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Cancellations
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and process customer order cancellation requests
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-1 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
            </button>
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Cancellations
              </span>
              <div className="p-2 bg-red-100 rounded-full">
              <Ban className="h-4 w-4 text-red-500" />
            </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +8% from last month
              </p>
              <div className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded">
                +8%
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Review
              </span>
              <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.pending}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Requires attention
              </p>
              <div className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded">
                {Math.round((stats.pending / stats.total) * 100)}%
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cancellation Rate
              </span>
              <div className="p-2 bg-blue-100 rounded-full">
              <BarChart className="h-4 w-4 text-blue-500" />
            </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.cancellationRate}%
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Of total orders
              </p>
              <div className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                Details
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Value
              </span>
              <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $
              {stats.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avg: ${stats.avgValue.toFixed(2)}
              </p>
              <div className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                Details
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <div
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center ${
              statusFilter === "pending" ? "ring-2 ring-yellow-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "pending" ? "all" : "pending")
            }
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </span>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.pending}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          <div
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center ${
              statusFilter === "approved" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "approved" ? "all" : "approved")
            }
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Approved
              </span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.approved}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(stats.approved / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          <div
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center ${
              statusFilter === "processing" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(
                statusFilter === "processing" ? "all" : "processing"
              )
            }
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Processing
              </span>
              <RefreshCw className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.processing}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{
                  width: `${(stats.processing / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center ${
              statusFilter === "completed" ? "ring-2 ring-gray-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(
                statusFilter === "completed" ? "all" : "completed"
              )
            }
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </span>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.completed}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-gray-500 h-2.5 rounded-full"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          <div
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center ${
              statusFilter === "denied" ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "denied" ? "all" : "denied")
            }
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Denied
              </span>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.denied}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{ width: `${(stats.denied / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cancellation Reason
                </label>
                <select
                  value={reasonFilter}
                  onChange={(e) => setReasonFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Reasons</option>
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setReasonFilter("all");
                  setDateFilter("all");
                  setSearchTerm("");
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 mr-2"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Cancellations Table */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cancellation Requests
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage customer order cancellation requests
            </p>
          </div>
          <div className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, order ID, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full md:w-[180px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="denied">Denied</option>
                </select>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md flex flex-wrap gap-2 items-center justify-between">
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedItems.length}{" "}
                  {selectedItems.length === 1 ? "item" : "items"} selected
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkAction("export")}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleBulkAction("print")}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleBulkAction("approve")}
                    className="px-2 py-1 text-xs bg-green-600 rounded text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleBulkAction("deny")}
                    className="px-2 py-1 text-xs bg-red-600 rounded text-white"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Cancellations Table */}
            <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <th className="p-4 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              paginatedCancellations.length > 0 &&
                              selectedItems.length ===
                                paginatedCancellations.length
                            }
                            onChange={toggleSelectAll}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center">
                          Cancellation ID
                          {sortField === "id" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("customer")}
                      >
                        <div className="flex items-center">
                          Customer
                          {sortField === "customer" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("items")}
                      >
                        <div className="flex items-center">
                          Items
                          {sortField === "items" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("reason")}
                      >
                        <div className="flex items-center">
                          Reason
                          {sortField === "reason" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === "status" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("value")}
                      >
                        <div className="flex items-center">
                          Value
                          {sortField === "value" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("timeElapsed")}
                      >
                        <div className="flex items-center">
                          Time Elapsed
                          {sortField === "timeElapsed" && (
                            <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </th>
                      <th className="p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCancellations.map((cancellation) => {
                      const StatusIcon =
                        statusConfig[
                          cancellation.status as keyof typeof statusConfig
                        ].icon;
                      return (
                        <tr
                          key={cancellation.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(
                                  cancellation.id
                                )}
                                onChange={() =>
                                  toggleSelectItem(cancellation.id)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {cancellation.id}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {cancellation.orderId}
                            </div>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {cancellation.customer}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {cancellation.email}
                            </div>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <div className="text-sm text-gray-900 dark:text-white">
                              {cancellation.items
                                .map((item) => item.name)
                                .join(", ")}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {cancellation.items.length}{" "}
                              {cancellation.items.length === 1
                                ? "item"
                                : "items"}
                            </div>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <span className="text-sm text-gray-900 dark:text-white">
                              {cancellation.reason}
                            </span>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  statusConfig[
                                    cancellation.status as keyof typeof statusConfig
                                  ].color
                                }`}
                              >
                                {
                                  statusConfig[
                                    cancellation.status as keyof typeof statusConfig
                                  ].label
                                }
                              </span>
                            </div>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${cancellation.value.toFixed(2)}
                            </span>
                          </td>
                          <td
                            className="p-4 cursor-pointer"
                            onClick={() =>
                              openCancellationDetails(cancellation)
                            }
                          >
                            <span className="text-sm text-gray-900 dark:text-white">
                              {cancellation.timeElapsed}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCancellationDetails(cancellation);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit", cancellation.id);
                                }}
                                className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                title="Edit"
                              >
                                <PenLine className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Delete", cancellation.id);
                                }}
                                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredCancellations.length
                )}{" "}
                of {filteredCancellations.length} cancellations
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      
      {detailsOpen && selectedCancellation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setDetailsOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Cancellation Details - {selectedCancellation.id}
                  </h3>
                  <button
                    onClick={() => setDetailsOpen(false)}
                    className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex flex-wrap gap-2 " aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "details"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab("items")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "items"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Items
                    </button>
                    <button
                      onClick={() => setActiveTab("customer")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "customer"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => setActiveTab("actions")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "actions"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Actions
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {/* Details Tab */}
                  {activeTab === "details" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Cancellation Information
                          </h4>
                          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Cancellation ID
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.id}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Order ID
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.orderId}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Status
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        statusConfig[
                                          selectedCancellation.status as keyof typeof statusConfig
                                        ].color
                                      }`}
                                    >
                                      {
                                        statusConfig[
                                          selectedCancellation.status as keyof typeof statusConfig
                                        ].label
                                      }
                                    </span>
                                  </div>
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Request Date
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.requestDate}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Order Date
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.orderDate}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Time Elapsed
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.timeElapsed}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Priority
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      priorityConfig[
                                        selectedCancellation.priority as keyof typeof priorityConfig
                                      ].color
                                    }`}
                                  >
                                    {
                                      priorityConfig[
                                        selectedCancellation.priority as keyof typeof priorityConfig
                                      ].label
                                    }
                                  </span>
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Cancellation Details
                          </h4>
                          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Reason
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.reason}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Payment Method
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.paymentMethod}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Refund Status
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      selectedCancellation.refundStatus ===
                                      "pending"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : selectedCancellation.refundStatus ===
                                          "processing"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        : selectedCancellation.refundStatus ===
                                          "completed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }`}
                                  >
                                    {selectedCancellation.refundStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                      selectedCancellation.refundStatus.slice(
                                        1
                                      )}
                                  </span>
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Cancellation Fee
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  $
                                  {selectedCancellation.cancellationFee.toFixed(
                                    2
                                  )}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Total Value
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2 font-medium">
                                  ${selectedCancellation.value.toFixed(2)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Notes
                        </h4>
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {selectedCancellation.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items Tab */}
                  {activeTab === "items" && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cancelled Items
                      </h4>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Item
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                SKU
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Price
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedCancellation.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {item.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  ${item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right"
                              >
                                Subtotal:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                ${selectedCancellation.value.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right"
                              >
                                Cancellation Fee:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                $
                                {selectedCancellation.cancellationFee.toFixed(
                                  2
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right"
                              >
                                Total Refund:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                $
                                {(
                                  selectedCancellation.value -
                                  selectedCancellation.cancellationFee
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Customer Tab */}
                  {activeTab === "customer" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Customer Information
                          </h4>
                          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Name
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.customer}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Email
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.email}
                                </dd>
                              </div>
                              <div className="py-2 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Phone
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                                  {selectedCancellation.phone}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Shipping Address
                          </h4>
                          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {selectedCancellation.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Order History
                        </h4>
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This customer has placed 5 orders and has 1 previous
                            cancellation.
                          </p>
                          <div className="mt-2 flex space-x-2">
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              View Order History
                            </button>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              View Customer Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Tab */}
                  {activeTab === "actions" && (
                    <div className="space-y-4">
                      {selectedCancellation.status === "pending" && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Action Required
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                <p>
                                  This cancellation request is pending review.
                                  Please approve or deny it.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Update Status
                        </h4>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                          <button
                            onClick={() => handleStatusChange("pending")}
                            className={`p-2 text-xs rounded-md flex flex-col items-center ${
                              selectedCancellation.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-2 border-yellow-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <Clock className="h-4 w-4 mb-1" />
                            Pending
                          </button>
                          <button
                            onClick={() => handleStatusChange("approved")}
                            className={`p-2 text-xs rounded-md flex flex-col items-center ${
                              selectedCancellation.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-2 border-green-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4 mb-1" />
                            Approved
                          </button>
                          <button
                            onClick={() => handleStatusChange("processing")}
                            className={`p-2 text-xs rounded-md flex flex-col items-center ${
                              selectedCancellation.status === "processing"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-2 border-blue-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <RefreshCw className="h-4 w-4 mb-1" />
                            Processing
                          </button>
                          <button
                            onClick={() => handleStatusChange("completed")}
                            className={`p-2 text-xs rounded-md flex flex-col items-center ${
                              selectedCancellation.status === "completed"
                                ? "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-2 border-gray-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4 mb-1" />
                            Completed
                          </button>
                          <button
                            onClick={() => handleStatusChange("denied")}
                            className={`p-2 text-xs rounded-md flex flex-col items-center ${
                              selectedCancellation.status === "denied"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-2 border-red-500"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <XCircle className="h-4 w-4 mb-1" />
                            Denied
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Refund Options
                        </h4>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <button
                            onClick={() => console.log("Full refund")}
                            className="p-2 text-xs rounded-md flex flex-col items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          >
                            <CreditCard className="h-4 w-4 mb-1" />
                            Full Refund
                          </button>
                          <button
                            onClick={() => console.log("Partial refund")}
                            className="p-2 text-xs rounded-md flex flex-col items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          >
                            <DollarSign className="h-4 w-4 mb-1" />
                            Partial Refund
                          </button>
                          <button
                            onClick={() => console.log("Store credit")}
                            className="p-2 text-xs rounded-md flex flex-col items-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          >
                            <ShoppingCart className="h-4 w-4 mb-1" />
                            Store Credit
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Add Internal Note
                        </h4>
                        <div className="mt-2">
                          <textarea
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Add a note about this cancellation..."
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-1 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800">
                          <MessageSquare className="h-4 w-4" />
                          Contact Customer
                        </button>
                        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-1 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800">
                          <RotateCcw className="h-4 w-4" />
                          Restock Items
                        </button>
                        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-1 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800">
                          <FileText className="h-4 w-4" />
                          Generate Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                {selectedCancellation.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("approved")}
                      className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("denied")}
                      className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Deny
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
