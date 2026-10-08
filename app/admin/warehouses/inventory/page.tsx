"use client";
import type React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  History,
  Loader2,
  MoreHorizontal,
  Package,
  PackagePlus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Upload,
  Warehouse,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function InventoryLevelsPage() {
  // State for dialogs
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [restockItemOpen, setRestockItemOpen] = useState(false);
  const [transferItemOpen, setTransferItemOpen] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [markForClearanceOpen, setMarkForClearanceOpen] = useState(false);
  const [disposeItemOpen, setDisposeItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Function to handle opening dialogs for inventory items
  const handleItemAction = (action: string, item: any) => {
    setSelectedItem(item);

    switch (action) {
      case "viewDetails":
        setViewDetailsOpen(true);
        break;
      case "editItem":
        setEditItemOpen(true);
        break;
      case "viewHistory":
        setViewHistoryOpen(true);
        break;
      case "restockItem":
        setRestockItemOpen(true);
        break;
      case "transferItem":
        setTransferItemOpen(true);
        break;
      case "deleteItem":
        setDeleteItemOpen(true);
        break;
      case "markForClearance":
        setMarkForClearanceOpen(true);
        break;
      case "disposeItem":
        setDisposeItemOpen(true);
        break;
      default:
        break;
    }
  };

  // Function to handle form submission with loading state
  const handleSubmit = (e: React.FormEvent, closeFunction: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Close dialog after showing success
      setTimeout(() => {
        setShowSuccess(false);
        closeFunction();
      }, 1500);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Levels
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage inventory across all warehouse locations
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Items
                  </p>
                  <h3 className="text-2xl font-bold">24,892</h3>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">+5.2%</span>
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Low Stock Items
                  </p>
                  <h3 className="text-2xl font-bold">347</h3>
                </div>
                <div className="rounded-full bg-amber-500/10 p-3">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="font-medium text-red-500">+12.8%</span>
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inventory Value
                  </p>
                  <h3 className="text-2xl font-bold">$4.28M</h3>
                </div>
                <div className="rounded-full bg-green-500/10 p-3">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">+3.7%</span>
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Restocks
                  </p>
                  <h3 className="text-2xl font-bold">128</h3>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">-8.4%</span>
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-inventory" className="w-full">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <TabsList className="flex flex-wrap gap-2 h-full sm:w-max justify-start">
              <TabsTrigger value="all-inventory">All Inventory</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <PackagePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Inventory</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new inventory item. Click save
                      when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input id="item-name" placeholder="Enter item name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="item-sku">SKU</Label>
                        <Input id="item-sku" placeholder="Enter SKU" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">
                              Electronics
                            </SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="food">
                              Food & Beverage
                            </SelectItem>
                            <SelectItem value="automotive">
                              Automotive
                            </SelectItem>
                            <SelectItem value="home">Home Goods</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="warehouse">Warehouse</Label>
                        <Select>
                          <SelectTrigger id="warehouse">
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lax">
                              Los Angeles (LAX1)
                            </SelectItem>
                            <SelectItem value="nyc">New York (NYC2)</SelectItem>
                            <SelectItem value="chi">Chicago (CHI1)</SelectItem>
                            <SelectItem value="mia">Miami (MIA3)</SelectItem>
                            <SelectItem value="dal">Dallas (DAL2)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="unit-price">Unit Price ($)</Label>
                        <Input
                          id="unit-price"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="reorder-point">Reorder Point</Label>
                        <Input
                          id="reorder-point"
                          type="number"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter item description"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry-date">
                          Expiry Date (if applicable)
                        </Label>
                        <Input id="expiry-date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Aisle 5, Rack B, Shelf 3"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="track-expiry" />
                      <Label htmlFor="track-expiry">
                        Track expiration date
                      </Label>
                    </div>
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Item</Button>
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

          {/* Filters */}
          <div className="my-4 flex gap-4 flex-wrap 2xl:flex-nowrap justify-between">
            <div className="relative w-full min-w-[280px] max-w-[500px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="w-full pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  <SelectItem value="lax">Los Angeles (LAX1)</SelectItem>
                  <SelectItem value="nyc">New York (NYC2)</SelectItem>
                  <SelectItem value="chi">Chicago (CHI1)</SelectItem>
                  <SelectItem value="mia">Miami (MIA3)</SelectItem>
                  <SelectItem value="dal">Dallas (DAL2)</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="home">Home Goods</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory Table */}
          <TabsContent value="all-inventory" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Inventory Items</CardTitle>
                <CardDescription>
                  Showing 1-10 of 24,892 items across all warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Stock Level</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.sku}>
                        <TableCell className="font-mono text-xs">
                          {item.sku}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-muted-foreground" />
                            {item.warehouse}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <StockLevelBadge level={item.stockLevel} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.unitPrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          $
                          {(
                            (item.quantity || 0) * (item.unitPrice || 0)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {item.lastUpdated}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("viewDetails", item)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("editItem", item)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("viewHistory", item)
                                }
                              >
                                <History className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("restockItem", item)
                                }
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restock Item
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("transferItem", item)
                                }
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Transfer Item
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleItemAction("deleteItem", item)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing 1-10 of 24,892 items
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low Stock Tab */}
          <TabsContent value="low-stock" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>
                  Items that are below their reorder point and need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Current Qty</TableHead>
                      <TableHead className="text-right">
                        Reorder Point
                      </TableHead>
                      <TableHead className="text-right">Stock Level</TableHead>
                      <TableHead className="text-right">
                        Days Until Stockout
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.sku}>
                        <TableCell className="font-mono text-xs">
                          {item.sku}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorderPoint.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={(item.quantity / item.reorderPoint) * 100}
                              className="h-2 w-16 bg-red-500"
                            />
                            <span className="text-red-500">
                              {Math.round(
                                (item.quantity / item.reorderPoint) * 100
                              )}
                              %
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              item.daysUntilStockout < 7
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {item.daysUntilStockout} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleItemAction("restockItem", item)
                            }
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiring Tab */}
          <TabsContent value="expiring" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Expiring Inventory</CardTitle>
                <CardDescription>
                  Items that will expire within the next 90 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Expiry Date</TableHead>
                      <TableHead className="text-right">
                        Days Remaining
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringItems.map((item) => (
                      <TableRow key={item.sku}>
                        <TableCell className="font-mono text-xs">
                          {item.sku}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.expiryDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <ExpiryBadge days={item.daysRemaining} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("markForClearance", item)
                                }
                              >
                                <Tag className="mr-2 h-4 w-4" />
                                Mark for Clearance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("transferItem", item)
                                }
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Transfer Item
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleItemAction("disposeItem", item)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Dispose Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-0">
            <div className="grid gap-4 2xl:grid-cols-2">
              {/* Inventory Value by Category Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value by Category</CardTitle>
                  <CardDescription>
                    Total inventory value distribution across product categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryValueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent! * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inventoryValueByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          `$${value.toLocaleString()}`,
                          "Value",
                        ]}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Inventory Levels by Warehouse Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Levels by Warehouse</CardTitle>
                  <CardDescription>
                    Current inventory quantities across all warehouse locations
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryLevelsByWarehouse}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="warehouse"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        formatter={(value: any) => [
                          value.toLocaleString(),
                          "Items",
                        ]}
                        labelFormatter={(label) => `Warehouse: ${label}`}
                      />
                      <Bar
                        dataKey="totalItems"
                        fill="#8884d8"
                        name="Total Items"
                      >
                        {inventoryLevelsByWarehouse.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              WAREHOUSE_COLORS[index % WAREHOUSE_COLORS.length]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Inventory Turnover Rate */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Turnover Rate</CardTitle>
                  <CardDescription>
                    How quickly inventory is sold and replaced over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {turnoverRates.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.category}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {item.rate}x
                            </span>
                            {item.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={item.rate * 10} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Industry Avg: {item.industryAvg}x</span>
                          <span>Goal: {item.goal}x</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Inventory Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Inventory Trends</CardTitle>
                  <CardDescription>
                    Inventory value and quantity trends over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyInventoryTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        yAxisId="left"
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) =>
                          `$${(value / 1000000).toFixed(1)}M`
                        }
                      />
                      <Tooltip
                        formatter={(value: any, name: string | number | undefined) => {
                          if (name === "Total Items") {
                            return [value.toLocaleString(), name];
                          }
                          return [`$${(value / 1000000).toFixed(2)}M`, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="totalItems"
                        fill="#8884d8"
                        name="Total Items"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalValue"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        name="Total Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Cards */}
            <div className="mt-4 grid gap-4 2xl:grid-cols-2">
              {/* Stock Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Status Distribution</CardTitle>
                  <CardDescription>
                    Current distribution of inventory by stock status
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockStatusDistribution}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <YAxis dataKey="status" type="category" width={80} />
                      <Tooltip
                        formatter={(value: any) => [
                          value.toLocaleString(),
                          "Items",
                        ]}
                      />
                      <Bar dataKey="count" fill="#8884d8">
                        {stockStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#8884d8" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Inventory Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Insights</CardTitle>
                  <CardDescription>
                    AI-powered recommendations and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[240px] pr-4">
                    <div className="space-y-4">
                      {inventoryInsights.map((insight, index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`rounded-full p-2 ${insight.iconBg}`}
                            >
                              <insight.icon
                                className={`h-4 w-4 ${insight.iconColor}`}
                              />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium">{insight.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {insight.description}
                              </p>
                              <div className="pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs bg-transparent"
                                >
                                  {insight.action}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <>
              <div className="flex flex-wrap border-b">
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "details"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "history"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "location"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("location")}
                >
                  Location
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "documents"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                    }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
                </button>
              </div>

              {activeTab === "details" && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        SKU
                      </h3>
                      <p className="font-mono">{selectedItem.sku}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Category
                      </h3>
                      <p>{selectedItem.category}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Item Name
                    </h3>
                    <p className="font-medium">{selectedItem.name}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Warehouse
                      </h3>
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedItem.warehouse}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Storage Location
                      </h3>
                      <p>Aisle 3, Rack B, Shelf 2</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Quantity
                      </h3>
                      <p>{selectedItem.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Unit Price
                      </h3>
                      <p>${(selectedItem.unitPrice || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Value
                      </h3>
                      <p className="font-medium">
                        $
                        {(
                          (selectedItem.quantity || 0) *
                          (selectedItem.unitPrice || 0)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Stock Level
                      </h3>
                      <div className="mt-1">
                        <StockLevelBadge level={selectedItem.stockLevel} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Reorder Point
                      </h3>
                      <p>100 units</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      High-quality {selectedItem.name.toLowerCase()} with
                      premium features. This item is part of our standard
                      inventory and is regularly stocked.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Item Performance</h3>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Turnover Rate
                        </p>
                        <div className="flex items-center">
                          <span className="font-medium">4.2x</span>
                          <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Days in Stock
                        </p>
                        <p className="font-medium">87 days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Sales Velocity
                        </p>
                        <p className="font-medium">12 units/day</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4 py-4">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <h3 className="font-medium">Inventory History</h3>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="restock">Restock</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="flex flex-wrap gap-1 items-start justify-between">
                            <div className="flex flex-wrap items-start gap-3">
                              <div
                                className={`rounded-full p-2 ${i % 3 === 0
                                  ? "bg-green-500/10"
                                  : i % 3 === 1
                                    ? "bg-blue-500/10"
                                    : "bg-amber-500/10"
                                  }`}
                              >
                                {i % 3 === 0 ? (
                                  <RefreshCw className="h-4 w-4 text-green-500" />
                                ) : i % 3 === 1 ? (
                                  <Truck className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Edit className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {i % 3 === 0
                                    ? "Restock"
                                    : i % 3 === 1
                                      ? "Transfer In"
                                      : "Adjustment"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {i % 3 === 0
                                    ? `Added 150 units from supplier`
                                    : i % 3 === 1
                                      ? `Transferred 75 units from NYC2 warehouse`
                                      : `Adjusted inventory by -12 units (inventory count)`}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span>By: John Smith</span>
                                  <span>•</span>
                                  <span>
                                    Reference:{" "}
                                    {i % 3 === 0
                                      ? "PO-2023-4872"
                                      : i % 3 === 1
                                        ? "TR-2023-1254"
                                        : "ADJ-2023-0472"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {i === 0
                                ? "2 hours ago"
                                : i === 1
                                  ? "Yesterday"
                                  : `${i + 1} days ago`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activeTab === "location" && (
                <div className="space-y-4 py-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Warehouse
                      </h3>
                      <p className="font-medium">{selectedItem.warehouse}</p>
                      <p className="text-sm text-muted-foreground">
                        123 Warehouse Blvd, Los Angeles, CA 90001
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Storage Location
                      </h3>
                      <p className="font-medium">Aisle 3, Rack B, Shelf 2</p>
                      <p className="text-sm text-muted-foreground">
                        Zone: Electronics
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Warehouse Map</h3>
                    <div className="mt-4 flex h-[200px] items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <Warehouse className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Warehouse map visualization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Item location highlighted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Other Locations</h3>
                    <p className="text-sm text-muted-foreground">
                      This item is also stored in these locations:
                    </p>

                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          <span>New York (NYC2)</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Qty: 78</span>
                          <Badge variant="outline">Aisle 5, Rack C</Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          <span>Chicago (CHI1)</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Qty: 42</span>
                          <Badge variant="outline">Aisle 2, Rack A</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Item Documents</h3>
                    <Button size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  </div>

                  <div className="rounded-lg border">
                    <div className="flex flex-wrap gap-1 items-center justify-between border-b p-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-500/10 p-1">
                          <File className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium">
                          Product Specification
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          PDF • 2.4 MB • Uploaded 3 months ago
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center justify-between border-b p-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-green-500/10 p-1">
                          <File className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium">Safety Data Sheet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          PDF • 1.8 MB • Uploaded 3 months ago
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-amber-500/10 p-1">
                          <File className="h-4 w-4 text-amber-500" />
                        </div>
                        <span className="font-medium">Supplier Contract</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          PDF • 3.1 MB • Uploaded 5 months ago
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setEditItemOpen(false))}
            >
              <div className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-item-name">Item Name</Label>
                    <Input
                      id="edit-item-name"
                      defaultValue={selectedItem.name}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-item-sku">SKU</Label>
                    <Input
                      id="edit-item-sku"
                      defaultValue={selectedItem.sku}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      defaultValue={
                        selectedItem?.category?.toLowerCase() || "electronics"
                      }
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="home">Home Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-warehouse">Warehouse</Label>
                    <Select
                      defaultValue={
                        selectedItem?.warehouse
                          ?.split(" ")?.[0]
                          ?.toLowerCase() || "los"
                      }
                    >
                      <SelectTrigger id="edit-warehouse">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="los">Los Angeles (LAX1)</SelectItem>
                        <SelectItem value="new">New York (NYC2)</SelectItem>
                        <SelectItem value="chicago">Chicago (CHI1)</SelectItem>
                        <SelectItem value="miami">Miami (MIA3)</SelectItem>
                        <SelectItem value="dallas">Dallas (DAL2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      defaultValue={selectedItem?.quantity || 0}
                      min="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-unit-price">Unit Price ($)</Label>
                    <Input
                      id="edit-unit-price"
                      type="number"
                      defaultValue={selectedItem?.unitPrice || 0}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-reorder-point">Reorder Point</Label>
                    <Input
                      id="edit-reorder-point"
                      type="number"
                      defaultValue="100"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={`High-quality ${selectedItem.name.toLowerCase()} with premium features. This item is part of our standard inventory and is regularly stocked.`}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-expiry-date">
                      Expiry Date (if applicable)
                    </Label>
                    <Input id="edit-expiry-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-location">Storage Location</Label>
                    <Input
                      id="edit-location"
                      defaultValue="Aisle 3, Rack B, Shelf 2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="edit-track-expiry" />
                  <Label htmlFor="edit-track-expiry">
                    Track expiration date
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditItemOpen(false)}
                >
                  <MyCancel />
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <MySave />
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View History Dialog */}
      <Dialog open={viewHistoryOpen} onOpenChange={setViewHistoryOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[750px] h-[90vh] sm:h-max max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Item History</DialogTitle>
            <DialogDescription>
              Transaction history for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">SKU: {selectedItem.sku}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="break-all sm:break-normal">
                    {selectedItem.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex flex-col sm:flex-row gap-3 items-start justify-between">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={`flex-shrink-0 rounded-full p-2 ${i % 4 === 0
                              ? "bg-green-500/10"
                              : i % 4 === 1
                                ? "bg-blue-500/10"
                                : i % 4 === 2
                                  ? "bg-amber-500/10"
                                  : "bg-red-500/10"
                              }`}
                          >
                            {i % 4 === 0 ? (
                              <RefreshCw className="h-4 w-4 text-green-500" />
                            ) : i % 4 === 1 ? (
                              <Truck className="h-4 w-4 text-blue-500" />
                            ) : i % 4 === 2 ? (
                              <Edit className="h-4 w-4 text-amber-500" />
                            ) : (
                              <ShoppingCart className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium">
                              {i % 4 === 0
                                ? "Restock"
                                : i % 4 === 1
                                  ? "Transfer In"
                                  : i % 4 === 2
                                    ? "Adjustment"
                                    : "Sale"}
                            </h4>
                            <p className="text-sm text-muted-foreground break-words">
                              {i % 4 === 0
                                ? `Added 150 units from supplier (Batch #B2023-${1000 + i
                                })`
                                : i % 4 === 1
                                  ? `Transferred 75 units from NYC2 warehouse`
                                  : i % 4 === 2
                                    ? `Adjusted inventory by -12 units (inventory count discrepancy)`
                                    : `Sold 25 units to customer (Order #ORD-2023-${5000 + i
                                    })`}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                By:{" "}
                                {i % 3 === 0
                                  ? "John Smith"
                                  : i % 3 === 1
                                    ? "Sarah Johnson"
                                    : "Mike Davis"}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="break-all">
                                Reference:{" "}
                                {i % 4 === 0
                                  ? `PO-2023-${4800 + i}`
                                  : i % 4 === 1
                                    ? `TR-2023-${1200 + i}`
                                    : i % 4 === 2
                                      ? `ADJ-2023-${400 + i}`
                                      : `ORD-2023-${5000 + i}`}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs">
                              <span
                                className={`font-medium ${i % 4 === 0 || i % 4 === 1
                                  ? "text-green-600"
                                  : "text-red-600"
                                  }`}
                              >
                                {i % 4 === 0 || i % 4 === 1 ? "+" : "-"}
                                {i % 4 === 0
                                  ? "150"
                                  : i % 4 === 1
                                    ? "75"
                                    : i % 4 === 2
                                      ? "12"
                                      : "25"}{" "}
                                units
                              </span>
                              <span className="text-muted-foreground">
                                Balance:{" "}
                                {(selectedItem.quantity || 0) +
                                  (i % 4 === 0 ? 150 : i % 4 === 1 ? 75 : -25)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-sm text-muted-foreground">
                            {i === 0
                              ? "2 hours ago"
                              : i === 1
                                ? "Yesterday"
                                : i < 7
                                  ? `${i + 1} days ago`
                                  : `${Math.floor((i + 1) / 7)} week${Math.floor((i + 1) / 7) > 1 ? "s" : ""
                                  } ago`}
                          </span>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {i % 4 === 0
                                ? "Completed"
                                : i % 4 === 1
                                  ? "Completed"
                                  : i % 4 === 2
                                    ? "Verified"
                                    : "Shipped"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setViewHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Item Dialog */}
      <Dialog open={restockItemOpen} onOpenChange={setRestockItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Restock Item</DialogTitle>
            <DialogDescription>
              Add inventory for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setRestockItemOpen(false))}
            >
              <div className="grid gap-4 py-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedItem.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: {selectedItem.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Current Stock
                      </p>
                      <p className="font-medium">
                        {selectedItem.quantity.toLocaleString()} units
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="restock-quantity">Quantity to Add</Label>
                    <Input
                      id="restock-quantity"
                      type="number"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="restock-cost">Unit Cost ($)</Label>
                    <Input
                      id="restock-cost"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      defaultValue={selectedItem.unitPrice}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="restock-supplier">Supplier</Label>
                  <Select>
                    <SelectTrigger id="restock-supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acme">
                        Acme Electronics Corp
                      </SelectItem>
                      <SelectItem value="global">Global Supply Co</SelectItem>
                      <SelectItem value="tech">Tech Components Ltd</SelectItem>
                      <SelectItem value="premium">Premium Parts Inc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="restock-po">Purchase Order #</Label>
                    <Input id="restock-po" placeholder="PO-2023-XXXX" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="restock-date">Expected Delivery</Label>
                    <Input id="restock-date" type="date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="restock-notes">Notes</Label>
                  <Textarea
                    id="restock-notes"
                    placeholder="Additional notes about this restock..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="restock-notify" />
                  <Label htmlFor="restock-notify">
                    Notify team when stock arrives
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setRestockItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Restocked!
                    </>
                  ) : (
                    "Confirm Restock"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Transfer Item Dialog */}
      <Dialog open={transferItemOpen} onOpenChange={setTransferItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Item</DialogTitle>
            <DialogDescription>
              Transfer {selectedItem?.name} to another warehouse
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) =>
                handleSubmit(e, () => setTransferItemOpen(false))
              }
            >
              <div className="grid gap-4 py-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedItem.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: {selectedItem.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Available Stock
                      </p>
                      <p className="font-medium">
                        {selectedItem.quantity.toLocaleString()} units
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transfer-from">From Warehouse</Label>
                    <Select
                      defaultValue={
                        selectedItem?.warehouse
                          ?.split(" ")?.[0]
                          ?.toLowerCase() || "los"
                      }
                      disabled
                    >
                      <SelectTrigger id="transfer-from">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="los">Los Angeles (LAX1)</SelectItem>
                        <SelectItem value="new">New York (NYC2)</SelectItem>
                        <SelectItem value="chicago">Chicago (CHI1)</SelectItem>
                        <SelectItem value="miami">Miami (MIA3)</SelectItem>
                        <SelectItem value="dallas">Dallas (DAL2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transfer-to">To Warehouse</Label>
                    <Select>
                      <SelectTrigger id="transfer-to">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New York (NYC2)</SelectItem>
                        <SelectItem value="chicago">Chicago (CHI1)</SelectItem>
                        <SelectItem value="miami">Miami (MIA3)</SelectItem>
                        <SelectItem value="dallas">Dallas (DAL2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transfer-quantity">
                    Quantity to Transfer
                  </Label>
                  <Input
                    id="transfer-quantity"
                    type="number"
                    placeholder="0"
                    min="1"
                    max={selectedItem.quantity}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum: {selectedItem.quantity.toLocaleString()} units
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transfer-reason">Transfer Reason</Label>
                  <Select>
                    <SelectTrigger id="transfer-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rebalance">
                        Stock Rebalancing
                      </SelectItem>
                      <SelectItem value="demand">
                        High Demand at Destination
                      </SelectItem>
                      <SelectItem value="maintenance">
                        Warehouse Maintenance
                      </SelectItem>
                      <SelectItem value="customer">Customer Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transfer-priority">Priority</Label>
                  <RadioGroup defaultValue="normal" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="priority-low" />
                      <Label htmlFor="priority-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="priority-normal" />
                      <Label htmlFor="priority-normal">Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="priority-high" />
                      <Label htmlFor="priority-high">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="priority-urgent" />
                      <Label htmlFor="priority-urgent">Urgent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transfer-notes">Notes</Label>
                  <Textarea
                    id="transfer-notes"
                    placeholder="Additional notes about this transfer..."
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Transfer Summary</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Transit Time:</span>
                      <span>2-3 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transfer Cost:</span>
                      <span>$45.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tracking Number:</span>
                      <span className="font-mono">
                        TR-2023-{Math.floor(Math.random() * 10000)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setTransferItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Transfer Initiated!
                    </>
                  ) : (
                    "Initiate Transfer"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Warning</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Deleting this item will permanently remove it from your
                      inventory system. All associated history and data will be
                      lost.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-medium">Item Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <span className="font-mono">{selectedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Quantity:</span>
                    <span>{selectedItem.quantity.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span>
                      $
                      {(
                        (selectedItem.quantity || 0) *
                        (selectedItem.unitPrice || 0)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <Label htmlFor="delete-reason">Reason for Deletion</Label>
                <Select>
                  <SelectTrigger id="delete-reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discontinued">
                      Product Discontinued
                    </SelectItem>
                    <SelectItem value="damaged">Damaged/Defective</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="duplicate">Duplicate Entry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 grid gap-2">
                <Label htmlFor="delete-notes">Additional Notes</Label>
                <Textarea
                  id="delete-notes"
                  placeholder="Provide additional context for this deletion..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) =>
                handleSubmit(e as any, () => setDeleteItemOpen(false))
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Deleted!
                </>
              ) : (
                "Delete Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark for Clearance Dialog */}
      <Dialog
        open={markForClearanceOpen}
        onOpenChange={setMarkForClearanceOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark for Clearance</DialogTitle>
            <DialogDescription>
              Mark {selectedItem?.name} for clearance sale
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) =>
                handleSubmit(e, () => setMarkForClearanceOpen(false))
              }
            >
              <div className="grid gap-4 py-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedItem.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: {selectedItem.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Current Price
                      </p>
                      <p className="font-medium">
                        ${(selectedItem.unitPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="clearance-price">Clearance Price ($)</Label>
                    <Input
                      id="clearance-price"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      defaultValue={(
                        (selectedItem.unitPrice || 0) * 0.7
                      ).toFixed(2)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clearance-discount">Discount (%)</Label>
                    <Input
                      id="clearance-discount"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      defaultValue="30"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clearance-reason">Clearance Reason</Label>
                  <Select>
                    <SelectTrigger id="clearance-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expiring">
                        Approaching Expiry
                      </SelectItem>
                      <SelectItem value="overstock">Overstock</SelectItem>
                      <SelectItem value="seasonal">End of Season</SelectItem>
                      <SelectItem value="discontinued">
                        Product Discontinued
                      </SelectItem>
                      <SelectItem value="damaged">Minor Damage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="clearance-start">Start Date</Label>
                    <Input id="clearance-start" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clearance-end">End Date</Label>
                    <Input id="clearance-end" type="date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clearance-notes">Notes</Label>
                  <Textarea
                    id="clearance-notes"
                    placeholder="Additional notes about this clearance..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="clearance-notify-customers" />
                    <Label htmlFor="clearance-notify-customers">
                      Notify customers about clearance sale
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="clearance-auto-remove" />
                    <Label htmlFor="clearance-auto-remove">
                      Auto-remove from clearance when sold out
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setMarkForClearanceOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marked for Clearance!
                    </>
                  ) : (
                    "Mark for Clearance"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispose Item Dialog */}
      <Dialog open={disposeItemOpen} onOpenChange={setDisposeItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dispose Item</DialogTitle>
            <DialogDescription>
              Dispose of {selectedItem?.name} due to expiry or damage
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form
              onSubmit={(e) => handleSubmit(e, () => setDisposeItemOpen(false))}
            >
              <div className="grid gap-4 py-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">
                        Disposal Notice
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">
                        This action will permanently remove the item from
                        inventory and record it as disposed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedItem.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: {selectedItem.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Quantity to Dispose
                      </p>
                      <p className="font-medium">
                        {selectedItem.quantity.toLocaleString()} units
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="disposal-quantity">Quantity to Dispose</Label>
                  <Input
                    id="disposal-quantity"
                    type="number"
                    placeholder="0"
                    min="1"
                    max={selectedItem.quantity}
                    defaultValue={selectedItem.quantity}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum: {selectedItem.quantity.toLocaleString()} units
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="disposal-reason">Disposal Reason</Label>
                  <Select>
                    <SelectTrigger id="disposal-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="contaminated">Contaminated</SelectItem>
                      <SelectItem value="recalled">Product Recall</SelectItem>
                      <SelectItem value="quality">Quality Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="disposal-method">Disposal Method</Label>
                  <Select>
                    <SelectTrigger id="disposal-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landfill">Landfill</SelectItem>
                      <SelectItem value="recycle">Recycle</SelectItem>
                      <SelectItem value="incineration">Incineration</SelectItem>
                      <SelectItem value="hazmat">
                        Hazardous Waste Facility
                      </SelectItem>
                      <SelectItem value="return">Return to Supplier</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="disposal-cost">Disposal Cost ($)</Label>
                  <Input
                    id="disposal-cost"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="disposal-notes">Notes</Label>
                  <Textarea
                    id="disposal-notes"
                    placeholder="Additional details about the disposal..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="disposal-notify" />
                  <Label htmlFor="disposal-notify">
                    Notify compliance team
                  </Label>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Financial Impact</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Item Value:</span>
                      <span>
                        $
                        {(
                          (selectedItem.quantity || 0) *
                          (selectedItem.unitPrice || 0)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disposal Cost:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Loss:</span>
                      <span className="text-red-600">
                        $
                        {(
                          (selectedItem.quantity || 0) *
                          (selectedItem.unitPrice || 0)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setDisposeItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Disposed!
                    </>
                  ) : (
                    "Confirm Disposal"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper Components
function StockLevelBadge({ level }: { level: string }) {
  const variants = {
    "In Stock": "default",
    "Low Stock": "destructive",
    "Out of Stock": "secondary",
    Overstock: "outline",
  } as const;

  return (
    <Badge variant={variants[level as keyof typeof variants] || "default"}>
      {level}
    </Badge>
  );
}

function ExpiryBadge({ days }: { days: number }) {
  if (days <= 7) {
    return <Badge variant="destructive">{days} days</Badge>;
  } else if (days <= 30) {
    return <Badge variant="secondary">{days} days</Badge>;
  } else {
    return <Badge variant="outline">{days} days</Badge>;
  }
}

// Mock Data
const inventoryItems = [
  {
    sku: "ELC-001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    warehouse: "Los Angeles (LAX1)",
    quantity: 1250,
    stockLevel: "In Stock",
    unitPrice: 89.99,
    lastUpdated: "2 hours ago",
  },
  {
    sku: "CLT-045",
    name: "Premium Cotton T-Shirt",
    category: "Clothing",
    warehouse: "New York (NYC2)",
    quantity: 45,
    stockLevel: "Low Stock",
    unitPrice: 24.99,
    lastUpdated: "5 hours ago",
  },
  {
    sku: "FDB-128",
    name: "Organic Protein Bars (Box of 12)",
    category: "Food & Beverage",
    warehouse: "Chicago (CHI1)",
    quantity: 0,
    stockLevel: "Out of Stock",
    unitPrice: 18.99,
    lastUpdated: "1 day ago",
  },
  {
    sku: "AUT-092",
    name: "Car Air Freshener",
    category: "Automotive",
    warehouse: "Miami (MIA3)",
    quantity: 2850,
    stockLevel: "Overstock",
    unitPrice: 4.99,
    lastUpdated: "3 hours ago",
  },
  {
    sku: "HMG-234",
    name: "Ceramic Coffee Mug Set",
    category: "Home Goods",
    warehouse: "Dallas (DAL2)",
    quantity: 180,
    stockLevel: "In Stock",
    unitPrice: 32.99,
    lastUpdated: "6 hours ago",
  },
  {
    sku: "ELC-067",
    name: "USB-C Charging Cable",
    category: "Electronics",
    warehouse: "Los Angeles (LAX1)",
    quantity: 25,
    stockLevel: "Low Stock",
    unitPrice: 12.99,
    lastUpdated: "4 hours ago",
  },
  {
    sku: "CLT-189",
    name: "Denim Jeans",
    category: "Clothing",
    warehouse: "New York (NYC2)",
    quantity: 320,
    stockLevel: "In Stock",
    unitPrice: 79.99,
    lastUpdated: "8 hours ago",
  },
  {
    sku: "FDB-056",
    name: "Artisan Coffee Beans (1lb)",
    category: "Food & Beverage",
    warehouse: "Chicago (CHI1)",
    quantity: 95,
    stockLevel: "In Stock",
    unitPrice: 16.99,
    lastUpdated: "12 hours ago",
  },
  {
    sku: "AUT-145",
    name: "Motor Oil (5W-30)",
    category: "Automotive",
    warehouse: "Miami (MIA3)",
    quantity: 15,
    stockLevel: "Low Stock",
    unitPrice: 28.99,
    lastUpdated: "2 days ago",
  },
  {
    sku: "HMG-078",
    name: "Bamboo Cutting Board",
    category: "Home Goods",
    warehouse: "Dallas (DAL2)",
    quantity: 450,
    stockLevel: "In Stock",
    unitPrice: 45.99,
    lastUpdated: "1 day ago",
  },
];

const lowStockItems = [
  {
    sku: "CLT-045",
    name: "Premium Cotton T-Shirt",
    warehouse: "New York (NYC2)",
    quantity: 45,
    reorderPoint: 100,
    daysUntilStockout: 12,
  },
  {
    sku: "ELC-067",
    name: "USB-C Charging Cable",
    warehouse: "Los Angeles (LAX1)",
    quantity: 25,
    reorderPoint: 75,
    daysUntilStockout: 8,
  },
  {
    sku: "AUT-145",
    name: "Motor Oil (5W-30)",
    warehouse: "Miami (MIA3)",
    quantity: 15,
    reorderPoint: 50,
    daysUntilStockout: 5,
  },
  {
    sku: "HMG-156",
    name: "Kitchen Towel Set",
    warehouse: "Dallas (DAL2)",
    quantity: 32,
    reorderPoint: 80,
    daysUntilStockout: 15,
  },
  {
    sku: "FDB-203",
    name: "Herbal Tea Collection",
    warehouse: "Chicago (CHI1)",
    quantity: 18,
    reorderPoint: 60,
    daysUntilStockout: 6,
  },
];

const expiringItems = [
  {
    sku: "FDB-128",
    name: "Organic Protein Bars (Box of 12)",
    category: "Food & Beverage",
    warehouse: "Chicago (CHI1)",
    quantity: 85,
    expiryDate: "2024-02-15",
    daysRemaining: 12,
  },
  {
    sku: "FDB-056",
    name: "Artisan Coffee Beans (1lb)",
    category: "Food & Beverage",
    warehouse: "Chicago (CHI1)",
    quantity: 95,
    expiryDate: "2024-02-28",
    daysRemaining: 25,
  },
  {
    sku: "FDB-203",
    name: "Herbal Tea Collection",
    category: "Food & Beverage",
    warehouse: "Chicago (CHI1)",
    quantity: 18,
    expiryDate: "2024-02-08",
    daysRemaining: 5,
  },
  {
    sku: "HMG-089",
    name: "Scented Candles",
    category: "Home Goods",
    warehouse: "Dallas (DAL2)",
    quantity: 42,
    expiryDate: "2024-03-15",
    daysRemaining: 40,
  },
  {
    sku: "FDB-167",
    name: "Vitamin Supplements",
    category: "Food & Beverage",
    warehouse: "New York (NYC2)",
    quantity: 67,
    expiryDate: "2024-02-20",
    daysRemaining: 17,
  },
];

// Chart Data and Colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const WAREHOUSE_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#8dd1e1",
];
const STATUS_COLORS = {
  "In Stock": "#22c55e",
  "Low Stock": "#f59e0b",
  "Out of Stock": "#ef4444",
  Overstock: "#8b5cf6",
};

const inventoryValueByCategory = [
  { name: "Electronics", value: 1850000 },
  { name: "Clothing", value: 920000 },
  { name: "Food & Beverage", value: 680000 },
  { name: "Automotive", value: 540000 },
  { name: "Home Goods", value: 290000 },
];

const inventoryLevelsByWarehouse = [
  { warehouse: "Los Angeles", totalItems: 8450 },
  { warehouse: "New York", totalItems: 6720 },
  { warehouse: "Chicago", totalItems: 4890 },
  { warehouse: "Miami", totalItems: 3240 },
  { warehouse: "Dallas", totalItems: 1592 },
];

const turnoverRates = [
  {
    category: "Electronics",
    rate: 4.2,
    trend: "up",
    industryAvg: 3.8,
    goal: 4.5,
  },
  { category: "Clothing", rate: 6.1, trend: "up", industryAvg: 5.2, goal: 6.0 },
  {
    category: "Food & Beverage",
    rate: 8.7,
    trend: "down",
    industryAvg: 9.1,
    goal: 9.5,
  },
  {
    category: "Automotive",
    rate: 2.3,
    trend: "up",
    industryAvg: 2.1,
    goal: 2.8,
  },
  {
    category: "Home Goods",
    rate: 3.4,
    trend: "down",
    industryAvg: 3.6,
    goal: 4.0,
  },
];

const monthlyInventoryTrends = [
  { month: "Aug", totalItems: 22500, totalValue: 3800000 },
  { month: "Sep", totalItems: 23200, totalValue: 3950000 },
  { month: "Oct", totalItems: 24100, totalValue: 4100000 },
  { month: "Nov", totalItems: 24800, totalValue: 4200000 },
  { month: "Dec", totalItems: 25200, totalValue: 4350000 },
  { month: "Jan", totalItems: 24892, totalValue: 4280000 },
];

const stockStatusDistribution = [
  { status: "In Stock", count: 18450 },
  { status: "Low Stock", count: 3470 },
  { status: "Out of Stock", count: 1240 },
  { status: "Overstock", count: 1732 },
];

const inventoryInsights = [
  {
    title: "Restock Alert",
    description:
      "15 items are below reorder point and need immediate attention.",
    action: "View Items",
    icon: AlertCircle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    title: "Overstock Opportunity",
    description:
      "Electronics category has 23% overstock. Consider clearance sales.",
    action: "Create Sale",
    icon: TrendingDown,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    title: "High Turnover",
    description: "Clothing items are selling 40% faster than expected.",
    action: "Increase Stock",
    icon: TrendingUp,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    title: "Expiry Warning",
    description: "8 food items will expire within 7 days.",
    action: "Mark Clearance",
    icon: Clock,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
];

// Import File component for documents tab
import { File } from "lucide-react"; import { MyCancel, MySave } from "@/components/myFunction";

