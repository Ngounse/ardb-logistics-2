"use client";
import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Truck,
  Wrench,
  X,
  Edit,
  Upload,
  Save,
  ChevronDown,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  DialogTrigger,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { MySave } from "@/components/myFunction";


// Mock data for maintenance logs
const maintenanceData = [
  {
    id: "MNT-001",
    vehicleId: "TRK-001",
    vehicleMake: "Volvo",
    vehicleModel: "FH16",
    serviceType: "Preventive",
    category: "Engine",
    description: "Oil change and filter replacement",
    status: "Completed",
    priority: "Medium",
    scheduledDate: "2024-01-15",
    completedDate: "2024-01-15",
    provider: "AutoCare Services",
    technician: "Mike Johnson",
    cost: 450.0,
    mileage: 125000,
    nextService: "2024-04-15",
    notes:
      "Regular maintenance completed as scheduled. All fluids and filters replaced according to manufacturer specifications.",
    documents: [
      {
        name: "Invoice-MNT001.pdf",
        type: "invoice",
        size: "156 KB",
        date: "2024-01-15",
      },
      {
        name: "Service-Report-MNT001.pdf",
        type: "report",
        size: "320 KB",
        date: "2024-01-15",
      },
    ],
    parts: [
      { name: "Oil Filter", quantity: 1, cost: 45.0 },
      { name: "Engine Oil", quantity: 8, unit: "liters", cost: 240.0 },
      { name: "Air Filter", quantity: 1, cost: 65.0 },
    ],
    labor: { hours: 2.5, rate: 40.0, cost: 100.0 },
  },
  {
    id: "MNT-002",
    vehicleId: "TRK-002",
    vehicleMake: "Mercedes",
    vehicleModel: "Actros",
    serviceType: "Corrective",
    category: "Brakes",
    description: "Brake pad replacement - front axle",
    status: "In Progress",
    priority: "High",
    scheduledDate: "2024-01-20",
    completedDate: null,
    provider: "BrakeMaster Pro",
    technician: "Sarah Wilson",
    cost: 850.0,
    mileage: 98000,
    nextService: null,
    notes:
      "Front brake pads worn beyond safety limits. Replacing pads and inspecting rotors for damage.",
    documents: [
      {
        name: "Work-Order-MNT002.pdf",
        type: "work order",
        size: "125 KB",
        date: "2024-01-20",
      },
    ],
    parts: [
      { name: "Brake Pads (Front)", quantity: 2, cost: 320.0 },
      { name: "Brake Fluid", quantity: 1, unit: "bottle", cost: 45.0 },
    ],
    labor: { hours: 3.0, rate: 45.0, cost: 135.0 },
  },
  {
    id: "MNT-003",
    vehicleId: "TRK-003",
    vehicleMake: "Scania",
    vehicleModel: "R450",
    serviceType: "Emergency",
    category: "Transmission",
    description: "Transmission fluid leak repair",
    status: "Scheduled",
    priority: "Critical",
    scheduledDate: "2024-01-25",
    completedDate: null,
    provider: "TransFix Solutions",
    technician: "David Brown",
    cost: 1200.0,
    mileage: 156000,
    nextService: null,
    notes:
      "Transmission fluid leak detected during routine inspection. Requires immediate attention to prevent transmission damage.",
    documents: [
      {
        name: "Inspection-Report-MNT003.pdf",
        type: "report",
        size: "210 KB",
        date: "2024-01-18",
      },
    ],
    parts: [
      { name: "Transmission Gasket", quantity: 1, cost: 180.0 },
      { name: "Transmission Fluid", quantity: 12, unit: "liters", cost: 360.0 },
    ],
    labor: { hours: 5.0, rate: 50.0, cost: 250.0 },
  },
  {
    id: "MNT-004",
    vehicleId: "TRK-004",
    vehicleMake: "MAN",
    vehicleModel: "TGX",
    serviceType: "Inspection",
    category: "Safety",
    description: "Annual safety inspection",
    status: "Overdue",
    priority: "High",
    scheduledDate: "2024-01-10",
    completedDate: null,
    provider: "SafeCheck Inspections",
    technician: "Lisa Garcia",
    cost: 300.0,
    mileage: 89000,
    nextService: null,
    notes:
      "Annual safety inspection required for regulatory compliance. Vehicle cannot operate commercially without valid inspection certificate.",
    documents: [
      {
        name: "Previous-Inspection-MNT004.pdf",
        type: "certificate",
        size: "180 KB",
        date: "2023-01-10",
      },
    ],
    parts: [],
    labor: { hours: 2.0, rate: 45.0, cost: 90.0 },
  },
  {
    id: "MNT-005",
    vehicleId: "TRK-005",
    vehicleMake: "Iveco",
    vehicleModel: "Stralis",
    serviceType: "Preventive",
    category: "Tires",
    description: "Tire rotation and alignment",
    status: "Completed",
    priority: "Low",
    scheduledDate: "2024-01-12",
    completedDate: "2024-01-12",
    provider: "TirePro Services",
    technician: "Robert Lee",
    cost: 280.0,
    mileage: 67000,
    nextService: "2024-07-12",
    notes:
      "Regular tire rotation and alignment to ensure even wear and optimal fuel efficiency. All tires in good condition.",
    documents: [
      {
        name: "Invoice-MNT005.pdf",
        type: "invoice",
        size: "145 KB",
        date: "2024-01-12",
      },
      {
        name: "Alignment-Report-MNT005.pdf",
        type: "report",
        size: "230 KB",
        date: "2024-01-12",
      },
    ],
    parts: [],
    labor: { hours: 1.5, rate: 40.0, cost: 60.0 },
  },
  {
    id: "MNT-006",
    vehicleId: "TRK-006",
    vehicleMake: "DAF",
    vehicleModel: "XF",
    serviceType: "Corrective",
    category: "Electrical",
    description: "Alternator replacement",
    status: "Scheduled",
    priority: "Medium",
    scheduledDate: "2024-01-28",
    completedDate: null,
    provider: "ElectroFix Auto",
    technician: "Jennifer Kim",
    cost: 650.0,
    mileage: 112000,
    nextService: null,
    notes:
      "Alternator showing signs of failure during diagnostic test. Scheduled for replacement to prevent breakdown.",
    documents: [
      {
        name: "Diagnostic-Report-MNT006.pdf",
        type: "report",
        size: "195 KB",
        date: "2024-01-15",
      },
    ],
    parts: [
      { name: "Alternator", quantity: 1, cost: 420.0 },
      { name: "Drive Belt", quantity: 1, cost: 35.0 },
    ],
    labor: { hours: 2.5, rate: 45.0, cost: 112.5 },
  },
];

