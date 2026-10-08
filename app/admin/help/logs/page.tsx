"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Download,
  Calendar,
  Shield,
  Database,
  Settings,
  Truck,
  Package,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Activity,
  ChevronDown,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import user from "@/public/user10.png";
import user2 from "@/public/user2.png";
import user3 from "@/public/user3.png";
import user4 from "@/public/user4.png";
import user5 from "@/public/user5.png";
import user6 from "@/public/user6.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock audit log data
const auditLogs = [
  {
    id: "LOG-001",
    timestamp: new Date("2024-01-15T10:30:00"),
    user: {
      id: "USR-001",
      name: "John Smith",
      email: "john.smith@ardb.com",
      avatar: user,
    },
    action: "LOGIN",
    category: "Authentication",
    resource: "User Account",
    resourceId: "USR-001",
    description: "User logged in successfully",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    severity: "INFO",
    details: {
      sessionId: "sess_abc123",
      location: "New York, NY",
      device: "Desktop - Chrome",
    },
  },
  {
    id: "LOG-002",
    timestamp: new Date("2024-01-15T10:25:00"),
    user: {
      id: "USR-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@ardb.com",
      avatar: user2,
    },
    action: "CREATE",
    category: "Shipments",
    resource: "Shipment",
    resourceId: "SHP-12345",
    description: "Created new shipment to Los Angeles",
    ipAddress: "192.168.1.101",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "SUCCESS",
    severity: "INFO",
    details: {
      destination: "Los Angeles, CA",
      weight: "2500 kg",
      value: "$15,000",
    },
  },
  {
    id: "LOG-003",
    timestamp: new Date("2024-01-15T10:20:00"),
    user: {
      id: "USR-003",
      name: "Mike Wilson",
      email: "mike.wilson@ardb.com",
      avatar: user3,
    },
    action: "UPDATE",
    category: "Fleet",
    resource: "Vehicle",
    resourceId: "VEH-789",
    description: "Updated vehicle maintenance schedule",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    severity: "INFO",
    details: {
      vehicleId: "VEH-789",
      maintenanceType: "Scheduled Service",
      nextService: "2024-02-15",
    },
  },
  {
    id: "LOG-004",
    timestamp: new Date("2024-01-15T10:15:00"),
    user: {
      id: "USR-004",
      name: "Lisa Chen",
      email: "lisa.chen@ardb.com",
      avatar: user4,
    },
    action: "DELETE",
    category: "Users",
    resource: "User Account",
    resourceId: "USR-999",
    description: "Deleted inactive user account",
    ipAddress: "192.168.1.103",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "SUCCESS",
    severity: "WARNING",
    details: {
      deletedUser: "inactive.user@ardb.com",
      reason: "Account inactive for 90+ days",
      dataRetention: "30 days",
    },
  },
  {
    id: "LOG-005",
    timestamp: new Date("2024-01-15T10:10:00"),
    user: {
      id: "USR-005",
      name: "David Brown",
      email: "david.brown@ardb.com",
      avatar: user5,
    },
    action: "FAILED_LOGIN",
    category: "Authentication",
    resource: "User Account",
    resourceId: "USR-005",
    description: "Failed login attempt - incorrect password",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "FAILED",
    severity: "WARNING",
    details: {
      attemptCount: 3,
      lockoutTime: "15 minutes",
      suspiciousActivity: true,
    },
  },
  {
    id: "LOG-006",
    timestamp: new Date("2024-01-15T10:05:00"),
    user: {
      id: "SYSTEM",
      name: "System",
      email: "system@ardb.com",
      avatar: user6,
    },
    action: "BACKUP",
    category: "System",
    resource: "Database",
    resourceId: "DB-MAIN",
    description: "Automated database backup completed",
    ipAddress: "127.0.0.1",
    userAgent: "ARDB-System/1.0",
    status: "SUCCESS",
    severity: "INFO",
    details: {
      backupSize: "2.5 GB",
      duration: "45 minutes",
      location: "AWS S3 Backup Bucket",
    },
  },
];

const categories = [
  { value: "all", label: "All Categories", icon: Activity },
  { value: "Authentication", label: "Authentication", icon: Shield },
  { value: "Shipments", label: "Shipments", icon: Package },
  { value: "Fleet", label: "Fleet", icon: Truck },
  { value: "Users", label: "Users", icon: Users },
  { value: "System", label: "System", icon: Database },
  { value: "Settings", label: "Settings", icon: Settings },
  { value: "Reports", label: "Reports", icon: FileText },
];

const severityColors = {
  INFO: "bg-blue-100 text-blue-800 border-blue-200",
  WARNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ERROR: "bg-red-100 text-red-800 border-red-200",
  CRITICAL: "bg-purple-100 text-purple-800 border-purple-200",
};

