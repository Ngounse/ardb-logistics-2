"use client";
import GoogleMapRoute from "@/components/map/GoogleMapRoute";
import LocationPicker from "@/components/MapPicker";
import { MyCancel, MyClose, MyHashID } from "@/components/myFunction";
import { MyPagination } from "@/components/Pagination";
import { ShipmentDetails } from "@/components/shipments/shipment-details";
import { ShipmentCard } from "@/components/shipments/shipmentsComponent/shipment-card";
import { ShipmentFiltersComponent } from "@/components/shipments/shipmentsComponent/shipment-filters";
import { ShipmentStatsCard } from "@/components/shipments/shipmentsComponent/shipment-stats-card";
import { ShipmentTypeIcon } from "@/components/shipments/shipmentsComponent/shipment-type-icon";
import { ShipmentTableRow } from "@/components/shipments/shipmentsComponent/shipments-table-row";
import {
  Shipment,
  ShipmentFilters,
  ShipmentStats,
} from "@/components/shipments/types/shipment";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { MyNoItemTableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { CalculatDistance, FormatDistance, FormatDuration } from "@/lib/function";
import { PagingT } from "@/lib/response";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Building2,
  Check,
  DollarSign,
  Edit,
  FileText,
  MapPin,
  Package,
  Plane,
  Plus,
  RefreshCw,
  Ship,
  Timer,
  Train,
  Trash2,
  Truck,
  User,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { VehicleParam } from "../fleet/vehicles/utility";
import { ExpressFormConfirmData, ExpressFormData, ExpressFormDataRes, ExpressParam, ExpressRes, ExpressT, OperatorParam } from "./utility";

export default function ShipmentsPage() {
  const url = `delivery-service/api/v1/express`;
  const urlOperator = `delivery-service/api/v1/operator`;
  const urlVehicle = `vehicle-service/api/v1/vehicle`;
  // State for filters and pagination
  const [filters, setFilters] = useState<ShipmentFilters>({
    searchQuery: "",
    statusFilter: "all",
    typeFilter: "all",
    priorityFilter: "all",
    carrierFilter: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    createdById: "",
    driverId: "",
  });

  const [vehicleParam, setVehicleParam] = useState<VehicleParam>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PagingT<ExpressRes> | null>(null);
  const [pageSize, setPageSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 20);
  const [page, setPage] = useState(0);

  const [expressT, setExpressT] = useState<ExpressT>();
  const [expressParam, setExpressParam] = useState<ExpressParam>();
  const [operatorParam, setOperatorParam] = useState<OperatorParam>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [mockShipments, setMockShipments] = useState<Shipment[]>([]);
  const [formData, setFormData] = useState<ExpressFormData>({
    pickup: {
      name: "",
      phone: "",
      note: "",
      weight: 0,
      addressName: "",
      latitude: 0,
      longitude: 0,
    },
    pickupDate: "",
    packageId: "",
    deliveryPackage: "",
    dropOff: [{
      name: "",
      phone: "",
      note: "",
      weight: 0,
      addressName: "",
      latitude: 0,
      longitude: 0,
    }],
    note: "",
  });
  const [expressFormConfirmData, setExpressFormConfirmData] = useState<ExpressFormConfirmData>({
    id: "",
    vehicleTypeId: "",
    feeBy: "",
    paymentType: "COD"
  });

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expressQuote, setExpressQuote] = useState<ExpressFormDataRes>()
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 500);
    setPage(0);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // const updateFormData = (
  //   section: keyof ExpressFormData,
  //   field: string,
  //   value: any,
  // ) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [section]: {
  //       // ...prev[section],
  //       [field]: value,
  //     },
  //   }));
  // };
  // Shipment statistics
  const shipmentStats: ShipmentStats = {
    total: pagination?.totalElements || 0,
    inTransit: mockShipments.filter((s) => s.status == "TRANSIT").length,
    accepted: mockShipments.filter((s) => s.status == "ACCEPTED").length,
    delivered: mockShipments.filter((s) => s.status == "DELIVERED").length,
    pending: mockShipments.filter((s) => s.status == "PENDING").length,
    delayed: mockShipments.filter((s) => s.status == "DELAYED").length,
    cancelled: mockShipments.filter((s) => s.status == "CANCELLED").length,
    totalWeight: mockShipments.reduce((sum, s) => sum + s.weight, 0),
    totalValue: mockShipments.reduce((sum, s) => sum + s.value, 0),
    totalItems: mockShipments.reduce((sum, s) => sum + s.items, 0),
  };

  const updateFormData = (field: keyof ExpressFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const updateConfirmData = (field: keyof ExpressFormConfirmData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }
  useEffect(() => {
    getAllParam();
    vehicleParamData();
    getOrderList();
  }, []);

  const getAllParam = () => {
    api.get(`${url}/param`).then((res) => {
      const d: ExpressParam = res.data.data;
      console.log(d, "ExpressParam::");
      setExpressParam(d);
      setExpressFormConfirmData((prev) => ({ ...prev, feeBy: d.feeBy[0] }));
      setFormData((prev) => ({ ...prev, deliveryPackage: d.packages[0]?.code }));
      formData.packageId = d.packages[0]?.code;
    })
    api.get(`${urlOperator}/param`).then((res) => {
      const d: OperatorParam = res.data.data;
      setOperatorParam(d);
    })
  }

  const updateRootField = <K extends keyof ExpressFormData>(
    key: K,
    value: ExpressFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePickupField = (
    field: keyof ExpressFormData["pickup"],
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      pickup: {
        ...prev.pickup,
        [field]: value,
      },
    }));
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort shipments
  const filteredShipments = mockShipments
    .filter((shipment) => {
      // Search query filter

      // Status filter
      if (
        filters.statusFilter &&
        filters.statusFilter !== "all" &&
        shipment.status !== filters.statusFilter
      ) {
        return false;
      }

      // Type filter
      if (
        filters.typeFilter &&
        filters.typeFilter !== "all" &&
        shipment.type !== filters.typeFilter
      ) {
        return false;
      }

      // Priority filter
      if (
        filters.priorityFilter &&
        filters.priorityFilter !== "all" &&
        shipment.priority !== filters.priorityFilter
      ) {
        return false;
      }

      // Carrier filter
      if (
        filters.carrierFilter &&
        filters.carrierFilter !== "all" &&
        shipment.carrier !== filters.carrierFilter
      ) {
        return false;
      }

      // Date range filter
      if (
        filters.dateRange.from &&
        new Date(shipment.departureDate) < filters.dateRange.from
      ) {
        return false;
      }

      if (filters.dateRange.to) {
        const toDateEnd = new Date(filters.dateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (new Date(shipment.departureDate) > toDateEnd) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by field
      let comparison = 0;

      switch (sortField) {
        case "id":
          comparison = a.id?.localeCompare(b.id);
          break;
        case "customer":
          comparison = a.customer?.localeCompare(b.customer);
          break;
        case "origin":
          comparison = a.origin?.localeCompare(b.origin);
          break;
        case "destination":
          comparison = a.destination?.localeCompare(b.destination);
          break;
        case "departureDate":
          comparison =
            new Date(a.departureDate).getTime() -
            new Date(b.departureDate).getTime();
          break;
        case "estimatedArrival":
          comparison =
            new Date(a.estimatedArrival).getTime() -
            new Date(b.estimatedArrival).getTime();
          break;
        case "status":
          comparison = a.status?.localeCompare(b.status);
          break;
        case "priority":
          comparison = a.priority?.localeCompare(b.priority);
          break;
        case "weight":
          comparison = a.weight - b.weight;
          break;
        case "value":
          comparison = a.value - b.value;
          break;
        default:
          comparison = a.id?.localeCompare(b.id);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Paginate shipments
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const invalidCreated =
      filters.createdById.length > 0 &&
      filters.createdById.length < 36;

    const invalidDriver =
      filters.driverId.length > 0 &&
      filters.driverId.length < 36;

    if (invalidCreated || invalidDriver) {
      return; // Don't call API yet
    }

    getOrderList();
  }, [
    debouncedSearch,
    filters.statusFilter,
    filters.typeFilter,
    filters.priorityFilter,
    filters.carrierFilter,
    filters.createdById,
    filters.driverId,
    filters.dateRange.from,
    filters.dateRange.to,
    page,
    pageSize,
    sortDirection
  ]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    getOrderList();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getOrderList = () => {
    api.get(`${urlOperator}`, {
      params: {
        page, size: pageSize,
        deliveryId: debouncedSearch || undefined,
        deliveryStatus: filters.statusFilter !== "all" ? filters.statusFilter.toUpperCase() : undefined,
        orderTypes:
          filters.priorityFilter !== "all"
            ? filters.priorityFilter.toUpperCase()
            : undefined,
        createdById: filters.createdById || undefined,
        driverId: filters.driverId || undefined,
        sort: 'orderType,' + sortDirection
      }
    }).then((res) => {
      // setMockShipments(res.data.result);
      const d: PagingT<ExpressRes> = res.data.data;
      setPagination(d);
      let _list: Shipment[] = [];
      for (const express of d.result) {

        // const allowedStatuses = operatorParam?.status.map(s => s) || [];
        // const statusValue = (express.status && allowedStatuses.includes(express.status as unknown as string)) ? express.status as unknown as any : "UNKNOWN"; 

        let shipment: Shipment = {
          ...express,
          id: express.id,
          trackingNumber: express.id,
          customer: express?.createdBy,
          origin: express?.pickup.name,
          destination: express?.dropOff[0]?.name,
          departureDate: express.pickupDate,
          estimatedArrival: express.totalDurationEstimate.toString(),
          status: express?.status,
          priority: express?.orderType,
          type: "road",
          carrier: express.driverId,
          weight: express.dropOff[0]?.weight ?? 0,
          items: express.dropOff.length,
          value: express.totalFee,
          progress: 1,
          lastUpdated: express.updatedAt,
          currency: express.currency ?? "",
        }
        _list.push(shipment)
      }
      setMockShipments(_list)
    });
  };

  const vehicleParamData = async () => {
    await api.get(`${urlVehicle}/param`).then((res) => {
      const d: VehicleParam = res.data.data;
      setVehicleParam(d);
    });
  };

  const formatForInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      statusFilter: "all",
      typeFilter: "all",
      priorityFilter: "all",
      carrierFilter: "all",
      dateRange: { from: undefined, to: undefined },
      createdById: "",
      driverId: "",
    });
  };

  const [vehicleEstimate, setVehicleEstimate] = useState(0)


  // Toggle select all shipments
  const toggleSelectAll = () => {
    if (selectedShipments.length === paginatedShipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(paginatedShipments.map((s) => s.id));
    }
  };

  // Toggle select shipment
  const toggleSelectShipment = (id: string) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((s) => s !== id));
    } else {
      setSelectedShipments([...selectedShipments, id]);
    }
  };

  // Effect to reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle view shipment details
  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsViewDialogOpen(true);
  };

  // Handle edit shipment
  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditDialogOpen(true);
  };

  // Handle duplicate shipment
  const handleDuplicateShipment = (shipment: Shipment) => {
    alert(`Duplicated shipment: ${shipment.id}`);
  };

  // Handle delete shipment
  const handleDeleteShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete shipment
  const confirmDeleteShipment = () => {
    if (!selectedShipment) return;
    setIsDeleteDialogOpen(false);
    setSelectedShipment(null);
    alert(`Deleted shipment: ${selectedShipment.id}`);
  };

  const updateDropOffField = (index: number, field: string, value: any, latLng?: { lat: number; lng: number }) => {
    const updated = [...formData.dropOff];
    updated[index] = {
      ...updated[index],
      [field]: value,
      ...(latLng && { latitude: latLng.lat, longitude: latLng.lng }),
    };

    setFormData({
      ...formData,
      dropOff: updated,
    });
  };

  const removeDropOff = (index: any) => {
    const updated = formData.dropOff.filter((_, i) => i !== index);
    setFormData({ ...formData, dropOff: updated });
  };

  const addDropOff = () => {
    setFormData({
      ...formData,
      dropOff: [
        ...formData.dropOff,
        {
          id: crypto.randomUUID(), // ✅ unique key
          name: "",
          phone: "",
          weight: 0,
          note: "",
          latitude: 0,
          longitude: 0,
          addressName: "",
        },
      ],
    });
  };

  const onChangeFeeBy = (value: string) => {
    updateConfirmData("feeBy", value);
  }

  const handelStatusChange = (value: string) => {
    api.put(`${urlOperator}`, {
      "deliveryId": selectedShipment?.id,
      "deliveryStatus": value
    }).then((res) => {
      const { data } = res.data;
      let _status = data.status;
      setMockShipments((prev) =>
        prev.map((shipment) => shipment.id === data.id ? { ...shipment, status: _status } : shipment))
    }).catch()
  }

  function ToggleGroup({ options, value, onChange }: { options: string[], value: string, onChange: (value: string) => void }) {
    return (
      <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`px-4 py-2 text-sm font-medium transition
            ${value === item
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }

  const FormatForInput = (date: any) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  // TODO: create pickup, drop-off
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="py-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupName">Name *</Label>
                <Input
                  id="pickupName"
                  value={formData.pickup.name}
                  onChange={(e) => updatePickupField("name", e.target.value)}
                  placeholder="Enter name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors["pickup.name"] && (
                  <p className="text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupPhone">Phone *</Label>
                <Input
                  id="pickupPhone"
                  value={formData.pickup.phone}
                  onChange={(e) => updatePickupField("phone", e.target.value)}
                  placeholder="Enter phone"
                  className={errors["pickup.phone"] ? "border-red-500" : ""}
                />
                {errors["pickup.phone"] && (
                  <p className="text-sm text-red-500">{errors["pickup.phone"]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupWeight">Weight *</Label>
                <Input
                  id="pickupWeight"
                  value={formData.pickup.weight}
                  onChange={(e) => updatePickupField("weight", e.target.value)}
                  placeholder="Enter weight"
                  className={errors["pickup.weight"] ? "border-red-500" : ""}
                />
                {errors["pickup.weight"] && (
                  <p className="text-sm text-red-500">{errors["pickup.weight"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupNote">Note</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => updatePickupField("note", e.target.value)}
                  placeholder="Auto-generated or custom ID"
                />
                {errors["pickup.note"] && (
                  <p className="text-sm text-red-500">{errors["pickup.note"]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressName">AddressName</Label>
              <Textarea
                id="addressName"
                value={formData.pickup.addressName}
                name="addressName"
                onChange={(e) => updatePickupField("addressName", e.target.value)}
                placeholder="Brief description of the company and its services"
                rows={4}
              />
            </div>

            <div>
              <LocationPicker
                onSelect={(lat, lng, address) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  updatePickupField("latitude", lat);
                  updatePickupField("longitude", lng);
                  updatePickupField("addressName", address)
                }}
                defaultValue={{ lat: formData.pickup.latitude, lng: formData.pickup.longitude, address: formData.pickup.addressName }}
              />

              {latitude && longitude && (
                <p className="text-sm text-muted-foreground">
                  Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date * </Label>
                  <Input
                    id="pickupDate"
                    type="datetime-local"
                    value={formData.pickupDate ? formatForInput(formData.pickupDate) : FormatForInput(new Date())}
                    onChange={(e) => {
                      const localValue = e.target.value;
                      updateFormData("pickupDate", new Date(localValue).toISOString());
                    }}
                    placeholder="Enter pickup date"
                    className={errors.pickupDate ? "border-red-500" : ""}
                  />
                  {errors.pickupDate && <p className="text-sm text-red-500">{errors.pickupDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryPackages">Delivery Package</Label>
                  <Select name="packages"
                    defaultValue={expressParam?.packages[0].code || formData.deliveryPackage}
                    onValueChange={(value) => {
                      updateFormData("packageId", value);
                      setFormData((prev) => ({ ...prev, deliveryPackage: value }));
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packages" />
                    </SelectTrigger>
                    <SelectContent>
                      {expressParam?.packages.map((pkg) => (
                        <SelectItem key={pkg.code} value={pkg.code}>
                          {pkg.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="deliveryNote">Note</Label>
                  <Input
                    id="deliveryNote"
                    value={formData.note}
                    onChange={(e) => updateFormData("note", e.target.value)}
                    placeholder="Auto-generated "
                  />
                </div>
              </div>
            </div>

            <Separator />
          </div>
        )

      case 3:
        return (
          <React.Fragment>
            {formData.dropOff.map((drop, index) => (
              <div key={drop.id} className="py-4 space-y-3">
                <div className="flex items-start align-items justify-between py-0">
                  <h4 className="text-md font-medium flex items-center gap-2 py-0">
                    <MapPin /> Drop Off {index + 1}
                  </h4>
                  {formData.dropOff.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeDropOff(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`dropName-${index}`}>Name</Label>
                    <Input
                      id={`dropName-${index}`}
                      value={drop.name}
                      onChange={(e) => updateDropOffField(index, "name", e.target.value)}
                      placeholder="Enter name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors["drop.name"] && (
                      <p className="text-sm text-red-500">{errors["drop.name"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`dropPhone-${index}`}>Phone *</Label>
                    <Input
                      id={`dropPhone-${index}`}
                      required
                      value={drop.phone}
                      onChange={(e) => updateDropOffField(index, "phone", e.target.value)}
                      placeholder="Enter phone"
                      className={errors["drop.phone"] ? "border-red-500" : ""}
                    />
                    {errors["drop.phone"] && (
                      <p className="text-sm text-red-500">{errors["drop.phone"]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`dropWeight-${index}`}>Weight *</Label>
                    <Input
                      id={`dropWeight-${index}`}
                      value={drop.weight}
                      onChange={(e) => updateDropOffField(index, "weight", e.target.value)}
                      placeholder="Enter weight"
                      className={errors["drop.weight"] ? "border-red-500" : ""}
                    />
                    {errors["drop.weight"] && (
                      <p className="text-sm text-red-500">{errors["drop.weight"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`dropNote-${index}`}>Note</Label>
                    <Input
                      id={`dropNote-${index}`}
                      value={drop.note}
                      onChange={(e) => updateDropOffField(index, "note", e.target.value)}
                      placeholder="Auto-generated or custom ID"
                    />
                    {errors["drop.note"] && (
                      <p className="text-sm text-red-500">{errors["drop.note"]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dropAddressName-${index}`}>AddressName</Label>
                  <Textarea
                    id={`dropAddressName-${index}`}
                    value={drop.addressName}
                    name="addressName"
                    onChange={(e) => updateDropOffField(index, "addressName", e.target.value)}
                    placeholder="Road, #house, Sangkat, Khan "
                    rows={1}
                  />
                </div>

                <div className="grid ">
                  <LocationPicker
                    onSelect={(lat, lng, address) => {
                      setLatitude(lat);
                      setLongitude(lng);
                      updateDropOffField(index, "addressName", address)
                      updateDropOffField(index, "", null, { lat, lng });
                    }}
                    defaultValue={{ lat: drop.latitude, lng: drop.longitude, address: drop.addressName }}
                  />

                  {latitude && longitude && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  )}
                </div>
                <Separator />
              </div>
            ))}

            <Button variant="outline" onClick={addDropOff} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Drop Off
            </Button>
            {/* {formData.dropOff.map((drop, index) => (
              
            ))} */}

          </React.Fragment>)

      case 4:
        return (
          <div>
            {/* <MapPicker2 /> */}
            {/* <MapPreview data={formData} /> */}
            444
            <GoogleMapRoute data={formData} />
            444
          </div>
        )

      case 5: return (
        <div>
          <div className=" mx-auto space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Select Vehicle *</h2>
              {
                vehicleParam?.category.map((item) => {
                  const isSelected = selectedCategoryId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(item.id);
                        setVehicleEstimate(item.feeAmount);
                        expressFormConfirmData.vehicleTypeId = item.id;
                      }}
                      className={`w-full text-left flex items-center gap-4 shadow-bottom p-4 cursor-pointer transition
                            ${isSelected ? "bg-green-50 border border-green-500" : "bg-white hover:bg-gray-50 border-b"}  `}
                    >
                      {/*
                      // setExpressFormConfirmData( {vehicleTypeId : item.id, ...} )
                       */}
                      <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl text-2xl">
                        🚚
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}{" "}
                          <span className="text-gray-500">
                            {expressQuote &&
                              new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(CalculatDistance(expressQuote.totalDistance)) * item.feeAmount + Number(expressQuote.baseFee ?? 0))}៛
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">N/A</p>
                      </div>
                    </button>
                  );
                })
              }
            </div>

            <div className=" mx-auto space-y-4">

              {/* Trip Details Card */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Trip Details</h2>

                {/* Pickup */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-green-500">📍</span>
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formData.pickup.addressName || "No address provided"}
                    </p>
                  </div>
                </div>

                {formData.dropOff.map((drop, index) => (
                  <div key={drop.id} className="flex items-start gap-3 mb-3">
                    <span className="text-red-500">📍</span>
                    <div>
                      <p className="text-sm text-gray-500">Delivery</p>
                      <p className="text-sm font-medium text-gray-800">
                        {drop.addressName || "No address provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                {/* Date */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-blue-500">📅</span>
                  <div>
                    <p className="text-sm text-gray-500">Pickup Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formData.pickupDate ? new Date(formData.pickupDate).toLocaleString() : "No date provided"}
                    </p>
                  </div>
                </div>

                <hr className="my-3" />

                {/* Bottom Row */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-gray-500">Distance</p>
                    <p className="font-semibold"> {expressQuote?.totalDistance && FormatDistance(expressQuote.totalDistance)}</p>
                  </div>
                  {/* Estimated totalDurationEstimate */}
                  <div>
                    <p className="text-gray-500">Total Duration Estimate</p>
                    <p className="font-semibold flex items-center" > <Timer /> {expressQuote?.totalDurationEstimate && FormatDuration(expressQuote.totalDurationEstimate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Fee</p>
                    <p className="font-semibold text-green-600">{expressQuote &&
                      new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(CalculatDistance(expressQuote.totalDistance)) * vehicleEstimate + Number(expressQuote.baseFee ?? 0))
                    }៛</p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-3" />

            {/* Vehicle Cards */}
            {/* {vehicleParam?.category.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-2xl shadow p-4 mb-4"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl text-2xl">
                  🚚
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.name} <span className="text-gray-500">(note {item.feeAmount})</span>
                  </p>
                  <p className="text-sm text-gray-400">N/A</p>
                </div>
              </div>
            ))} */}

            <ToggleGroup
              options={expressParam!.feeBy}
              onChange={(val) => {
                setExpressFormConfirmData((prev) => ({ ...prev, feeBy: val }));
                onChangeFeeBy(val); // optional if you need parent logic
              }} value={expressFormConfirmData.feeBy} />
          </div >
        </div>
      )

      default:
        return null
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.pickup.phone) newErrors["pickup.phone"] = "Phone number is required"
        // if (!formData.businessType) newErrors.businessType = "Business type is required"
        // if (!formData.category) newErrors.category = "Category is required"
        break
      case 2:
        if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required"
        // if (!formData.primaryContactEmail) newErrors.primaryContactEmail = "Primary contact email is required"
        // if (!formData.primaryContactPhone) newErrors.primaryContactPhone = "Primary contact phone is required"
        break
      case 3:
        // if (!formData.dropOff[0]?.phone) newErrors["drop.phone"] = "Phone number is required"
        // const test = '';
        for (let i = 0; i < formData.dropOff.length; i++) {
          if (!formData.dropOff[i]?.phone) newErrors["drop.phone"] = "Phone number is required"
        }
        // if (!formData.streetAddress) newErrors.streetAddress = "Street address is required"
        // if (!formData.city) newErrors.city = "City is required"
        // if (!formData.country) newErrors.country = "Country is required"
        break
      case 4:
        // if (!formData.yearEstablished) newErrors.yearEstablished = "Year established is required"
        break
      case 5:
        // if (formData.services.length === 0) newErrors.services = "At least one service must be selected"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleQuoteSubmit = async () => {
    console.log("click submit quote ::");
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      api.post(`${url}/quote`, formData).then((res) => {
        const _data = res.data.data;
        toast({
          title: "Quote received",
          description: `Estimated distance: ${FormatDistance(_data.totalDistance)}, Estimate: ${FormatDuration(_data.totalDurationEstimate)}`,
        })
        expressFormConfirmData.id = _data.id;
        setExpressQuote(_data)
        nextStep();
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmSubmit = () => {
    if (!validateStep(currentStep)) return
    setIsSubmitting(true)
    api.post(`${url}/confirm`, expressFormConfirmData).then((res) => {
      toast({
        title: "Shipment created",
        description: "The shipment has been successfully created.",
        itemID: res.data.data.id,
      })
    }).finally(() => {
      setIsSubmitting(false)
    })

  }

  return (
    <div>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Shipments</h1>
            <p className="text-muted-foreground">
              Manage and track all shipments across your logistics network
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                {/* <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Shipment
                </Button> */}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1080px] overflow-y-scroll h-[90vh] md:h-max">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new shipment. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Card>
                  {steps[currentStep - 1].title !== "Drop off & Location" && (
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                        {steps[currentStep - 1].title}
                      </CardTitle>
                    </CardHeader>
                  )}
                  <CardContent className="p-3 md:px-6 overflow-auto max-h-[480px]">{renderStepContent()}</CardContent>
                </Card>
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {(() => {
                      if (currentStep == 4) {
                        return (
                          <Button
                            type="submit"
                            onClick={() => {
                              handleQuoteSubmit();
                            }}
                          >
                            {isSubmitting ? "Estimating..." : "Get Quote"}
                          </Button>
                        );
                      }

                      if (currentStep < steps.length) {
                        return (
                          <Button onClick={nextStep} className="flex items-center gap-2">
                            Next
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        );
                      }

                      return (
                        <Button onClick={handleConfirmSubmit} disabled={isSubmitting} className="flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              {isSubmitting ? "Confirming..." : "Confirm Shipment"}
                            </>
                          )}
                        </Button>
                      );
                    })()}
                  </div>
                </div>

              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ShipmentStatsCard stats={shipmentStats} />

        {/* Shipment Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Weight (per page)
                  </p>
                  <p className="text-2xl font-bold">
                    {shipmentStats.totalWeight.toLocaleString()} kg
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Average weight per shipment:{" "}
                  {Math.round(
                    shipmentStats.totalWeight / shipmentStats.totalItems || 1
                  ).toLocaleString()}{" "}
                  kg
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Value (per page)
                  </p>
                  <p className="text-2xl font-bold">
                    {shipmentStats.totalValue.toLocaleString()}៛
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Average value per shipment: ៛
                  {Math.round(
                    shipmentStats.totalValue / shipmentStats.totalItems || 1
                  ).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Items (per page)
                  </p>
                  <p className="text-2xl font-bold">
                    {shipmentStats.totalItems.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <Package className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground">
                  Average items per shipment:{" "}
                  {Math.round(
                    shipmentStats.totalItems / shipmentStats.totalItems || 1
                  ).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ShipmentFiltersComponent
          operatorParam={operatorParam}
          filters={filters}
          showFilters={showFilters}
          viewMode={viewMode}
          onFiltersChange={(newFilters) =>
            setFilters({ ...filters, ...newFilters })
          }
          onShowFiltersToggle={() => setShowFilters(!showFilters)}
          onViewModeChange={setViewMode}
          onClearFilters={clearFilters}
        />

        {/* Shipments Table View */}
        {viewMode === "table" && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Order List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border overflow-auto">
                <Table className="whitespace-nowrap min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">
                        <Checkbox
                          checked={
                            selectedShipments.length ===
                            paginatedShipments.length &&
                            paginatedShipments.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center">
                          ID
                          {sortField === "id" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("customer")}
                      >
                        <div className="flex items-center">
                          Customer
                          {sortField === "customer" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="hidden md:table-cell cursor-pointer"
                        onClick={() => handleSort("origin")}
                      >
                        <div className="flex items-center">
                          Origin
                          {sortField === "origin" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="hidden md:table-cell cursor-pointer"
                        onClick={() => handleSort("destination")}
                      >
                        <div className="flex items-center">
                          Destination
                          {sortField === "destination" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="hidden lg:table-cell cursor-pointer"
                        onClick={() => handleSort("departureDate")}
                      >
                        <div className="flex items-center">
                          Departure
                          {sortField === "departureDate" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="hidden lg:table-cell cursor-pointer"
                        onClick={() => handleSort("estimatedArrival")}
                      >
                        <div className="flex items-center">
                          ETA
                          {sortField === "estimatedArrival" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === "status" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Road Type
                      </TableHead>
                      <TableHead
                        className="hidden lg:table-cell cursor-pointer"
                        onClick={() => handleSort("priority")}
                      >
                        <div className="flex items-center">
                          Order Types
                          {sortField === "priority" && (
                            <ArrowUpDown
                              className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  {mockShipments.length === 0 && (
                    < MyNoItemTableRow colSpan={12} name="No shipments found" items={mockShipments} />
                  )}
                  <TableBody>
                    {mockShipments.map((shipment) => (
                      <ShipmentTableRow
                        key={shipment.id}
                        shipment={shipment}
                        isSelected={selectedShipments.includes(shipment.id)}
                        onSelect={toggleSelectShipment}
                        onView={handleViewShipment}
                        onEdit={handleEditShipment}
                        onDuplicate={handleDuplicateShipment}
                        onDelete={handleDeleteShipment}
                      />
                    ))
                    }
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <MyShowingItem pagination={pagination} />
                  <Select defaultValue={pageSize.toString()}
                    onValueChange={(value) => {
                      setPage(0); // reset to first page
                      setPageSize(Number(value));
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
            </CardContent>
          </Card>
        )}

        {/* Shipments Card View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {paginatedShipments.length > 0 ? (
              paginatedShipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  onView={handleViewShipment}
                  onEdit={handleEditShipment}
                  onDuplicate={handleDuplicateShipment}
                  onDelete={handleDeleteShipment}
                />
              ))
            ) : (
              <div className="col-span-full flex justify-center p-8">
                <div className="text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-2 text-lg font-semibold">
                    No shipments found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              </div>
            )}

            {/* Card View Pagination */}
            <div className="col-span-full  flex justify-center">
              <div className=" flex flex-wrap gap-2 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <MyShowingItem pagination={pagination} />
                  <Select defaultValue={pageSize.toString()}
                    onValueChange={(value) => {
                      setPage(0); // reset to first page
                      setPageSize(Number(value));
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
          </div>
        )}

        {/* Shipments Map View */}
        {viewMode === "map" && (
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Shipment Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-md overflow-hidden border h-[400px] md:h-[500px] lg:h-[600px] bg-[#f8f9fa] dark:bg-[#111827]">
                {/* Simplified world map for demo */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 500"
                  preserveAspectRatio="xMidYMid meet"
                  className="opacity-20 dark:opacity-10"
                >
                  <path
                    d="M215,220 L240,220 L260,200 L280,210 L300,190 L330,190 L350,170 L380,170 L400,150 L430,150 L450,130 L480,130 L500,110 L530,110 L550,130 L580,130 L600,150 L630,150 L650,170 L680,170 L700,190 L730,190 L750,210 L780,210 L800,230 L830,230 L850,250 L880,250 L900,270 L930,270 L950,290 L980,290"
                    fill="none"
                    stroke="#ced4da"
                    strokeWidth="2"
                  />
                  <path
                    d="M215,290 L980,290"
                    fill="none"
                    stroke="#ced4da"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M215,350 L980,350"
                    fill="none"
                    stroke="#ced4da"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                </svg>

                {/* Shipment markers */}
                {paginatedShipments.map((shipment) => {
                  // Simplified coordinates based on origin/destination
                  let x, y;

                  // Very simplified positioning based on location names
                  if (shipment.origin.includes("New York")) {
                    x = 25;
                    y = 30;
                  } else if (shipment.origin.includes("Chicago")) {
                    x = 35;
                    y = 35;
                  } else if (shipment.origin.includes("Los Angeles")) {
                    x = 15;
                    y = 40;
                  } else if (shipment.origin.includes("Miami")) {
                    x = 30;
                    y = 45;
                  } else if (shipment.origin.includes("Shanghai")) {
                    x = 80;
                    y = 35;
                  } else if (shipment.origin.includes("San Francisco")) {
                    x = 15;
                    y = 35;
                  } else {
                    x = 40;
                    y = 40;
                  }

                  // Get status color
                  let color;
                  switch (shipment.status) {
                    case "TRANSIT":
                      color = "text-blue-500 bg-blue-100 dark:bg-blue-900";
                      break;
                    case "DELIVERED":
                      color = "text-green-500 bg-green-100 dark:bg-green-900";
                      break;
                    case "PENDING":
                      color =
                        "text-purple-500 bg-purple-100 dark:bg-purple-900";
                      break;
                    // case "DELAYED":
                    //   color =
                    //     "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
                    //   break;
                    case "CANCELLED":
                      color = "text-red-500 bg-red-100 dark:bg-red-900";
                      break;
                    default:
                      color = "text-gray-500 bg-gray-100 dark:bg-gray-900";
                  }

                  return (
                    <div
                      key={shipment.id}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center cursor-pointer transition-all ${color}`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      title={`${shipment.id}: ${shipment.origin} to ${shipment.destination}`}
                    >
                      <ShipmentTypeIcon type={shipment.type} /> ??
                    </div>
                  );
                })}

                {/* Map legend */}
                <div className="absolute bottom-4 right-4 bg-background border rounded-md p-2 shadow-sm">
                  <div className="text-xs font-medium mb-1">
                    Shipment Status
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">In Transit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Delivered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs">Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">Delayed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-xs">Cancelled</span>
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="text-xs font-medium mb-1">Shipment Type</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span className="text-xs">Road</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      <span className="text-xs">Air</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ship className="h-3 w-3" />
                      <span className="text-xs">Sea</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Train className="h-3 w-3" />
                      <span className="text-xs">Rail</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {/* {selectedShipments.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 z-50 hidden md:flex flex-wrap items-center gap-4">
            <div className="text-sm font-medium">
              {selectedShipments.length} shipments selected
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedShipments([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )} */}
      </div>

      {/* View Shipment Dialog */}
      {selectedShipment && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[1080px] max-h-[90vh] h-max overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Shipment Details</DialogTitle>
              <DialogDescription>
                Detailed information about shipment {MyHashID(selectedShipment.id)}
              </DialogDescription>
            </DialogHeader>
            {/* <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-sm font-medium">Tracking Information</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tracking Number:
                      </span>
                      <span className="font-medium">
                        {selectedShipment.trackingNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>
                        <ShipmentStatusBadge status={selectedShipment.status} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="flex items-center gap-1 capitalize">
                        <ShipmentTypeIcon type={selectedShipment.type} />
                        {selectedShipment.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span>{selectedShipment.carrier}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Customer & Route</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">
                        {selectedShipment.customer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span>{selectedShipment.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Destination:
                      </span>
                      <span>{selectedShipment.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedShipment.status === "TRANSIT" && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Progress</h3>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Shipment Progress</span>
                    <span>{selectedShipment.progress}%</span>
                  </div>
                  <Progress value={selectedShipment.progress} className="h-2" />
                </div>
              )}
            </div> */}
            <ShipmentDetails shipment={selectedShipment} />
            <DialogFooter className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditShipment(selectedShipment)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={() => setIsViewDialogOpen(false)}>
                <MyClose />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Shipment Dialog */}
      {selectedShipment && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] h-max ">
            <DialogHeader>
              <DialogTitle>Shipment Status Edit</DialogTitle>
              <DialogDescription>
                Detailed information about shipment {selectedShipment.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 ">
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <Select name="packages"
                    defaultValue={selectedShipment.status || formData.deliveryPackage}
                    onValueChange={(value) => {
                      handelStatusChange(value)
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packages" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorParam?.status.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-sm font-medium mt-4">Customer & Route</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">
                        {selectedShipment.customer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span>{selectedShipment.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Destination:
                      </span>
                      <span>{selectedShipment.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedShipment.status === "TRANSIT" && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">Progress</h3>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Shipment Progress</span>
                    <span>{selectedShipment.progress}%</span>
                  </div>
                  <Progress value={selectedShipment.progress} className="h-2" />
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-wrap gap-2">
              <Button variant={'outline'} onClick={() => setIsEditDialogOpen(false)}>
                <MyClose />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Shipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shipment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div >
            {selectedShipment && (
              <div className="border rounded-md p-3">
                <div className="font-medium">{MyHashID(selectedShipment.id)}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedShipment.trackingNumber}
                </div>
                <div className="text-sm mt-1">Customer : {selectedShipment.customer}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedShipment.origin} → {selectedShipment.destination}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <MyCancel />
            </Button>
            <Button variant="destructive" onClick={confirmDeleteShipment}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock data for shipments
// const mockShipments: Shipment[] = [
//   {
//     id: "SH-2024-001",
//     trackingNumber: "TRK78901234",
//     customer: "Acme Corporation",
//     origin: "New York, NY",
//     destination: "Los Angeles, CA",
//     departureDate: "2024-05-15T08:00:00",
//     estimatedArrival: "2024-05-18T16:00:00",
//     status: "in-transit",
//     priority: "standard",
//     type: "road",
//     carrier: "ARDB Express",
//     weight: 1250,
//     items: 42,
//     value: 12500,
//     progress: 65,
//     lastUpdated: "2024-05-16T14:30:00",
//   },
// ];

const steps = [
  {
    id: 1,
    title: "Pickup Information",
    description: "Pickup details and basic information",
    icon: Building2,
  },
  {
    id: 2,
    title: "Contact Details",
    description: "Primary and secondary contact information",
    icon: User,
  },
  {
    id: 3,
    title: "Drop off & Location",
    description: "Business address and location details",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Map & Route review",
    description: "Legal and business information",
    icon: FileText,
  },
  {
    id: 5,
    title: "Payment & Services",
    description: "Services offered and capabilities",
    icon: Truck,
  },
]