const statusColors = {
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "In Progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Scheduled:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const priorityColors = {
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

// Mock data for vehicles
const vehicles = [
  { id: "TRK-001", name: "Volvo FH16", plate: "ABC-1234" },
  { id: "TRK-002", name: "Mercedes Actros", plate: "DEF-5678" },
  { id: "TRK-003", name: "Scania R450", plate: "GHI-9012" },
  { id: "TRK-004", name: "MAN TGX", plate: "JKL-3456" },
  { id: "TRK-005", name: "Iveco Stralis", plate: "MNO-7890" },
  { id: "TRK-006", name: "DAF XF", plate: "PQR-1234" },
];

// Mock data for service providers
const serviceProviders = [
  { id: "SP-001", name: "AutoCare Services" },
  { id: "SP-002", name: "BrakeMaster Pro" },
  { id: "SP-003", name: "TransFix Solutions" },
  { id: "SP-004", name: "SafeCheck Inspections" },
  { id: "SP-005", name: "TirePro Services" },
  { id: "SP-006", name: "ElectroFix Auto" },
];

// Mock data for service categories
const serviceCategories = [
  "Engine",
  "Brakes",
  "Transmission",
  "Electrical",
  "Suspension",
  "Tires",
  "Safety",
  "Body",
  "HVAC",
  "Fuel System",
];

// Mock data for service types
const serviceTypes = ["Preventive", "Corrective", "Emergency", "Inspection"];

// Mock data for priorities
const priorities = ["Critical", "High", "Medium", "Low"];

export default function MaintenanceLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // State for new maintenance record
  const [newMaintenance, setNewMaintenance] = useState({
    vehicleId: "",
    serviceType: "",
    category: "",
    description: "",
    priority: "",
    scheduledDate: "",
    provider: "",
    technician: "",
    estimatedCost: "",
    notes: "",
  });

  // State for selected record (for details view)
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRecord, setEditedRecord] = useState<any>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRecords = maintenanceData.length;
    const completedRecords = maintenanceData.filter(
      (record) => record.status === "Completed"
    ).length;
    const overdueRecords = maintenanceData.filter(
      (record) => record.status === "Overdue"
    ).length;
    const totalCost = maintenanceData.reduce(
      (sum, record) => sum + record.cost,
      0
    );
    const completionRate =
      totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0;

    return {
      totalRecords,
      completionRate,
      totalCost,
      overdueRecords,
    };
  }, []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return maintenanceData.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.technician.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;
      const matchesServiceType =
        serviceTypeFilter === "all" || record.serviceType === serviceTypeFilter;
      const matchesCategory =
        categoryFilter === "all" || record.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "all" || record.priority === priorityFilter;
      const matchesProvider =
        providerFilter === "all" || record.provider === providerFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesServiceType &&
        matchesCategory &&
        matchesPriority &&
        matchesProvider
      );
    });
  }, [
    searchTerm,
    statusFilter,
    serviceTypeFilter,
    categoryFilter,
    priorityFilter,
    providerFilter,
  ]);

  // Get unique values for filters
  const uniqueServiceTypes = [
    ...new Set(maintenanceData.map((record) => record.serviceType)),
  ];
  const uniqueCategories = [
    ...new Set(maintenanceData.map((record) => record.category)),
  ];
  const uniqueProviders = [
    ...new Set(maintenanceData.map((record) => record.provider)),
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(filteredData.map((record) => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId]);
    } else {
      setSelectedRecords(selectedRecords.filter((id) => id !== recordId));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceTypeFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setProviderFilter("all");
  };

  const activeFiltersCount = [
    statusFilter,
    serviceTypeFilter,
    categoryFilter,
    priorityFilter,
    providerFilter,
  ].filter((filter) => filter !== "all").length;

  // Handle new maintenance form input
  const handleNewMaintenanceInput = (field: string, value: string) => {
    setNewMaintenance({
      ...newMaintenance,
      [field]: value,
    });
  };

  // Handle form submission for new maintenance
  const handleSubmitNewMaintenance = () => {
    // In a real app, this would send data to the server
    console.log("New maintenance record:", newMaintenance);

    // Reset form
    setNewMaintenance({
      vehicleId: "",
      serviceType: "",
      category: "",
      description: "",
      priority: "",
      scheduledDate: "",
      provider: "",
      technician: "",
      estimatedCost: "",
      notes: "",
    });
  };

  // Get record by ID
  const getRecordById = (id: string) => {
    return maintenanceData.find((record) => record.id === id) || null;
  };

  // Handle edit record
  const handleEditRecord = (record: any) => {
    setIsEditMode(true);
    setEditedRecord({ ...record });
  };

  // Handle save edited record
  const handleSaveEditedRecord = () => {
    // In a real app, this would update the record in the database
    console.log("Saving edited record:", editedRecord);
    setIsEditMode(false);
    setEditedRecord(null);
  };

  // Handle schedule follow-up
  const handleScheduleFollowUp = (record: any) => {
    // Pre-fill the new maintenance form with data from the selected record
    setNewMaintenance({
      vehicleId: record.vehicleId,
      serviceType: "Preventive",
      category: record.category,
      description: `Follow-up to ${record.id}: ${record.description}`,
      priority: "Medium",
      scheduledDate: "",
      provider: record.provider,
      technician: record.technician,
      estimatedCost: "",
      notes: `Follow-up maintenance for previous service (${record.id})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Maintenance Logs
          </h1>
          <p className="text-muted-foreground">
            Track and manage all vehicle maintenance records and schedules
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] h-max overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Maintenance</DialogTitle>
                <DialogDescription>
                  Create a new maintenance record for a vehicle. Fill in all the
                  required information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle</Label>
                    <Select
                      value={newMaintenance.vehicleId}
                      onValueChange={(value) =>
                        handleNewMaintenanceInput("vehicleId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} ({vehicle.plate})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select
                      value={newMaintenance.serviceType}
                      onValueChange={(value) =>
                        handleNewMaintenanceInput("serviceType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newMaintenance.category}
                      onValueChange={(value) =>
                        handleNewMaintenanceInput("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newMaintenance.priority}
                      onValueChange={(value) =>
                        handleNewMaintenanceInput("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the maintenance work needed..."
                    value={newMaintenance.description}
                    onChange={(e) =>
                      handleNewMaintenanceInput("description", e.target.value)
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Service Provider</Label>
                    <Select
                      value={newMaintenance.provider}
                      onValueChange={(value) =>
                        handleNewMaintenanceInput("provider", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.name}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-date">Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              handleNewMaintenanceInput(
                                "scheduledDate",
                                format(date, "yyyy-MM-dd")
                              );
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technician">Technician</Label>
                    <Input
                      id="technician"
                      placeholder="Technician name"
                      value={newMaintenance.technician}
                      onChange={(e) =>
                        handleNewMaintenanceInput("technician", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                    <Input
                      id="estimated-cost"
                      placeholder="0.00"
                      type="number"
                      value={newMaintenance.estimatedCost}
                      onChange={(e) =>
                        handleNewMaintenanceInput(
                          "estimatedCost",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information..."
                    value={newMaintenance.notes}
                    onChange={(e) =>
                      handleNewMaintenanceInput("notes", e.target.value)
                    }
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmitNewMaintenance}>
                  Schedule Maintenance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance records tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completionRate.toFixed(1)}%
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalCost.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Average: ${(stats.totalCost / stats.totalRecords).toFixed(0)} per
              service
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdueRecords}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
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
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, description, provider, or technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "table" ? "cards" : "table")
                }
              >
                {viewMode === "table" ? (
                  <Grid3X3 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={serviceTypeFilter}
              onValueChange={setServiceTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueServiceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {uniqueProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setStatusFilter("all")}
                  />
                </Badge>
              )}
              {serviceTypeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {serviceTypeFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setServiceTypeFilter("all")}
                  />
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categoryFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setCategoryFilter("all")}
                  />
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {priorityFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setPriorityFilter("all")}
                  />
                </Badge>
              )}
              {providerFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Provider: {providerFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setProviderFilter("all")}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedRecords.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedRecords.length} record(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap gap-2 items-center justify-between">
            <span>Maintenance Records ({filteredData.length})</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "table" ? "cards" : "table")
                }
              >
                {viewMode === "table" ? (
                  <>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Card View
                  </>
                ) : (
                  <>
                    <List className="mr-2 h-4 w-4" />
                    Table View
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedRecords.length === filteredData.length &&
                          filteredData.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Service ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRecord(record.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {record.vehicleId}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.vehicleMake} {record.vehicleModel}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.serviceType}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[
                            record.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            priorityColors[
                            record.priority as keyof typeof priorityColors
                            ]
                          }
                        >
                          {record.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.provider}</div>
                          <div className="text-sm text-muted-foreground">
                            {record.technician}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${record.cost.toFixed(2)}</TableCell>
                      <TableCell>{record.scheduledDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Maintenance Record Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete information for maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="details">
                                  <TabsList className="flex flex-wrap gap-2 justify-start h-max ">
                                    <TabsTrigger value="details">
                                      Details
                                    </TabsTrigger>
                                    <TabsTrigger value="documents">
                                      Documents
                                    </TabsTrigger>
                                    <TabsTrigger value="notes">
                                      Notes
                                    </TabsTrigger>
                                  </TabsList>
                                  <TabsContent
                                    value="details"
                                    className="space-y-4 pt-4"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service ID
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.id}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Status
                                        </h4>
                                        <Badge
                                          className={
                                            statusColors[
                                            record.status as keyof typeof statusColors
                                            ]
                                          }
                                        >
                                          {record.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Vehicle
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.vehicleMake}{" "}
                                          {record.vehicleModel} (
                                          {record.vehicleId})
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Mileage
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.mileage.toLocaleString()} km
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Description
                                      </h4>
                                      <p className="text-base">
                                        {record.description}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service Type
                                        </h4>
                                        <p className="text-base">
                                          {record.serviceType}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Category
                                        </h4>
                                        <p className="text-base">
                                          {record.category}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Priority
                                        </h4>
                                        <Badge
                                          className={
                                            priorityColors[
                                            record.priority as keyof typeof priorityColors
                                            ]
                                          }
                                        >
                                          {record.priority}
                                        </Badge>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Total Cost
                                        </h4>
                                        <p className="text-base font-medium">
                                          ${record.cost.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Scheduled Date
                                        </h4>
                                        <p className="text-base">
                                          {record.scheduledDate}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Completed Date
                                        </h4>
                                        <p className="text-base">
                                          {record.completedDate ||
                                            "Not completed"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service Provider
                                        </h4>
                                        <p className="text-base">
                                          {record.provider}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Technician
                                        </h4>
                                        <p className="text-base">
                                          {record.technician}
                                        </p>
                                      </div>
                                    </div>
                                    {record.nextService && (
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Next Service Due
                                        </h4>
                                        <p className="text-base">
                                          {record.nextService}
                                        </p>
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent
                                    value="documents"
                                    className="space-y-4 pt-4"
                                  >
                                    {record.documents &&
                                      record.documents.length > 0 ? (
                                      <div className="space-y-4">
                                        {record.documents.map(
                                          (doc: any, index: number) => (
                                            <div
                                              key={index}
                                              className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-3"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                  <p className="font-medium">
                                                    {doc.name}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {doc.type} • {doc.size} •{" "}
                                                    {doc.date}
                                                  </p>
                                                </div>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                              </Button>
                                            </div>
                                          )
                                        )}

                                        <div className="mt-4">
                                          <Button
                                            variant="outline"
                                            className="w-full"
                                          >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload New Document
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                          No documents available
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                          Upload maintenance documents for this
                                          record
                                        </p>
                                        <Button variant="outline">
                                          <Upload className="mr-2 h-4 w-4" />
                                          Upload Document
                                        </Button>
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent
                                    value="notes"
                                    className="space-y-4 pt-4"
                                  >
                                    <div className="rounded-lg border p-4">
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Maintenance Notes
                                      </h4>
                                      <p className="text-base whitespace-pre-line">
                                        {record.notes || "No notes available"}
                                      </p>
                                    </div>

                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Add Note
                                      </h4>
                                      <Textarea
                                        placeholder="Add additional notes about this maintenance record..."
                                        className="min-h-[100px]"
                                      />
                                      <Button className="mt-2">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Note
                                      </Button>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Record
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Edit Maintenance Record
                                  </DialogTitle>
                                  <DialogDescription>
                                    Update information for maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select defaultValue={record.status}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Scheduled">
                                            Scheduled
                                          </SelectItem>
                                          <SelectItem value="In Progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="Completed">
                                            Completed
                                          </SelectItem>
                                          <SelectItem value="Overdue">
                                            Overdue
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select defaultValue={record.priority}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Low">
                                            Low
                                          </SelectItem>
                                          <SelectItem value="Medium">
                                            Medium
                                          </SelectItem>
                                          <SelectItem value="High">
                                            High
                                          </SelectItem>
                                          <SelectItem value="Critical">
                                            Critical
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      defaultValue={record.description}
                                    />
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Provider</Label>
                                      <Select defaultValue={record.provider}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceProviders.map((provider) => (
                                            <SelectItem
                                              key={provider.id}
                                              value={provider.name}
                                            >
                                              {provider.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Technician</Label>
                                      <Input defaultValue={record.technician} />
                                    </div>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Cost ($)</Label>
                                      <Input
                                        type="number"
                                        defaultValue={record.cost.toString()}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Mileage</Label>
                                      <Input
                                        type="number"
                                        defaultValue={record.mileage.toString()}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea defaultValue={record.notes} />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <MySave />
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Documents
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Maintenance Documents
                                  </DialogTitle>
                                  <DialogDescription>
                                    Documents related to maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {record.documents &&
                                    record.documents.length > 0 ? (
                                    record.documents.map(
                                      (doc: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex flex-wrap gap-3 items-center justify-between rounded-lg border p-3"
                                        >
                                          <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                              <p className="font-medium">
                                                {doc.name}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                {doc.type} • {doc.size} •{" "}
                                                {doc.date}
                                              </p>
                                            </div>
                                          </div>
                                          <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                          </Button>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                      <h3 className="text-lg font-semibold mb-2">
                                        No documents available
                                      </h3>
                                      <p className="text-muted-foreground mb-4">
                                        Upload maintenance documents for this
                                        record
                                      </p>
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Document
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <DropdownMenuSeparator />

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Follow-up
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Schedule Follow-up Maintenance
                                  </DialogTitle>
                                  <DialogDescription>
                                    Create a follow-up maintenance record for{" "}
                                    {record.vehicleMake} {record.vehicleModel} (
                                    {record.vehicleId})
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Type</Label>
                                      <Select defaultValue="Preventive">
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Category</Label>
                                      <Select defaultValue={record.category}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceCategories.map((category) => (
                                            <SelectItem
                                              key={category}
                                              value={category}
                                            >
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      defaultValue={`Follow-up to ${record.id}: ${record.description}`}
                                    />
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select defaultValue="Medium">
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {priorities.map((priority) => (
                                            <SelectItem
                                              key={priority}
                                              value={priority}
                                            >
                                              {priority}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Scheduled Date</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Select date
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarComponent
                                            mode="single"
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Provider</Label>
                                      <Select defaultValue={record.provider}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceProviders.map((provider) => (
                                            <SelectItem
                                              key={provider.id}
                                              value={provider.name}
                                            >
                                              {provider.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Estimated Cost ($)</Label>
                                      <Input type="number" placeholder="0.00" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                      defaultValue={`Follow-up maintenance for previous service (${record.id})`}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <Button>Schedule Follow-up</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredData.map((record) => (
                <Card key={record.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{record.id}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRecord(record.id, checked as boolean)
                          }
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Maintenance Record Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete information for maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="details">
                                  <TabsList className="flex flex-wrap gap-2 justify-start h-max ">
                                    <TabsTrigger value="details">
                                      Details
                                    </TabsTrigger>
                                    <TabsTrigger value="documents">
                                      Documents
                                    </TabsTrigger>
                                    <TabsTrigger value="notes">
                                      Notes
                                    </TabsTrigger>
                                  </TabsList>
                                  <TabsContent
                                    value="details"
                                    className="space-y-4 pt-4"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service ID
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.id}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Status
                                        </h4>
                                        <Badge
                                          className={
                                            statusColors[
                                            record.status as keyof typeof statusColors
                                            ]
                                          }
                                        >
                                          {record.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Vehicle
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.vehicleMake}{" "}
                                          {record.vehicleModel} (
                                          {record.vehicleId})
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Mileage
                                        </h4>
                                        <p className="text-base font-medium">
                                          {record.mileage.toLocaleString()} km
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Description
                                      </h4>
                                      <p className="text-base">
                                        {record.description}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service Type
                                        </h4>
                                        <p className="text-base">
                                          {record.serviceType}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Category
                                        </h4>
                                        <p className="text-base">
                                          {record.category}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Priority
                                        </h4>
                                        <Badge
                                          className={
                                            priorityColors[
                                            record.priority as keyof typeof priorityColors
                                            ]
                                          }
                                        >
                                          {record.priority}
                                        </Badge>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Total Cost
                                        </h4>
                                        <p className="text-base font-medium">
                                          ${record.cost.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Scheduled Date
                                        </h4>
                                        <p className="text-base">
                                          {record.scheduledDate}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Completed Date
                                        </h4>
                                        <p className="text-base">
                                          {record.completedDate ||
                                            "Not completed"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Service Provider
                                        </h4>
                                        <p className="text-base">
                                          {record.provider}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Technician
                                        </h4>
                                        <p className="text-base">
                                          {record.technician}
                                        </p>
                                      </div>
                                    </div>
                                    {record.nextService && (
                                      <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Next Service Due
                                        </h4>
                                        <p className="text-base">
                                          {record.nextService}
                                        </p>
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent
                                    value="documents"
                                    className="space-y-4 pt-4"
                                  >
                                    {record.documents &&
                                      record.documents.length > 0 ? (
                                      <div className="space-y-4">
                                        {record.documents.map(
                                          (doc: any, index: number) => (
                                            <div
                                              key={index}
                                              className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-3"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                  <p className="font-medium">
                                                    {doc.name}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {doc.type} • {doc.size} •{" "}
                                                    {doc.date}
                                                  </p>
                                                </div>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                              </Button>
                                            </div>
                                          )
                                        )}

                                        <div className="mt-4">
                                          <Button
                                            variant="outline"
                                            className="w-full"
                                          >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload New Document
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                          No documents available
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                          Upload maintenance documents for this
                                          record
                                        </p>
                                        <Button variant="outline">
                                          <Upload className="mr-2 h-4 w-4" />
                                          Upload Document
                                        </Button>
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent
                                    value="notes"
                                    className="space-y-4 pt-4"
                                  >
                                    <div className="rounded-lg border p-4">
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Maintenance Notes
                                      </h4>
                                      <p className="text-base whitespace-pre-line">
                                        {record.notes || "No notes available"}
                                      </p>
                                    </div>

                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Add Note
                                      </h4>
                                      <Textarea
                                        placeholder="Add additional notes about this maintenance record..."
                                        className="min-h-[100px]"
                                      />
                                      <Button className="mt-2">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Note
                                      </Button>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Record
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Edit Maintenance Record
                                  </DialogTitle>
                                  <DialogDescription>
                                    Update information for maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select defaultValue={record.status}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Scheduled">
                                            Scheduled
                                          </SelectItem>
                                          <SelectItem value="In Progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="Completed">
                                            Completed
                                          </SelectItem>
                                          <SelectItem value="Overdue">
                                            Overdue
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select defaultValue={record.priority}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Low">
                                            Low
                                          </SelectItem>
                                          <SelectItem value="Medium">
                                            Medium
                                          </SelectItem>
                                          <SelectItem value="High">
                                            High
                                          </SelectItem>
                                          <SelectItem value="Critical">
                                            Critical
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      defaultValue={record.description}
                                    />
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Provider</Label>
                                      <Select defaultValue={record.provider}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceProviders.map((provider) => (
                                            <SelectItem
                                              key={provider.id}
                                              value={provider.name}
                                            >
                                              {provider.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Technician</Label>
                                      <Input defaultValue={record.technician} />
                                    </div>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Cost ($)</Label>
                                      <Input
                                        type="number"
                                        defaultValue={record.cost.toString()}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Mileage</Label>
                                      <Input
                                        type="number"
                                        defaultValue={record.mileage.toString()}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea defaultValue={record.notes} />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <MySave />
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Documents
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Maintenance Documents
                                  </DialogTitle>
                                  <DialogDescription>
                                    Documents related to maintenance record{" "}
                                    {record.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {record.documents &&
                                    record.documents.length > 0 ? (
                                    record.documents.map(
                                      (doc: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex flex-wrap gap-3 items-center justify-between rounded-lg border p-3"
                                        >
                                          <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                              <p className="font-medium">
                                                {doc.name}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                {doc.type} • {doc.size} •{" "}
                                                {doc.date}
                                              </p>
                                            </div>
                                          </div>
                                          <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                          </Button>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                      <h3 className="text-lg font-semibold mb-2">
                                        No documents available
                                      </h3>
                                      <p className="text-muted-foreground mb-4">
                                        Upload maintenance documents for this
                                        record
                                      </p>
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Document
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <DropdownMenuSeparator />

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Follow-up
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] sm:h-max overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Schedule Follow-up Maintenance
                                  </DialogTitle>
                                  <DialogDescription>
                                    Create a follow-up maintenance record for{" "}
                                    {record.vehicleMake} {record.vehicleModel} (
                                    {record.vehicleId})
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Type</Label>
                                      <Select defaultValue="Preventive">
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Category</Label>
                                      <Select defaultValue={record.category}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceCategories.map((category) => (
                                            <SelectItem
                                              key={category}
                                              value={category}
                                            >
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      defaultValue={`Follow-up to ${record.id}: ${record.description}`}
                                    />
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select defaultValue="Medium">
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {priorities.map((priority) => (
                                            <SelectItem
                                              key={priority}
                                              value={priority}
                                            >
                                              {priority}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Scheduled Date</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Select date
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <CalendarComponent
                                            mode="single"
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Service Provider</Label>
                                      <Select defaultValue={record.provider}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {serviceProviders.map((provider) => (
                                            <SelectItem
                                              key={provider.id}
                                              value={provider.name}
                                            >
                                              {provider.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Estimated Cost ($)</Label>
                                      <Input type="number" placeholder="0.00" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                      defaultValue={`Follow-up maintenance for previous service (${record.id})`}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <Button>Schedule Follow-up</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {record.vehicleId} - {record.vehicleMake}{" "}
                      {record.vehicleModel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Service Type
                      </span>
                      <span className="text-sm font-medium">
                        {record.serviceType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>
                      <span className="text-sm font-medium">
                        {record.category}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Description
                      </span>
                      <p className="text-sm">{record.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        className={
                          statusColors[
                          record.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Priority
                      </span>
                      <Badge
                        className={
                          priorityColors[
                          record.priority as keyof typeof priorityColors
                          ]
                        }
                      >
                        {record.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Provider
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {record.provider}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.technician}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Cost
                      </span>
                      <span className="text-sm font-medium">
                        ${record.cost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Scheduled
                      </span>
                      <span className="text-sm font-medium">
                        {record.scheduledDate}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No maintenance records found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
