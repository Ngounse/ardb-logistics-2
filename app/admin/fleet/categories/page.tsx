"use client";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { MyCancel, MyClose, MyHashID, MyRequired, MySave, MySubstring } from "@/components/myFunction";
import { FormatByOrderType } from "@/components/OrderType";
import PermissionGuard from "@/components/PermissionGuard";
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
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Printer,
  RefreshCw,
  Trash2
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { VehicleParam } from "../vehicles/utility";
import { CategoryT } from "./utility";

// Mock data for vehicles
export default function CategoryListPage() {
  const title = "Vehicle Category";
  const urlCatogory = `vehicle-service/api/v1/vehicle-category`;
  const url = `vehicle-service/api/v1/vehicle`;
  const [vehicleParam, setVehicleParam] = useState<VehicleParam>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryT>();
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [category, setCategory] = useState<CategoryT[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategory();
    vehicleParamData();
  }, []);

  const getCategory = () => {
    setIsRefreshing(true);
    api.get(`${urlCatogory}`, { params: {} }).then((res) => {
      const d: CategoryT[] = res.data.data;
      setCategory(d);
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
    getCategory();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    api.post(`${urlCatogory}`, data).then((response) => {
      getCategory();
      setShowAddVehicle(false);
    });
  };

  const handleSaveChanges = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    api.put(`${urlCatogory}/${selectedCategory?.id}`, data).then((response) => {
      getCategory();
    });
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await api.delete(`${urlCatogory}/${selectedCategory.id}`).then((res) => {
        getCategory();
        setIsDeleteDialogOpen(false);
      });
    } catch (error) {
      console.error("confirmDeleteCategory::", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            Manage and monitor your entire fleet with comprehensive categories.
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
              {/* <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button> */}
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
          <PermissionGuard permission={PERMISSIONS.VEHICLE_CATEGORY_CREATE}>
            <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle} >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add {title}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] sm:h-max">
                <DialogHeader>
                  <DialogTitle>Add New {title} </DialogTitle>
                  <DialogDescription>
                    Enter the details for the new category to add it to your fleet.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id="new-category-form" className="p-2 md:h-[60vh] sm:h-max overflow-y-auto" >
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="name" >Category Name  <MyRequired /></Label>
                    <Input type="string" required id="name" name="name" placeholder="e.g., Tuk Tuk, Moto ,SUV" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee-type">Fee Type  <MyRequired /></Label>
                    <Select required defaultValue={vehicleParam?.feeType[0]} name="feeType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenor type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleParam?.feeType.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="feeAmount">Fee Amount  <MyRequired /></Label>
                    <Input type="number" required id="feeAmount" name="feeAmount" placeholder="e.g., 100" />
                  </div>
                  <div className="space-y-2 ">
                    <div className="col-span-3 space-y-2">
                      <Label htmlFor="note">Description</Label>
                      <Textarea
                        id="note"
                        name="note"
                        placeholder="Additional notes about the category..."
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowAddVehicle(false)}
                  >
                    <MyCancel />
                  </Button>
                  <Button type="submit" form="new-category-form" >
                    <MySave />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      {/* Vehicle Table */}
      <Card>
        <CardContent>
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow >
                <TableHead className="w-[50px] text-center">Nº</TableHead>
                <TableHead className="w-[50px]  text-center">ID</TableHead>
                <TableHead className="w-[140px] ">Name</TableHead>
                <TableHead className="w-[140px] text-center">Amount</TableHead>
                <TableHead className="text-center">Vehicle Count</TableHead>
                <TableHead className="w-[140px] text-center">Status</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <MyNoItemTableRow colSpan={7} key={"category"} name="category" items={category} />
              {category.map((category, indedx) => (
                <TableRow key={category.id} onDoubleClick={() => {
                  setSelectedCategory(category);
                  setShowVehicleDetails(true);
                }}>
                  <TableCell className="text-center">
                    {indedx + 1}
                  </TableCell>
                  <TableCell className="">
                    {MyHashID(category.id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex  items-center gap-2">
                      <MySubstring item={category.name} substring={50} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right lg:table-cell">
                    {FormatByOrderType(category.feeAmount, category.feeType)}
                  </TableCell>
                  <TableCell className="text-center lg:table-cell">
                    {category.vehicleCount}
                  </TableCell>
                  <TableCell className="text-right lg:table-cell">
                    {CStatusBadge(category.status)}
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
                              setSelectedCategory(category);
                              setShowVehicleDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <PermissionGuard permission={PERMISSIONS.VEHICLE_CATEGORY_UPDATE}>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowEditVehicle(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                          </PermissionGuard>
                          <PermissionGuard permission={PERMISSIONS.VEHICLE_CATEGORY_DELETE}>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={(e) => {
                              e.preventDefault();
                              setSelectedCategory(category)
                              setIsDeleteDialogOpen(true);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Item
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
        </CardContent>
      </Card>

      <Dialog open={showVehicleDetails} onOpenChange={setShowVehicleDetails}>
        <DialogContent className="max-w-2xl sm:h-max   ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6 py-4 h-[70vh] overflow-y-auto pr-2">

              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">{title} Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Category ID
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {selectedCategory.id}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Category Name
                      </td>
                      <td className="px-4 py-3">
                        {selectedCategory.name}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Description
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {selectedCategory.note}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Fee Type
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {selectedCategory.feeType}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Fee Amount
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {FormatByOrderType(selectedCategory.feeAmount, selectedCategory.feeType)}
                      </td>
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Status
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {CStatusBadge(selectedCategory.status)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Audit Information */}
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h3 className="font-semibold">Audit Information</h3>
                </div>

                <table className="w-full text-sm">
                  <thead><tr><th></th></tr><tr><th></th></tr></thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 bg-muted/30 px-4 py-3 font-medium">
                        Created By
                      </td>
                      <td className="px-4 py-3">
                        <div>{selectedCategory.createdBy}</div>
                        <div className="text-xs text-muted-foreground">
                          {FormatTimestamp(selectedCategory.createdAt)}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="bg-muted/30 px-4 py-3 font-medium">
                        Updated By
                      </td>
                      <td className="px-4 py-3">
                        <div>{selectedCategory.updatedBy}</div>
                        <div className="text-xs text-muted-foreground">
                          {FormatTimestamp(selectedCategory.updatedAt)}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowVehicleDetails(false)}
            >
              <MyClose />
            </Button>
            <Button
              onClick={() => {
                setShowVehicleDetails(false);
                setShowEditVehicle(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit {title}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditVehicle} onOpenChange={setShowEditVehicle}>
        <DialogContent className="max-w-3xl h-[70vh] sm:h-max overflow-y-auto">
          <form onSubmit={handleSaveChanges}>
            <DialogHeader>
              <DialogTitle>Edit Category - {selectedCategory?.name}</DialogTitle>
              <DialogDescription>
                Update the category information and settings.
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 py-4">
                <Input id="id" type="hidden" name="id" value={selectedCategory.id} />
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input type="string" id="edit-name" name="name" defaultValue={selectedCategory.name} placeholder="e.g., Flat Fee" />

                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fee-type">Fee Type</Label>
                  <Select defaultValue={selectedCategory.feeType} name="feeType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleParam?.feeType.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="edit-feeAmount">Fee Amount</Label>
                  <Input type="number" id="edit-feeAmount" name="feeAmount" defaultValue={selectedCategory.feeAmount} placeholder="e.g., 100" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-note">Description</Label>
                  <Textarea
                    id="edit-note"
                    name="note"
                    defaultValue={selectedCategory.note}
                    placeholder="Additional notes about the category..."
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

      {/* Delete Item Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteCategory}
        loading={isSubmitting}
        itemName={selectedCategory?.name}
      >
        {selectedCategory && (
          <div className="mt-4 rounded-lg border p-4">
            <h3 className="font-medium">{title} Details</h3>

            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2">
                <span>ID:</span>
                <span>{selectedCategory.id}</span>
              </div>

              <div className="flex gap-2">
                <span>Name:</span>
                <span>{selectedCategory.name}</span>
              </div>

              <div className="flex gap-2">
                <span>Fee Amount:</span>
                <span>{selectedCategory.feeAmount}</span>
              </div>
            </div>
          </div>
        )}
      </DeleteConfirmDialog>
    </div>
  );
}
