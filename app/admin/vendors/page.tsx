"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDownUp,
  ArrowUpDown,
  Building,
  Building2,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UserPlus,
  X,
  Check,
  Upload,
  Paperclip,
} from "lucide-react";
import { MyCancel, MySave } from "@/components/myFunction";

// Mock data for vendors
const vendors = [
  {
    id: "V-001",
    name: "Global Logistics Partners",
    category: "Transportation",
    status: "Active",
    rating: 4.8,
    contactPerson: "John Smith",
    email: "john@globallogistics.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    contractExpiry: "2024-12-15",
    lastDelivery: "2023-05-10",
    onTimeDelivery: 98,
    qualityScore: 4.7,
    responseTime: "2h",
    tags: ["International", "Premium", "Certified"],
  },
  {
    id: "V-002",
    name: "FastTrack Shipping",
    category: "Courier",
    status: "Active",
    rating: 4.5,
    contactPerson: "Sarah Johnson",
    email: "sarah@fasttrack.com",
    phone: "+1 (555) 987-6543",
    location: "Chicago, IL",
    contractExpiry: "2024-08-22",
    lastDelivery: "2023-05-12",
    onTimeDelivery: 95,
    qualityScore: 4.3,
    responseTime: "1h",
    tags: ["Domestic", "Express", "Certified"],
  },
  {
    id: "V-003",
    name: "OceanFreight Solutions",
    category: "Maritime",
    status: "Active",
    rating: 4.2,
    contactPerson: "Michael Chen",
    email: "michael@oceanfreight.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    contractExpiry: "2025-03-10",
    lastDelivery: "2023-05-05",
    onTimeDelivery: 92,
    qualityScore: 4.1,
    responseTime: "4h",
    tags: ["International", "Maritime", "Bulk"],
  },
  {
    id: "V-004",
    name: "AirARDB Express",
    category: "Air Freight",
    status: "Active",
    rating: 4.7,
    contactPerson: "Emily Rodriguez",
    email: "emily@airARDB.com",
    phone: "+1 (555) 234-5678",
    location: "Miami, FL",
    contractExpiry: "2024-10-05",
    lastDelivery: "2023-05-11",
    onTimeDelivery: 97,
    qualityScore: 4.6,
    responseTime: "1h",
    tags: ["International", "Express", "Premium"],
  },
  {
    id: "V-005",
    name: "RailConnect Logistics",
    category: "Rail Transport",
    status: "Inactive",
    rating: 3.9,
    contactPerson: "David Wilson",
    email: "david@railconnect.com",
    phone: "+1 (555) 876-5432",
    location: "Denver, CO",
    contractExpiry: "2023-11-30",
    lastDelivery: "2023-04-28",
    onTimeDelivery: 88,
    qualityScore: 3.8,
    responseTime: "6h",
    tags: ["Domestic", "Bulk", "Rail"],
  },
  {
    id: "V-006",
    name: "TruckFleet Services",
    category: "Trucking",
    status: "Active",
    rating: 4.4,
    contactPerson: "Jessica Brown",
    email: "jessica@truckfleet.com",
    phone: "+1 (555) 345-6789",
    location: "Dallas, TX",
    contractExpiry: "2024-09-18",
    lastDelivery: "2023-05-09",
    onTimeDelivery: 94,
    qualityScore: 4.2,
    responseTime: "3h",
    tags: ["Domestic", "Refrigerated", "Hazmat"],
  },
  {
    id: "V-007",
    name: "WarehousePro Solutions",
    category: "Warehousing",
    status: "Active",
    rating: 4.6,
    contactPerson: "Robert Taylor",
    email: "robert@warehousepro.com",
    phone: "+1 (555) 567-8901",
    location: "Atlanta, GA",
    contractExpiry: "2025-01-20",
    lastDelivery: "N/A",
    onTimeDelivery: 99,
    qualityScore: 4.5,
    responseTime: "2h",
    tags: ["Storage", "Distribution", "Certified"],
  },
  {
    id: "V-008",
    name: "CustomsClear International",
    category: "Customs Broker",
    status: "Active",
    rating: 4.3,
    contactPerson: "Amanda Lee",
    email: "amanda@customsclear.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    contractExpiry: "2024-07-12",
    lastDelivery: "N/A",
    onTimeDelivery: 96,
    qualityScore: 4.4,
    responseTime: "2h",
    tags: ["International", "Compliance", "Documentation"],
  },
  {
    id: "V-009",
    name: "LastMile Delivery Co.",
    category: "Delivery",
    status: "Under Review",
    rating: 3.8,
    contactPerson: "Kevin Martinez",
    email: "kevin@lastmile.com",
    phone: "+1 (555) 789-0123",
    location: "Portland, OR",
    contractExpiry: "2024-05-30",
    lastDelivery: "2023-05-08",
    onTimeDelivery: 87,
    qualityScore: 3.7,
    responseTime: "4h",
    tags: ["Domestic", "Urban", "Same-day"],
  },
  {
    id: "V-010",
    name: "GreenTransport Solutions",
    category: "Transportation",
    status: "Active",
    rating: 4.5,
    contactPerson: "Lisa Green",
    email: "lisa@greentransport.com",
    phone: "+1 (555) 890-1234",
    location: "San Francisco, CA",
    contractExpiry: "2024-11-08",
    lastDelivery: "2023-05-07",
    onTimeDelivery: 93,
    qualityScore: 4.4,
    responseTime: "3h",
    tags: ["Eco-friendly", "Electric", "Certified"],
  },
];

