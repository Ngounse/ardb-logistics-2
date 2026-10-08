"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Users,
  UserPlus,
  Car,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  CalendarIcon,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Route,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Award,
  FileText,
  MessageSquare,
  ChevronDown,
  Printer,
} from "lucide-react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import user1 from "@/public/user11.png";
import user2 from "@/public/user2.png";
import user3 from "@/public/user3.png";
import user4 from "@/public/user4.png";
import user5 from "@/public/user5.png";
import Link from "next/link";
import { PersonT } from "../../person/person";
import api from '@/lib/axios';


// Mock data for drivers
// const driversData = [
//   {
//     id: "DRV001",
//     name: "John Smith",
//     email: "john.smith@ardb.com",
//     phone: "+1 (555) 123-4567",
//     avatar: user1,
//     status: "Available",
//     currentVehicle: "TRK-001",
//     currentRoute: "Route A-12",
//     location: "Los Angeles, CA",
//     rating: 4.8,
//     totalDeliveries: 1247,
//     onTimeRate: 96.5,
//     licenseExpiry: "2025-08-15",
//     joinDate: "2022-03-15",
//     experience: "8 years",
//     specializations: ["Hazmat", "Refrigerated"],
//     lastActive: "2 hours ago",
//     weeklyHours: 42,
//     monthlyEarnings: 4850,
//   },
//   {
//     id: "DRV002",
//     name: "Sarah Johnson",
//     email: "sarah.johnson@ardb.com",
//     phone: "+1 (555) 234-5678",
//     avatar: user2,
//     status: "On Route",
//     currentVehicle: "TRK-005",
//     currentRoute: "Route B-08",
//     location: "Phoenix, AZ",
//     rating: 4.9,
//     totalDeliveries: 892,
//     onTimeRate: 98.2,
//     licenseExpiry: "2024-12-20",
//     joinDate: "2021-07-22",
//     experience: "12 years",
//     specializations: ["Long Distance", "Heavy Load"],
//     lastActive: "Active now",
//     weeklyHours: 38,
//     monthlyEarnings: 5200,
//   },
//   {
//     id: "DRV003",
//     name: "Mike Davis",
//     email: "mike.davis@ardb.com",
//     phone: "+1 (555) 345-6789",
//     avatar: user3,
//     status: "Off Duty",
//     currentVehicle: "TRK-012",
//     currentRoute: "None",
//     location: "Denver, CO",
//     rating: 4.6,
//     totalDeliveries: 1456,
//     onTimeRate: 94.8,
//     licenseExpiry: "2025-03-10",
//     joinDate: "2020-11-08",
//     experience: "15 years",
//     specializations: ["Local Delivery", "Express"],
//     lastActive: "6 hours ago",
//     weeklyHours: 40,
//     monthlyEarnings: 4650,
//   },
//   {
//     id: "DRV004",
//     name: "Emily Chen",
//     email: "emily.chen@ardb.com",
//     phone: "+1 (555) 456-7890",
//     avatar: user4,
//     status: "Available",
//     currentVehicle: "TRK-018",
//     currentRoute: "Route C-15",
//     location: "Seattle, WA",
//     rating: 4.7,
//     totalDeliveries: 734,
//     onTimeRate: 97.1,
//     licenseExpiry: "2024-09-30",
//     joinDate: "2023-01-12",
//     experience: "5 years",
//     specializations: ["Urban Delivery", "Eco-Friendly"],
//     lastActive: "1 hour ago",
//     weeklyHours: 36,
//     monthlyEarnings: 4200,
//   },
//   {
//     id: "DRV005",
//     name: "Robert Wilson",
//     email: "robert.wilson@ardb.com",
//     phone: "+1 (555) 567-8901",
//     avatar: user5,
//     status: "Maintenance",
//     currentVehicle: "TRK-023",
//     currentRoute: "None",
//     location: "Houston, TX",
//     rating: 4.5,
//     totalDeliveries: 2103,
//     onTimeRate: 93.7,
//     licenseExpiry: "2025-06-18",
//     joinDate: "2019-05-20",
//     experience: "20 years",
//     specializations: ["Heavy Machinery", "Interstate"],
//     lastActive: "4 hours ago",
//     weeklyHours: 44,
//     monthlyEarnings: 5500,
//   },
// ];

