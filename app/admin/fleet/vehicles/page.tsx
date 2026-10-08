"use client";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { MyCancel, MyHashID, MyRequired, MySave, MySubstring } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { CStatusBadge } from "@/components/StatusBadge";
import { MyNoItemTableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import api from '@/lib/axios';
import { FormatTimestamp } from "@/lib/function";
import { PagingT } from "@/lib/response";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  User
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import AddVehicleDialog from "./addForm";
import { VehicleDetailView } from "./details";
import { VehicleFilters, VehicleParam, VehicleT } from "./utility";

// Mock data for vehicles
export default function VehicleListPage() {
  const url = `vehicle-service/api/v1/vehicle`;

  const [vehicleParam, setVehicleParam] = useState<VehicleParam>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleT>();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleT[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState<PagingT<VehicleT> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);

  const [filters, setFilters] = useState<Partial<VehicleFilters>>({});

  useEffect(() => {
    vehicleParamData();
  }, []);

  useEffect(() => {
    getVehicleList();
  }, [page, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      getVehicleList();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const getVehicleList = () => {
    setIsRefreshing(true);
    api.get(`${url}`, {
      params: { page, size: size, ...filters, sort: "updatedAt,desc" },
    }).then((res) => {
      const d: PagingT<VehicleT> = res.data.data;
      setVehicles(d.result);
      setPagination(d)
    }).finally(() => {
      setIsRefreshing(false);
      setShowEditVehicle(false);
    });
  }

  const vehicleParamData = async () => {
    await api.get(`${url}/param`).then((res) => {
      const d: VehicleParam = res.data.data;
      setVehicleParam(d);
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getVehicleList();
  };

  const addVehicle = async (data: Record<string, any>) => {
    try {
      if (data.driverId == "") { return }
      const purchaseDate = data.purchaseDate;

      const isoDate =
        typeof purchaseDate === "string" && purchaseDate
          ? new Date(`${purchaseDate}T00:00:00`).toISOString()
          : null;

      data.purchaseDate = isoDate;
      await api.post(`${url}`, data);
      setShowAddVehicle(false);
      // Refresh vehicle list
      getVehicleList();
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  };

  const handleSaveChanges = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const purchaseDate = formData.get("purchaseDate");

    const isoDate =
      typeof purchaseDate === "string" && purchaseDate
        ? new Date(`${purchaseDate}T00:00:00`).toISOString()
        : null;

    data.purchaseDate = isoDate;
    api.put(`${url}/${selectedVehicle?.id}`, data).then((response) => {
      getVehicleList();
    });
  };

  const confirmDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    try {
      setIsSubmitting(true);
      await api.delete(`${url}/${selectedVehicle.id}`).then((res) => {
        getVehicleList();
        setIsDeleteDialogOpen(false);
      });
    } catch (error) {
      console.error("confirmDeleteVehicle::", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle List</h1>
          <p className="text-muted-foreground">
            Manage and monitor your entire fleet with comprehensive vehicle
            information
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
          <PermissionGuard permission={PERMISSIONS.VEHICLE_CREATE}>
            <AddVehicleDialog
              open={showAddVehicle}
              onOpenChange={setShowAddVehicle}
              vehicleParam={vehicleParam}
              onSubmit={addVehicle} />
          </PermissionGuard>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative  w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="By Driver Id"
            className="pl-8"
            value={filters?.driverId || ""}
            onChange={(e) => setFilters({ ...filters, driverId: e.target.value == "" ? undefined : e.target.value })}
          />
        </div>

        <div className="relative w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="By License Plate"
            className="pl-8"
            value={filters?.licensePlate || ""}
            onChange={(e) => setFilters({ ...filters, licensePlate: e.target.value == "" ? undefined : e.target.value })}
          />
        </div>

        <div className="relative w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="By VIN"
            className="pl-8"
            value={filters?.vin || ""}
            onChange={(e) => setFilters({ ...filters, vin: e.target.value == "" ? undefined : e.target.value })}
          />
        </div>

        <div className="relative w-[120px]">
          <Select value={filters?.tenorType || "all"} onValueChange={(value) => setFilters({ ...filters, tenorType: value == "all" ? undefined : value })}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tenor Type</SelectItem>
              {vehicleParam?.tenor.map((tenor) => (
                <SelectItem key={tenor} value={tenor}>
                  {tenor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      {selectedVehicles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedVehicles.length} vehicle
                  {selectedVehicles.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Assign Driver
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className=" overflow-x-auto">
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">Nº</TableHead>
                <TableHead className="w-[50px] text-center">ID</TableHead>
                <TableHead className="hidden md:table-cell text-center">    Driver </TableHead>
                <TableHead className="w-[140px] text-center">Type/Model</TableHead>
                <TableHead className="hidden lg:table-cell text-center"> LicensePlate  </TableHead>
                <TableHead className="hidden md:table-cell text-center">Color</TableHead>
                <TableHead className="hidden lg:table-cell text-center">  Location  </TableHead>
                <TableHead className="w-[100px] text-center">
                  <Select defaultValue={filters?.vehicleStatus || "all"} onValueChange={(value) => setFilters({ ...filters, vehicleStatus: value == "all" ? undefined : value })}>
                    <SelectTrigger className=" w-[100px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {vehicleParam?.status.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-right"> Updated By </TableHead>
                <TableHead className="hidden lg:table-cell text-left"> Updated Date  </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <MyNoItemTableRow colSpan={11} name="vehicle" key={"vehicle-table"} items={vehicles} />
              {vehicles.map((vehicle, index) => (
                <TableRow key={vehicle.id} onDoubleClick={() => {
                  setSelectedVehicle(vehicle);
                  setShowVehicleDetails(true);
                }}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {MyHashID(vehicle.id)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vehicle.driverName || ""}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">   {vehicle.model}  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center ">  {vehicle.licensePlate.toLocaleString()} </TableCell>
                  <TableCell className="  items-center gap-1 justify-center">
                    <div className={`h-5 w-2 rounded-full  pl-2`}
                      style={{ backgroundColor: vehicle?.color?.toLocaleLowerCase(), border: '1px solid gray' }}>
                      <span className={`ml-1`}> </span><MySubstring item={vehicle.color} substring={10} /></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">  </TableCell>
                  <TableCell className="w-[100px]">{CStatusBadge(vehicle.vehicleStatus)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">{vehicle.updatedBy}</TableCell>
                  <TableCell className="hidden lg:table-cell text-left">
                    {FormatTimestamp(vehicle.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setShowVehicleDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <PermissionGuard permission={PERMISSIONS.VEHICLE_UPDATE}>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setShowEditVehicle(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Vehicle
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard permission={PERMISSIONS.VEHICLE_DELETE}>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={(e) => {
                              e.preventDefault();
                              setSelectedVehicle(vehicle)
                              setIsDeleteDialogOpen(true);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Vehicle
                            </DropdownMenuItem>
                          </PermissionGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <MyShowingItem pagination={pagination} />
              <Select defaultValue={size.toString()}
                onValueChange={(value) => {
                  setPage(0); // reset to first page
                  setSize(Number(value));
                }} >
                <MySelectContent />
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <MyPagination
                currentPage={pagination?.currentPage ?? 0}
                totalPage={pagination?.totalPage ?? 1}
                onPageChange={setPage} />
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showVehicleDetails} onOpenChange={setShowVehicleDetails}>
        <DialogContent className="max-w-3xl sm:h-max overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Vechicle Listing Details
            </DialogTitle>
          </DialogHeader>
          <div className="max-w-4xl h-[70vh] overflow-y-auto pr-1">
            {selectedVehicle && (
              <VehicleDetailView vehicle={selectedVehicle} />
            )}
          </div>
          <DialogFooter className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowVehicleDetails(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowVehicleDetails(false);
                setShowEditVehicle(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditVehicle} onOpenChange={setShowEditVehicle}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={handleSaveChanges}>
            <DialogHeader>
              <DialogTitle>Edit Vehicle - {selectedVehicle?.driverName}</DialogTitle>
              <DialogDescription>
                Update the vehicle information and settings.
              </DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="grid grid-cols-3 gap-4 p-2 md:h-[70vh] sm:h-max overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input id="driverName" defaultValue={selectedVehicle.driverName} name="driverName" placeholder="e.g., John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverId">Driver ID</Label>
                  <Input id="driverId" defaultValue={selectedVehicle.driverId} name="driverId" placeholder="e.g., DRV-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenorType">TenorType</Label>
                  <Select defaultValue={selectedVehicle.tenorType} name="tenorType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleParam?.tenor.map((tenor) => (
                        <SelectItem key={tenor} value={tenor}>
                          {tenor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">
                    Category
                  </Label>

                  <Select
                    defaultValue={selectedVehicle.categoryId}
                    name="categoryId"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {vehicleParam?.category?.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" defaultValue={selectedVehicle.model} name="model" placeholder="e.g., Cascadia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage  <MyRequired /></Label>
                  <Input id="mileage" defaultValue={selectedVehicle.mileage} type="number" name="mileage" required placeholder="e.g., 50000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" defaultValue={selectedVehicle.year} type="number" name="year" placeholder="e.g., 2023" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-plate">License Plate  <MyRequired /></Label>
                  <Input id="license-plate" defaultValue={selectedVehicle.licensePlate} name="licensePlate" required placeholder="e.g., TRK-004-NY" />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="color">Color <MyRequired /></Label>
                  <Input id="color" defaultValue={selectedVehicle.color} name="color" placeholder="e.g., Red" />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input type="date" id="purchaseDate"
                    defaultValue={selectedVehicle?.purchaseDate
                      ? selectedVehicle.purchaseDate.split("T")[0] : ""} name="purchaseDate"
                    placeholder="e.g., 2023-01-01" />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="vehicleStatus">Vehicle Status</Label>
                  <Select defaultValue={selectedVehicle.vehicleStatus} name="vehicleStatus">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleParam?.status.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input id="vin" defaultValue={selectedVehicle.vin} name="vin" placeholder="Vehicle Identification Number" />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="mark">Note</Label>
                  <Textarea
                    id="mark"
                    defaultValue={selectedVehicle.mark}
                    placeholder="Additional notes about the vehicle..."
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-3 flex-wrap">
              <Button type="button" variant="outline" onClick={() => setShowEditVehicle(false)}>
                <MyCancel />
              </Button>
              <Button type="submit">
                <MySave />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteVehicle}
        loading={isSubmitting}
        itemName={selectedVehicle?.driverName}
      >
        {selectedVehicle && (
          <div className="mt-4 rounded-lg border p-4">
            <h3 className="font-medium">Vehicle Details</h3>

            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2">
                <span>ID:</span>
                <span>{selectedVehicle.id}</span>
              </div>

              <div className="flex gap-2">
                <span>Driver Name:</span>
                <span>{selectedVehicle.driverName}</span>
              </div>

              <div className="flex gap-2">
                <span>License Plate:</span>
                <span>{selectedVehicle.licensePlate}</span>
              </div>
            </div>
          </div>
        )}
      </DeleteConfirmDialog>
    </div>
  );
}