// Mock data for performance metrics
const performanceMetrics = [
  { title: "Total Vendors", value: "42", change: "+3", changeType: "increase" },
  {
    title: "Active Contracts",
    value: "38",
    change: "+2",
    changeType: "increase",
  },
  {
    title: "Avg. Performance",
    value: "94%",
    change: "+2%",
    changeType: "increase",
  },
  { title: "Expiring Soon", value: "5", change: "-1", changeType: "decrease" },
];

export default function VendorDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [isContractViewOpen, setIsContractViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New vendor form state
  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "Transportation",
    status: "Active",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    tags: [] as string[],
  });

  // Edit vendor form state
  const [editVendor, setEditVendor] = useState<any>(null);

  // Filter vendors based on search term, category, status, and active tab
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || vendor.status === selectedStatus;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "premium" && vendor.tags.includes("Premium")) ||
      (activeTab === "international" &&
        vendor.tags.includes("International")) ||
      (activeTab === "domestic" && vendor.tags.includes("Domestic"));

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  // Sort vendors if sort config is set
  const sortedVendors = sortConfig
    ? [...filteredVendors].sort((a, b) => {
      if (
        a[sortConfig.key as keyof typeof a] <
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (
        a[sortConfig.key as keyof typeof a] >
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    })
    : filteredVendors;

  // Handle sorting
  const requestSort = (key: string) => {
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setActiveTab("all");
    setSortConfig(null);
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowDownUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownUp className="ml-2 h-4 w-4 rotate-180" />
    );
  };

  // Handle vendor profile view
  const handleViewProfile = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsProfileOpen(true);
  };

  // Handle edit vendor
  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setEditVendor({
      ...vendor,
      tags: [...vendor.tags],
    });
    setIsEditVendorOpen(true);
  };

  // Handle view contract
  const handleViewContract = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsContractViewOpen(true);
  };

  // Handle add new vendor
  const handleAddNewVendor = () => {
    setIsAddVendorOpen(true);
    setNewVendor({
      name: "",
      category: "Transportation",
      status: "Active",
      contactPerson: "",
      email: "",
      phone: "",
      location: "",
      tags: [],
    });
  };

  // Handle form input change for new vendor
  const handleNewVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form input change for edit vendor
  const handleEditVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditVendor((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change for new vendor
  const handleNewVendorSelectChange = (name: string, value: string) => {
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change for edit vendor
  const handleEditVendorSelectChange = (name: string, value: string) => {
    setEditVendor((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag toggle for new vendor
  const handleNewVendorTagToggle = (tag: string) => {
    setNewVendor((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return {
        ...prev,
        tags,
      };
    });
  };

  // Handle tag toggle for edit vendor
  const handleEditVendorTagToggle = (tag: string) => {
    setEditVendor((prev: any) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag];
      return {
        ...prev,
        tags,
      };
    });
  };

  // Handle submit new vendor
  const handleSubmitNewVendor = () => {
    // In a real application, this would send data to an API
    // For this demo, we'll just close the dialog
    setIsAddVendorOpen(false);
    // Show success message or update the vendors list
  };

  // Handle submit edit vendor
  const handleSubmitEditVendor = () => {
    // In a real application, this would send data to an API
    // For this demo, we'll just close the dialog
    setIsEditVendorOpen(false);
    // Show success message or update the vendors list
  };

  // Handle file upload click
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <Badge
                    variant={
                      metric.changeType === "increase"
                        ? "default"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Vendor Directory</CardTitle>
                <CardDescription>
                  Manage your vendors, view performance metrics, and track
                  contracts
                </CardDescription>
              </div>
              <Button className="w-full md:w-auto" onClick={handleAddNewVendor}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Vendor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="w-full sm:w-auto flex flex-wrap h-full justify-start">
                <TabsTrigger value="all">All Vendors</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="international">International</TabsTrigger>
                <TabsTrigger value="domestic">Domestic</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                    <SelectItem value="Maritime">Maritime</SelectItem>
                    <SelectItem value="Air Freight">Air Freight</SelectItem>
                    <SelectItem value="Rail Transport">
                      Rail Transport
                    </SelectItem>
                    <SelectItem value="Trucking">Trucking</SelectItem>
                    <SelectItem value="Warehousing">Warehousing</SelectItem>
                    <SelectItem value="Customs Broker">
                      Customs Broker
                    </SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="shrink-0"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Vendors Table */}
            <div className="rounded-md border">
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="min-w-[180px]">
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("name")}
                      >
                        Vendor Name
                        {getSortDirectionIcon("name")}
                      </button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("rating")}
                      >
                        Rating
                        {getSortDirectionIcon("rating")}
                      </button>
                    </TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => requestSort("contractExpiry")}
                      >
                        Contract Expiry
                        {getSortDirectionIcon("contractExpiry")}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVendors.length > 0 ? (
                    sortedVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">
                          {vendor.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vendor.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{vendor.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vendor.status === "Active"
                                ? "success"
                                : vendor.status === "Inactive"
                                  ? "destructive"
                                  : "warning"
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                            <span>{vendor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{vendor.contactPerson}</div>
                          <div className="text-xs text-muted-foreground">
                            {vendor.email}
                          </div>
                        </TableCell>
                        <TableCell>{vendor.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(
                                vendor.contractExpiry
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewProfile(vendor)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditVendor(vendor)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewContract(vendor)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Contract
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedVendor(vendor);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Vendor
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No vendors found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{sortedVendors.length}</strong> of{" "}
                <strong>{vendors.length}</strong> vendors
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Profile Dialog */}
      {selectedVendor && (
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] h-max overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Vendor Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedVendor.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedVendor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.category}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVendor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVendor.email}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Contract Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Contract ID:
                      </span>
                      <span>C-{selectedVendor.id.substring(2)}-2023</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Start Date:
                      </span>
                      <span>
                        {new Date(
                          new Date(selectedVendor.contractExpiry).getTime() -
                          365 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Expiry Date:
                      </span>
                      <span>
                        {new Date(
                          selectedVendor.contractExpiry
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          selectedVendor.status === "Active"
                            ? "success"
                            : selectedVendor.status === "Inactive"
                              ? "destructive"
                              : "warning"
                        }
                      >
                        {selectedVendor.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          On-Time Delivery
                        </span>
                        <span className="text-sm font-medium">
                          {selectedVendor.onTimeDelivery}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${selectedVendor.onTimeDelivery}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Quality Score
                        </span>
                        <span className="text-sm font-medium">
                          {selectedVendor.qualityScore}/5
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(selectedVendor.qualityScore / 5) * 100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Response Time
                      </span>
                      <span>{selectedVendor.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Delivery
                      </span>
                      <span>
                        {selectedVendor.lastDelivery === "N/A"
                          ? "N/A"
                          : new Date(
                            selectedVendor.lastDelivery
                          ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Services & Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {selectedVendor.category === "Transportation" && (
                      <>
                        <Badge variant="secondary">Full Truckload</Badge>
                        <Badge variant="secondary">Less-than-truckload</Badge>
                      </>
                    )}
                    {selectedVendor.category === "Maritime" && (
                      <>
                        <Badge variant="secondary">Container Shipping</Badge>
                        <Badge variant="secondary">Bulk ARDB</Badge>
                      </>
                    )}
                    {selectedVendor.category === "Air Freight" && (
                      <>
                        <Badge variant="secondary">Express Air</Badge>
                        <Badge variant="secondary">Charter Services</Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <Textarea
                    placeholder="Add notes about this vendor..."
                    className="min-h-[100px]"
                    defaultValue={
                      selectedVendor.rating > 4.5
                        ? "Preferred vendor for high-priority shipments. Consistently delivers excellent service."
                        : selectedVendor.rating < 4.0
                          ? "Performance has been inconsistent. Monitoring for improvement."
                          : "Reliable vendor with good track record."
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                Close
              </Button>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button onClick={() => handleViewContract(selectedVendor)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Documents
                </Button>
                <Button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleEditVendor(selectedVendor);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedVendor && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the vendor "{selectedVendor.name}"
                and remove all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Add New Vendor Dialog */}
      <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Enter the details for the new vendor
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vendor Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter vendor name"
                  value={newVendor.name}
                  onChange={handleNewVendorChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newVendor.category}
                  onValueChange={(value) =>
                    handleNewVendorSelectChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                    <SelectItem value="Maritime">Maritime</SelectItem>
                    <SelectItem value="Air Freight">Air Freight</SelectItem>
                    <SelectItem value="Rail Transport">
                      Rail Transport
                    </SelectItem>
                    <SelectItem value="Trucking">Trucking</SelectItem>
                    <SelectItem value="Warehousing">Warehousing</SelectItem>
                    <SelectItem value="Customs Broker">
                      Customs Broker
                    </SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newVendor.status}
                  onValueChange={(value) =>
                    handleNewVendorSelectChange("status", value)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "International",
                    "Domestic",
                    "Premium",
                    "Express",
                    "Certified",
                    "Eco-friendly",
                  ].map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        newVendor.tags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleNewVendorTagToggle(tag)}
                    >
                      {tag}
                      {newVendor.tags.includes(tag) ? (
                        <X className="ml-1 h-3 w-3" />
                      ) : (
                        <Check className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  value={newVendor.contactPerson}
                  onChange={handleNewVendorChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newVendor.email}
                  onChange={handleNewVendorChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={newVendor.phone}
                  onChange={handleNewVendorChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location"
                  value={newVendor.location}
                  onChange={handleNewVendorChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Upload Documents</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleFileUploadClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <span className="text-sm text-muted-foreground">
                No files selected
              </span>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewVendor}>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      {editVendor && (
        <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] h-max overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
              <DialogDescription>
                Update the details for {editVendor.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Vendor Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="Enter vendor name"
                    value={editVendor.name}
                    onChange={handleEditVendorChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editVendor.category}
                    onValueChange={(value) =>
                      handleEditVendorSelectChange("category", value)
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                      <SelectItem value="Maritime">Maritime</SelectItem>
                      <SelectItem value="Air Freight">Air Freight</SelectItem>
                      <SelectItem value="Rail Transport">
                        Rail Transport
                      </SelectItem>
                      <SelectItem value="Trucking">Trucking</SelectItem>
                      <SelectItem value="Warehousing">Warehousing</SelectItem>
                      <SelectItem value="Customs Broker">
                        Customs Broker
                      </SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editVendor.status}
                    onValueChange={(value) =>
                      handleEditVendorSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "International",
                      "Domestic",
                      "Premium",
                      "Express",
                      "Certified",
                      "Eco-friendly",
                    ].map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          editVendor.tags.includes(tag) ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleEditVendorTagToggle(tag)}
                      >
                        {tag}
                        {editVendor.tags.includes(tag) ? (
                          <X className="ml-1 h-3 w-3" />
                        ) : (
                          <Check className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                  <Input
                    id="edit-contactPerson"
                    name="contactPerson"
                    placeholder="Enter contact person name"
                    value={editVendor.contactPerson}
                    onChange={handleEditVendorChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={editVendor.email}
                    onChange={handleEditVendorChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={editVendor.phone}
                    onChange={handleEditVendorChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    placeholder="Enter location"
                    value={editVendor.location}
                    onChange={handleEditVendorChange}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Documents</Label>
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Contract-{editVendor.id}.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleFileUploadClick}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditVendorOpen(false)}
              >
                <MyCancel />
              </Button>
              <Button onClick={handleSubmitEditVendor}>
                <MySave />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contract View Dialog */}
      {selectedVendor && (
        <Dialog open={isContractViewOpen} onOpenChange={setIsContractViewOpen}>
          <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contract Documents</DialogTitle>
              <DialogDescription>
                Viewing contract documents for {selectedVendor.name} (ID:{" "}
                {selectedVendor.id})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="rounded-lg border">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Master Service Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        Contract-{selectedVendor.id}-MSA.pdf
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Service Level Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        Contract-{selectedVendor.id}-SLA.pdf
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Rate Card</h4>
                      <p className="text-sm text-muted-foreground">
                        Contract-{selectedVendor.id}-Rates.xlsx
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Contract Preview</h3>
                <div className=" w-full rounded-lg bg-muted p-4">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <div className="text-center">
                      <h4 className="font-medium">Master Service Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        Select a document to preview
                      </p>
                    </div>
                    <Button>
                      <Eye className="mr-2 h-4 w-4" />
                      Open Full Preview
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleFileUploadClick}>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach New Document
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsContractViewOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Mail icon component
function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