const vehiclesData = [
  { id: "TRK-001", model: "Freightliner Cascadia", status: "Active" },
  { id: "TRK-005", model: "Volvo VNL", status: "Active" },
  { id: "TRK-012", model: "Peterbilt 579", status: "Active" },
  { id: "TRK-018", model: "Kenworth T680", status: "Active" },
  { id: "TRK-023", model: "Mack Anthem", status: "Maintenance" },
  { id: "TRK-030", model: "International LT", status: "Available" },
  { id: "TRK-035", model: "Western Star 5700", status: "Available" },
];

const routesData = [
  {
    id: "Route A-12",
    name: "LA to Phoenix",
    distance: "372 miles",
    duration: "6h 30m",
  },
  {
    id: "Route B-08",
    name: "Phoenix to Denver",
    distance: "602 miles",
    duration: "9h 15m",
  },
  {
    id: "Route C-15",
    name: "Seattle to Portland",
    distance: "173 miles",
    duration: "3h 10m",
  },
  {
    id: "Route D-22",
    name: "Houston to Dallas",
    distance: "239 miles",
    duration: "4h 20m",
  },
  {
    id: "Route E-07",
    name: "Chicago to Detroit",
    distance: "282 miles",
    duration: "4h 45m",
  },
];

export default function DriverAssignmentsPage() {
  const url = 'person-service/api/v1/driver';

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);
  const [isDriverDetailsOpen, setIsDriverDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [assignmentDate, setAssignmentDate] = useState<Date | undefined>();
  const [driversData, setDriversData] = useState<DriverT[]>([]);

  // Helper function to format dates safely
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDriver = () => {
    api.get(url).then((res) => {
      // setDriversData(res.data.results);
    });
  }

  useEffect(() => {
    getDriver();
  }, []);

  const filteredDrivers = driversData.filter((driver) => {
    const matchesSearch =
      driver.person?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.person?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      driver.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:text-white";
      case "On Route":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:text-white";
      case "Off Duty":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:text-white";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:text-white";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 hover:text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle className="h-4 w-4" />;
      case "On Route":
        return <Activity className="h-4 w-4" />;
      case "Off Duty":
        return <XCircle className="h-4 w-4" />;
      case "Maintenance":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-2xl font-bold tracking-tight">
            Driver Assignments
          </h1>
          <p className="text-muted-foreground">
            Manage driver assignments, schedules, and performance tracking
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
          <Dialog
            open={isAddDriverDialogOpen}
            onOpenChange={setIsAddDriverDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter the driver's information to add them to the fleet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 px-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Smith" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@ardb.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" placeholder="DL123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input id="experience" type="number" placeholder="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <Input
                    id="specializations"
                    placeholder="Hazmat, Long Distance, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Driver</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driversData.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Drivers
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driversData.filter((d) => d.status === "Available").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Route</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driversData.filter((d) => d.status === "On Route").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently driving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <Star className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {(
                driversData.reduce((acc, d) => acc + d.rating, 0) /
                driversData.length
              ).toFixed(1)} */}
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList className="flex-wrap h-full justify-start">
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>
                View and manage all drivers in your fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap justify-between gap-2 w-full">
                  <div className="relative min-w-[250px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="on-route">On Route</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drivers List */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <Image
                          src={driver.person?.photo || "/placeholder.svg"}
                          alt={driver.person?.firstName + " " + driver.person?.lastName}
                        />
                        <AvatarFallback>
                          {driver.person?.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{driver.person?.firstName} {driver.person?.lastName}</CardTitle>
                        <CardDescription>{driver.id}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsDriverDetailsOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          <Route className="mr-2 h-4 w-4" />
                          Assign Route
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Driver
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Driver
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(driver.status)}>
                      {getStatusIcon(driver.status)}
                      <span className="ml-1">{driver.status}</span>
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {/* {driver.person?.rating} */}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.licenseNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {/* <span>{driver.person?.location}</span> */}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {/* <span>{driver.lastActive}</span> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Deliveries:</span>
                      <div className="font-medium">
                        {driver.drivingExperience} years
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">On-time:</span>
                      {/* <div className="font-medium">{driver.onTimeRate}%</div> */}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsAssignDialogOpen(true);
                      }}
                    >
                      <Route className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsDriverDetailsOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
              <CardDescription>
                View and manage current driver-vehicle-route assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 whitespace-nowrap overflow-x-auto">
                {driversData
                  .filter(
                    (d) => d.status === "On Route" || d.status === "Available"
                  )
                  .map((driver) => (
                    <div
                      key={driver.id}
                      className="flex flex-wrap gap-2 items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <Image
                            src={driver.person?.photo || "/placeholder.svg"}
                            alt={driver.person?.firstName + " " + driver.person?.lastName}
                          />
                          <AvatarFallback>
                            {driver.person?.firstName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{driver.person?.firstName} {driver.person?.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            {driver.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {/* {driver.currentVehicle} */}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vehicle
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {/* {driver.currentRoute} */}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Route
                          </div>
                        </div>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          Reassign
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {driversData.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <Image
                        src={driver.person?.photo || "/placeholder.svg"}
                        alt={driver.person?.firstName + " " + driver.person?.lastName}
                      />
                      <AvatarFallback>
                        {driver.person?.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{driver.person?.firstName} {driver.person?.lastName}</CardTitle>
                      <CardDescription>
                        {driver.drivingExperience} years experience
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {/* {driver.onTimeRate}% */}
                      </div>
                      <div className="text-muted-foreground">On-time Rate</div>
                    </div>
                    <div className="text-center">
                      {/* <div className="text-2xl font-bold">{driver.rating}</div> */}
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Deliveries</span>
                      <span className="font-medium">
                        {/* {driver.totalDeliveries} */}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weekly Hours</span>
                      {/* <span className="font-medium">{driver.weeklyHours}h</span> */}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Earnings</span>
                      <span className="font-medium">
                        {/* ${driver.monthlyEarnings} */}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Link
                        href="/admin/reports/delivery"
                        className="flex gap-1 items-center"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Report
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Award className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Assign {selectedDriver?.name} to a vehicle and route.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehiclesData
                    .filter((v) => v.status === "Available")
                    .map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.id} - {vehicle.model}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {routesData.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.id} - {route.name} ({route.distance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !assignmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {assignmentDate ? (
                      formatDate(assignmentDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={assignmentDate}
                    onSelect={setAssignmentDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes for this assignment..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Assign Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver Details Dialog */}
      <Dialog open={isDriverDetailsOpen} onOpenChange={setIsDriverDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about {selectedDriver?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <Image
                    src={selectedDriver.avatar || "/placeholder.svg"}
                    alt={selectedDriver.name}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedDriver.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedDriver.name}
                  </h3>
                  <p className="text-muted-foreground">{selectedDriver.id}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(selectedDriver.status)}>
                      {selectedDriver.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {selectedDriver.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap h-full justify-start sm:w-max">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Contact Information
                        </Label>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDriver.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDriver.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Current Assignment
                        </Label>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDriver.currentVehicle}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Route className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDriver.currentRoute}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDriver.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Professional Details
                        </Label>
                        <div className="mt-1 space-y-1 text-sm">
                          <div>Experience: {selectedDriver.experience}</div>
                          <div>Join Date: {selectedDriver.joinDate}</div>
                          <div>
                            License Expiry: {selectedDriver.licenseExpiry}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Specializations
                        </Label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedDriver.specializations.map(
                            (spec: string) => (
                              <Badge
                                key={spec}
                                variant="secondary"
                                className="text-xs"
                              >
                                {spec}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedDriver.onTimeRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            On-time Rate
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {selectedDriver.totalDeliveries}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Deliveries
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            ${selectedDriver.monthlyEarnings}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Monthly Earnings
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Driver's License</div>
                          <div className="text-sm text-muted-foreground">
                            Expires: {selectedDriver.licenseExpiry}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Medical Certificate</div>
                          <div className="text-sm text-muted-foreground">
                            Valid until: 2024-12-31
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Route A-12 Completed
                          </div>
                          <div className="text-sm text-muted-foreground">
                            2 hours ago
                          </div>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div>
                          <div className="font-medium">Assigned to TRK-001</div>
                          <div className="text-sm text-muted-foreground">
                            1 day ago
                          </div>
                        </div>
                        <Badge variant="outline">Assignment</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface DriverT {
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  id: string
  person?: PersonT
  employeeCode: string
  status: string
  driverType: string
  licenseNumber: string
  licenseType: string
  licenseIssueDate: string
  licenseExpiryDate: string
  drivingExperience: number
  accidentCount: number
  violationCount: number
}