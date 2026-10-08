"use client";

import { MyHashID } from "@/components/myFunction";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Package,
  Phone,
  Printer,
  RefreshCw,
  Route,
  Search,
  Send,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for delayed shipments
const delayedShipments = [
  {
    id: "TRK-2024-001234",
    customer: "TechCorp Solutions",
    origin: "Los Angeles, CA",
    destination: "New York, NY",
    carrier: "FedEx Express",
    originalDelivery: "2024-01-15",
    currentDelivery: "2024-01-18",
    delayHours: 72,
    severity: "critical",
    cause: "Weather Conditions",
    value: 15000,
    status: "In Transit",
    priority: "High",
    contact: "john.doe@techcorp.com",
    phone: "+1 (555) 123-4567",
    lastUpdate: "2 hours ago",
  },
  {
    id: "TRK-2024-001235",
    customer: "Global Manufacturing",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    carrier: "UPS Ground",
    originalDelivery: "2024-01-16",
    currentDelivery: "2024-01-17",
    delayHours: 24,
    severity: "high",
    cause: "Vehicle Breakdown",
    value: 8500,
    status: "Delayed",
    priority: "Medium",
    contact: "sarah.smith@global.com",
    phone: "+1 (555) 987-6543",
    lastUpdate: "4 hours ago",
  },
  {
    id: "TRK-2024-001236",
    customer: "MedSupply Inc",
    origin: "Seattle, WA",
    destination: "Denver, CO",
    carrier: "DHL Express",
    originalDelivery: "2024-01-17",
    currentDelivery: "2024-01-17",
    delayHours: 8,
    severity: "medium",
    cause: "Traffic Congestion",
    value: 12000,
    status: "Out for Delivery",
    priority: "High",
    contact: "mike.johnson@medsupply.com",
    phone: "+1 (555) 456-7890",
    lastUpdate: "1 hour ago",
  },
  {
    id: "TRK-2024-001237",
    customer: "Retail Solutions",
    origin: "Phoenix, AZ",
    destination: "Portland, OR",
    carrier: "USPS Priority",
    originalDelivery: "2024-01-16",
    currentDelivery: "2024-01-19",
    delayHours: 48,
    severity: "high",
    cause: "Customs Delay",
    value: 5500,
    status: "Customs Hold",
    priority: "Low",
    contact: "lisa.brown@retail.com",
    phone: "+1 (555) 234-5678",
    lastUpdate: "6 hours ago",
  },
  {
    id: "TRK-2024-001238",
    customer: "AutoParts Direct",
    origin: "Detroit, MI",
    destination: "Atlanta, GA",
    carrier: "ARDB Fleet",
    originalDelivery: "2024-01-15",
    currentDelivery: "2024-01-16",
    delayHours: 12,
    severity: "low",
    cause: "Route Optimization",
    value: 3200,
    status: "In Transit",
    priority: "Low",
    contact: "tom.wilson@autoparts.com",
    phone: "+1 (555) 345-6789",
    lastUpdate: "30 minutes ago",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-500 text-black";
    case "low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "In Transit":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "Delayed":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "Out for Delivery":
      return <Package className="h-4 w-4 text-green-500" />;
    case "Customs Hold":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export default function DelayedShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const filteredShipments = delayedShipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || shipment.severity === severityFilter;
    const matchesCarrier =
      carrierFilter === "all" || shipment.carrier === carrierFilter;
    return matchesSearch && matchesSeverity && matchesCarrier;
  });

  const totalDelayed = delayedShipments.length;
  const criticalDelays = delayedShipments.filter(
    (s) => s.severity === "critical"
  ).length;
  const avgDelayHours = Math.round(
    delayedShipments.reduce((sum, s) => sum + s.delayHours, 0) / totalDelayed
  );
  const totalImpact = delayedShipments.reduce((sum, s) => sum + s.value, 0);

  const handleContactCustomer = (shipment: any) => {
    setSelectedShipment(shipment);
    setContactSubject(`Shipment Delay Update - ${shipment.id}`);
    setContactMessage(
      `Dear ${shipment.customer
      },\n\nWe wanted to update you on the status of your shipment ${shipment.id
      }.\n\nYour shipment is currently experiencing a delay of ${shipment.delayHours
      } hours due to ${shipment.cause.toLowerCase()}. The new estimated delivery date is ${new Date(
        shipment.currentDelivery
      ).toLocaleDateString()}.\n\nWe sincerely apologize for any inconvenience this may cause and are working diligently to minimize further delays.\n\nIf you have any questions or concerns, please don't hesitate to contact us.\n\nBest regards,\nARDB Customer Service Team`
    );
    setIsContactOpen(true);
  };

  const handleSendMessage = () => {
    // Here you would typically integrate with your email/SMS service
    console.log("Sending message:", {
      shipment: selectedShipment?.id,
      method: contactMethod,
      subject: contactSubject,
      message: contactMessage,
      recipient:
        contactMethod === "email"
          ? selectedShipment?.contact
          : selectedShipment?.phone,
    });

    // Reset form and close dialog
    setContactMethod("");
    setContactSubject("");
    setContactMessage("");
    setIsContactOpen(false);

    // You could show a success toast here
    alert("Message sent successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Delayed Shipments
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage shipments experiencing delays
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Delayed</CardTitle>
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDelayed}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Delays
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalDelays}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Delay Time
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDelayHours}h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Impact
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalImpact / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Total shipment value affected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Delayed Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="FedEx Express">FedEx Express</SelectItem>
                <SelectItem value="UPS Ground">UPS Ground</SelectItem>
                <SelectItem value="DHL Express">DHL Express</SelectItem>
                <SelectItem value="USPS Priority">USPS Priority</SelectItem>
                <SelectItem value="ARDB Fleet">ARDB Fleet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delayed Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Delayed Shipments ({filteredShipments.length})</CardTitle>
          <CardDescription>
            Shipments currently experiencing delays sorted by severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Delay</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Cause</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{MyHashID(shipment.id)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shipment.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.contact}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{shipment.origin}</div>
                        <div className="text-muted-foreground">
                          → {shipment.destination}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {shipment.delayHours}h
                        </div>
                        <div className="text-muted-foreground">
                          Due:{" "}
                          {new Date(
                            shipment.currentDelivery
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(shipment.severity)}>
                        {shipment.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.cause}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        <span className="text-sm">{shipment.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>${shipment.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setIsResolutionOpen(true);
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Start Resolution
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleContactCustomer(shipment)}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Contact Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href="/admin/dashboard/map"
                              className="flex items-center gap-2"
                            >
                              <Route className="mr-2 h-4 w-4" />
                              Track on Map
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Shipment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipment Details - {selectedShipment?.id}</DialogTitle>
            <DialogDescription>
              Comprehensive information about the delayed shipment
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{selectedShipment.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge variant="outline">{selectedShipment.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Origin</Label>
                  <p className="text-sm">{selectedShipment.origin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Destination</Label>
                  <p className="text-sm">{selectedShipment.destination}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Carrier</Label>
                  <p className="text-sm">{selectedShipment.carrier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Shipment Value</Label>
                  <p className="text-sm">
                    ${selectedShipment.value.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Delay Information</Label>
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Delay Duration
                    </p>
                    <p className="font-medium">
                      {selectedShipment.delayHours} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <Badge
                      className={getSeverityColor(selectedShipment.severity)}
                    >
                      {selectedShipment.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cause</p>
                    <p className="font-medium">{selectedShipment.cause}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Contact Information
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedShipment.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedShipment.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsResolutionOpen(true);
                  }}
                >
                  Start Resolution
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolution Dialog */}
      <Dialog open={isResolutionOpen} onOpenChange={setIsResolutionOpen}>
        <DialogContent className="max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Start Resolution Process</DialogTitle>
            <DialogDescription>
              Initiate resolution workflow for {selectedShipment?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution-type">Resolution Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reroute">Reroute Shipment</SelectItem>
                  <SelectItem value="expedite">Expedite Delivery</SelectItem>
                  <SelectItem value="customer-contact">
                    Contact Customer
                  </SelectItem>
                  <SelectItem value="carrier-escalation">
                    Escalate to Carrier
                  </SelectItem>
                  <SelectItem value="replacement">
                    Arrange Replacement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Resolution Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter details about the resolution plan..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsResolutionOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsResolutionOpen(false)}>
                Start Resolution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Customer Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Contact Customer - {selectedShipment?.customer}
            </DialogTitle>
            <DialogDescription>
              Send a message to the customer about shipment{" "}
              {selectedShipment?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Customer
                </Label>
                <p className="font-medium">{selectedShipment?.customer}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Shipment
                </Label>
                <p className="font-medium">{selectedShipment?.id}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm">{selectedShipment?.contact}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm">{selectedShipment?.phone}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="contact-method">Contact Method</Label>
              <Select value={contactMethod} onValueChange={setContactMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Enter your message to the customer..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsContactOpen(false);
                  setContactMethod("");
                  setContactSubject("");
                  setContactMessage("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!contactMethod || !contactSubject || !contactMessage}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