const statusIcons = {
  SUCCESS: CheckCircle,
  FAILED: XCircle,
  PENDING: Clock,
};

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLog, setSelectedLog] = useState<(typeof auditLogs)[0] | null>(
    null
  );

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || log.category === selectedCategory;
      const matchesSeverity =
        selectedSeverity === "all" || log.severity === selectedSeverity;
      const matchesStatus =
        selectedStatus === "all" || log.status === selectedStatus;

      return (
        matchesSearch && matchesCategory && matchesSeverity && matchesStatus
      );
    });
  }, [searchTerm, selectedCategory, selectedSeverity, selectedStatus]);

  // Group logs by date for timeline view
  const logsByDate = useMemo(() => {
    const grouped = filteredLogs.reduce((acc, log) => {
      const date = format(log.timestamp, "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, typeof auditLogs>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredLogs]);

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Clock;
    return Icon;
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData?.icon || Activity;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Audit Logs
          </h2>
          <p className="text-muted-foreground">
            Track all system activities and user actions
          </p>
        </div>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center">
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSeverity}
              onValueChange={setSelectedSeverity}
            >
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Entries</CardTitle>
              <CardDescription>
                {filteredLogs.length} of {auditLogs.length} log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const StatusIcon = getStatusIcon(log.status);
                    const CategoryIcon = getCategoryIcon(log.category);

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {format(log.timestamp, "MMM dd, HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <Image
                                src={log.user.avatar || "/placeholder.svg"}
                                alt="..."
                              />
                              <AvatarFallback>
                                {log.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{log.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CategoryIcon className="h-4 w-4" />
                            <span>{log.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.resource}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.resourceId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <StatusIcon
                              className={`h-4 w-4 ${log.status === "SUCCESS"
                                ? "text-green-600"
                                : log.status === "FAILED"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                                }`}
                            />
                            <span>{log.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              severityColors[
                              log.severity as keyof typeof severityColors
                              ]
                            }
                          >
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Audit Log Details</DialogTitle>
                                <DialogDescription>
                                  Log ID: {log.id}
                                </DialogDescription>
                              </DialogHeader>
                              <ScrollArea className="max-h-[500px]">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Timestamp
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {format(log.timestamp, "PPpp")}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        User
                                      </label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                          <Image
                                            src={
                                              log.user.avatar ||
                                              "/placeholder.svg"
                                            }
                                            alt="..."
                                          />
                                          <AvatarFallback>
                                            {log.user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-sm">
                                            {log.user.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {log.user.email}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Action
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {log.action}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Category
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {log.category}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Resource
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {log.resource}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Resource ID
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {log.resourceId}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">
                                      Description
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {log.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        IP Address
                                      </label>
                                      <p className="text-sm text-muted-foreground font-mono">
                                        {log.ipAddress}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Status
                                      </label>
                                      <div className="flex items-center space-x-1 mt-1">
                                        <StatusIcon
                                          className={`h-4 w-4 ${log.status === "SUCCESS"
                                            ? "text-green-600"
                                            : log.status === "FAILED"
                                              ? "text-red-600"
                                              : "text-yellow-600"
                                            }`}
                                        />
                                        <span className="text-sm">
                                          {log.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">
                                      User Agent
                                    </label>
                                    <p className="text-xs text-muted-foreground font-mono break-all">
                                      {log.userAgent}
                                    </p>
                                  </div>

                                  {log.details && (
                                    <>
                                      <Separator />
                                      <div>
                                        <label className="text-sm font-medium">
                                          Additional Details
                                        </label>
                                        <div className="mt-2 space-y-2">
                                          {Object.entries(log.details).map(
                                            ([key, value]) => (
                                              <div
                                                key={key}
                                                className="flex justify-between"
                                              >
                                                <span className="text-sm text-muted-foreground capitalize">
                                                  {key
                                                    .replace(/([A-Z])/g, " $1")
                                                    .trim()}
                                                  :
                                                </span>
                                                <span className="text-sm font-medium">
                                                  {value}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline View</CardTitle>
              <CardDescription>
                Chronological view of audit log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {logsByDate.map(([date, logs]) => (
                  <div key={date}>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4" />
                      <h3 className="font-semibold">
                        {format(new Date(date), "EEEE, MMMM dd, yyyy")}
                      </h3>
                      <Badge variant="secondary">{logs.length} events</Badge>
                    </div>
                    <div className="space-y-3 sm:ml-6 border-l-2 border-muted pl-4">
                      {logs.map((log) => {
                        const StatusIcon = getStatusIcon(log.status);
                        const CategoryIcon = getCategoryIcon(log.category);

                        return (
                          <div key={log.id} className="relative">
                            <div className="absolute -left-6 mt-1.5">
                              <div
                                className={`w-3 h-3 rounded-full border-2 ${log.status === "SUCCESS"
                                  ? "bg-green-500 border-green-500"
                                  : log.status === "FAILED"
                                    ? "bg-red-500 border-red-500"
                                    : "bg-yellow-500 border-yellow-500"
                                  }`}
                              />
                            </div>
                            <Card className="sm:ml-2">
                              <CardContent className="p-4">
                                <div className="flex flex-wrap gap-2 items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <Avatar className="h-6 w-6">
                                        <Image
                                          src={
                                            log.user.avatar ||
                                            "/placeholder.svg"
                                          }
                                          alt="..."
                                        />
                                        <AvatarFallback>
                                          {log.user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium text-nowrap">
                                        {log.user.name}
                                      </span>
                                      <Badge variant="outline">
                                        {log.action}
                                      </Badge>
                                      <div className="flex items-center space-x-1">
                                        <CategoryIcon className="h-3 w-3" />
                                        <span className="text-sm text-muted-foreground">
                                          {log.category}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {log.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                      <span>
                                        {format(log.timestamp, "HH:mm:ss")}
                                      </span>
                                      <span>
                                        {log.resource} ({log.resourceId})
                                      </span>
                                      <span>{log.ipAddress}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      className={
                                        severityColors[
                                        log.severity as keyof typeof severityColors
                                        ]
                                      }
                                    >
                                      {log.severity}
                                    </Badge>
                                    <StatusIcon
                                      className={`h-4 w-4 ${log.status === "SUCCESS"
                                        ? "text-green-600"
                                        : log.status === "FAILED"
                                          ? "text-red-600"
                                          : "text-yellow-600"
                                        }`}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
