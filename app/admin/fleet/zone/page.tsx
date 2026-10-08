"use client";
import LeafletMapClient from "@/components/map/LeafletMapClient";
import { MyHashID, MySubstring } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import PermissionGuard from "@/components/PermissionGuard";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { CStatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
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
  SelectValue
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
import { PagingT } from "@/lib/response";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Car,
  Edit,
  Eye,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  X
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { DriverT } from "../drivers/page";
import { ZoneDetailView } from "./detail";
import { DriverInZoneT, Feature, ZoneT } from "./utility";

const StatusParam = [
  { key: 'all', lable: "All" },
  { key: 'true', lable: "Active" },
  { key: 'false', lable: "Inactive" },
]

// Mock data for vehicles
export default function VehicleListPage() {
  const url = `zone-service/zones`;
  const driverPersonUrl = `person-service/api/v1/driver`;
  const driversZoneUrl = `zone-service/drivers`;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<Feature>();
  const [zoneStatus, setZoneStatus] = useState<string>('all');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zones, setZones] = useState<ZoneT>();
  const [pagination, setPagination] = useState<PagingT<ZoneT[]> | null>(null);
  const [page, setPage] = useState(0);
  const [drivers, setDrivers] = useState<DriverT[]>([]);
  const [driversInZone, setDriversInZone] = useState<DriverInZoneT[]>([]);
  const [assignedDriverSearchQuery, setAssignedDriverSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [startDrawing, setStartDrawing] = useState(false);
  const [size, setSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getZone();
  }, [page, size, zoneStatus]);

  const getZone = () => {
    setIsRefreshing(true);
    api.get(`${url}`, {
      params: { page, size, status: zoneStatus == 'all' ? undefined : zoneStatus, sort: 'updatedAt,desc' }
    }).then((res) => {
      const p: PagingT<ZoneT[]> = res.data.data;
      p.pageSize = size;
      setPagination(p);
      const d: ZoneT[] = res.data.data.data;
      setZones(d[0]);
    }).finally(() => {
      setIsRefreshing(false);
      setShowAssignDriver(false);
    });
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    getDrivers();
    getZone();
  };

  const handleEditZone = () => {
    setIsForm(true);
    setIsFormEdit(true);
  };

  const handleDrawZone = () => {
    if (isFormEdit) return;
    setStartDrawing(prev => !prev);
  };

  useEffect(() => {
    getDrivers();
  }, []);

  const getDriversInZone = (zone: Feature) => {
    api.get(`${driversZoneUrl}/${zone.properties.id}`).then((res) => {
      const d: DriverInZoneT[] = res.data.data;
      setDriversInZone(d);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getDrivers();
    }, 380); // Adjust the debounce time as needed

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getDrivers = () => {
    api.get(driverPersonUrl, {
      params: { page: 0, size: 10, status: true, sort: 'createdAt,desc', name: searchQuery }
    }).then((res) => {
      const d: DriverT[] = res.data.data.result;
      setDrivers(d);
    });
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    api.post(`${url}`, data).then((response) => {
      getZone();
      setShowAddVehicle(false);
    });
  };

  const handleSubmitEdit = (e: FormEvent<HTMLFormElement>, callback: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (!selectedZone) return;

    const _zone: Feature = selectedZone;
    _zone.properties.name = data.name;
    _zone.properties.surgeMultiplier = data.surgeMultiplier;
    _zone.geometry.coordinates = JSON.parse(data.coordinates);
    _zone.properties.updatedAt = new Date().toISOString();

    api.put(`${url}/${data.id}`, _zone).then((response) => {
      // getZone();
      callback();
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleSaveChangesAssignDriver = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    api.post(`${driversZoneUrl}/${selectedFeature?.properties.id}/assign`, data).then((response) => {
      getDriversInZone(selectedFeature as Feature);
    });
  };

  const assignDriver = (driverId: string) => {
    api.post(`${driversZoneUrl}/${selectedFeature?.properties.id}/assign`, { driverId }).then((response) => {
      getDriversInZone(selectedFeature as Feature);
    });
  };

  const handleRemoveDriver = (driverId: string) => {
    api.delete(`${driversZoneUrl}/${selectedFeature?.properties.id}`, { data: { driverId } }).then((response) => {
      getDriversInZone(selectedFeature as Feature);
    });
  };

  const handleToggleStatus = (zone: Feature) => {
    const newStatus = zone.properties.status = !zone.properties.status;
    zone.properties.status = newStatus;
    api.put(`${url}/${zone.properties.id}/status`, { active: newStatus }).then((response) => {
      getZone();
    });
  };

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const setSelected = (feature: Feature) => { setSelectedFeature(feature); };

  const handleAssignDriver = (zone: Feature) => {
    setShowAssignDriver(true);
    setSelectedZone(zone);
    getDriversInZone(zone);
  }

  const assignedDriverIds = new Set(
    driversInZone?.map((d) => d.driverId) ?? []
  );

  const availableDrivers = drivers.filter(
    (d) =>
      d.person &&
      d.id !== null &&
      !assignedDriverIds.has(d.person.id)
  );

  const filteredDriversInZone = driversInZone.filter((driver) =>
    String(driver.driverId)
      .toLowerCase()
      .includes(assignedDriverSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone List</h1>
          <p className="text-muted-foreground">
            Manage and monitor your entire zone with information
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
          <PermissionGuard permission={PERMISSIONS.ZONE_CREATE}>
            <Button
              variant={startDrawing ? "destructive" : "default"}
              size="sm"
              onClick={handleDrawZone}
              disabled={isRefreshing}
            >
              {startDrawing ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}

              {"Create Zone"}
            </Button>
          </PermissionGuard>

          {/* <DropdownMenu>
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
          </DropdownMenu> */}
          <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
            {/* <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Zone
              </Button>
            </DialogTrigger> */}
            <DialogContent className="max-w-4xl h-[70vh] sm:h-max overflow-y-auto">
              <form onSubmit={onSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Zone </DialogTitle>
                  <DialogDescription>
                    Enter the details for the new vehicle to add it to your fleet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4 ">

                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" name="make" placeholder="e.g., Freightliner" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" placeholder="e.g., Cascadia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Last Updated</Label>
                    <Input id="mileage" type="number" name="mileage" required placeholder="e.g., 50000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" name="year" required placeholder="e.g., 2023" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">License Plate</Label>
                    <Input id="license-plate" name="licensePlate" required placeholder="e.g., TRK-004-NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <Input id="driverId" name="driverId" placeholder="e.g., DRV-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input id="driverName" name="driverName" placeholder="e.g., John Doe" />
                  </div>

                  <div className="space-y-2 ">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" name="color" required placeholder="e.g., Red" />
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input type="date" id="purchaseDate" name="purchaseDate" placeholder="e.g., 2023-01-01" />
                  </div>

                  <div className="space-y-2 ">
                    <Label htmlFor="feeAmount">Fee Amount</Label>
                    <Input type="number" id="feeAmount" name="feeAmount" placeholder="e.g., 100" />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input id="vin" name="vin" placeholder="Vehicle Identification Number" />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about the vehicle..."
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowAddVehicle(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" >
                    Add Zone
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      {/* Vehicle Table */}
      <div className={`rounded-md border overflow-x-auto ${!isForm ? 'grid' : ''}  grid-cols-2`}>
        {!isForm && <span >
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow >
                <TableHead className="w-[50px] text-center">Nº</TableHead>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="w-[140px]">Name</TableHead>
                <TableHead className="w-[80px]">
                  <Select defaultValue={zoneStatus || "all"} onValueChange={(value) => setZoneStatus(value)} >
                    <SelectTrigger className=" w-[90px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {StatusParam.map((status) => (
                        <SelectItem key={status.key} value={status.key}>
                          {status.lable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones?.features.map((zone, indedx) => (
                <TableRow onDoubleClick={() => {
                  setSelectedZone(zone);
                  setDialogOpen(true);
                }}
                  key={zone.properties.id}
                  onClick={() => setSelected(zone)}
                  className={
                    selectedFeature?.properties?.id === zone.properties.id
                      ? "bg-green-100 hover:bg-green-100"
                      : " cursor-pointer hover:bg-muted"
                  }>
                  <TableCell className="text-center">{indedx + 1 + (pagination?.currentPage ?? 0) * (pagination?.pageSize ?? 1)}</TableCell>
                  <TableCell className="font-medium">
                    {zone.properties.id.substring(0, 3)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MySubstring key={zone.properties.id} item={zone.properties.name} substring={15} />
                    </div>
                  </TableCell>
                  <TableCell > {CStatusBadge(zone.properties.status ? "Active" : "Inactive")}</TableCell>
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
                              setSelectedZone(zone);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <PermissionGuard permission={PERMISSIONS.ZONE_UPDATE}>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedZone(zone);
                                handleEditZone();
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Zone
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard permission={PERMISSIONS.DRIVER_ASSIGN}>
                            <DropdownMenuItem
                              onClick={() => {
                                handleAssignDriver(zone);
                              }}
                            >
                              <Car className="h-4 w-4 mr-2" />
                              Assign Driver
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard permission={PERMISSIONS.ZONE_STATUS_UPDATE}>

                            <DropdownMenuItem onClick={() => handleToggleStatus(zone)}>
                              {zone.properties.status ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Zone
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Resume Zone
                                </>
                              )}
                            </DropdownMenuItem>
                          </PermissionGuard>
                          {/* <DropdownMenuItem>
                                <Link
                                  href="/admin/dashboard/map"
                                  className="flex items-center gap-2"
                                >
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Track Location
                                </Link>
                              </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
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
          <div />
        </span>
        }

        <span >
          {zones && <LeafletMapClient
            ZoneT={zones}
            selectFeature={setSelected}
            selectedFeature={selectedFeature}
            isForm={isForm}
            setStartDrawing={setStartDrawing}
            onSetIsForm={setIsForm}
            isEditForm={isFormEdit}
            onSetIsFormEdit={setIsFormEdit}
            startDrawing={startDrawing}
            onCreate={async (geojson) => {
              const res = await api.post("zone-service/zones", geojson);
              return res.data;
            }}
            onUpdate={async (id, geojson) => {
              await api.put(`zone-service/zones/${id}`, geojson).then(() => {
                getZone();
              });

            }}
            onDelete={async (id) => {
              await api.delete(`zone-service/zones/${id}`);
            }}
          />}
        </span>
      </div>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showAssignDriver} onOpenChange={setShowAssignDriver} >
        <DialogContent className="max-w-7xl h-[80vh] sm:h-max overflow-y-auto">
          <form onSubmit={handleSaveChangesAssignDriver}>
            <DialogHeader>
              <DialogTitle>Assign Driver </DialogTitle>
              <DialogDescription>
                Assign drivers to the selected delicery zone.
              </DialogDescription>
              <p>
                {selectedZone?.properties?.id && `Zone ID: ${selectedZone?.properties?.id.substring(0, 8)}...`}
              </p>
            </DialogHeader>
            {selectedZone && (
              <div className="grid grid-cols-4 gap-2 sm:gap-4 py-4 h-[80vh] overflow-y-auto px-2">
                <Input id="id" type="hidden" name="id" value={selectedZone.properties?.id} />
                <div className="space-y-2 col-span-2">
                  <h3 className="text-lg font-semibold mb-3">
                    Available Drivers
                  </h3>
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name... "
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Driver ID
                        </th>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Driver Name
                        </th>
                        <th className="border-b p-2 text-sm text-muted-foreground w-[80px]">
                          Status
                        </th>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                      {availableDrivers.filter((cat) => cat.id !== null).map((d) => (
                        <>  {
                          d.person && <tr key={d.person?.id}>
                            <td className="border-b p-2">
                              {MyHashID(d.person.id)}
                            </td>
                            <td className="border-b p-2">
                              {d.person?.firstName} {d.person?.lastName}
                            </td>
                            <td className="border-b p-2">
                              {CStatusBadge(d.status ? "Active" : "Inactive")}
                            </td>
                            <td className="border-b p-2">
                              <Button
                                type="button"
                                variant="default"
                                size="sm"
                                disabled={!d.person.id}
                                onClick={() => assignDriver(d.person!.id)}
                              >
                                Assign
                              </Button>
                            </td>
                          </tr>
                        }  </>
                      ))}
                      {drivers.length === 0 && (
                        <tr>
                          <td className="border-b p-2 text-sm text-muted-foreground">
                            No drivers available.
                          </td>
                          <td className="border-b p-2"></td>
                          <td className="border-b p-2"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 col-span-2 block border-l px-2 pl-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Assigned Drivers
                  </h3>
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name... "
                      className="pl-8"
                      value={assignedDriverSearchQuery}
                      onChange={(e) => {
                        setAssignedDriverSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Driver ID
                        </th>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Driver Name
                        </th>
                        <th className="border-b p-2 text-sm text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody >
                      {filteredDriversInZone.map((d) => (
                        <tr key={d.driverId}>
                          <td className="border-b p-2">
                            {MyHashID(d.driverId)}
                          </td>
                          <td className="border-b p-2">
                            {d.driverName}
                          </td>
                          <td className="border-b p-2">
                            <Button
                              type="button"
                              variant="destructive"
                              className=" clr-red"
                              size="sm"
                              onClick={() => handleRemoveDriver(d.driverId)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>))}
                      {filteredDriversInZone.length === 0 && (
                        <tr>
                          <td className="border-b p-2 text-sm text-muted-foreground">
                            No drivers assigned to this zone.
                          </td>
                          <td className="border-b p-2"></td>
                          <td className="border-b p-2"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
            <DialogFooter className="flex gap-3 flex-wrap">
              <Button type="button" variant="outline" onClick={() => setShowAssignDriver(false)}>
                Close
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max overflow-y-scroll">
          <DialogTitle>Zone Details</DialogTitle>
          {selectedZone && (
            <ZoneDetailView feature={selectedZone} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
