"use client";

import { MyCancel, MyCreate, MyRequired } from "@/components/myFunction";
import { Button } from "@/components/ui/button";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UserSelect from "@/components/user/FindUser";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import {
    Plus
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { PersonT } from "../../person/person";
import { VehicleParam } from "./utility";

interface AddVehicleDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly vehicleParam?: VehicleParam;
    readonly onSubmit: (data: Record<string, any>) => Promise<void> | void;
}

export default function AddVehicleDialog({
    open,
    onOpenChange,
    vehicleParam,
    onSubmit,
}: AddVehicleDialogProps) {
    const [selectedPerson, setSelectedPerson] = useState<PersonT | null>(null);
    const [personSearch, setPersonSearch] = useState("");
    const [personList, setPersonList] = useState<PersonT[]>([]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data: Record<string, any> = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (data.driverId == '') {
            toast({
                variant: "destructive",
                title: "Driver",
                description: "Driver is required.",
            });
            return
        }

        await onSubmit(data);

        // Clear selected driver after successful submit
        setSelectedPerson(null);
        setPersonSearch("");
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            findUser();
        }, 380);

        return () => clearTimeout(timer);
    }, [personSearch]);

    const findUser = async () => {
        try {
            const res = await api.get(
                "person-service/api/v1/persons?page=0&size=5",
                {
                    params: { name: personSearch, },
                }
            );
            setPersonList(res.data.data.result);
        } catch (error) {
            console.error("Failed to find users:", error);
            setPersonList([]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={() => setSelectedPerson(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh]">
                <form onSubmit={handleSubmit} className="">
                    <DialogHeader>
                        <DialogTitle>Add New Vehicle</DialogTitle>

                        <DialogDescription>
                            Enter the details for the new vehicle to add it to your fleet.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-4 p-2  md:h-[70vh] sm:h-max overflow-y-auto">

                        <div className="space-y-2 ">
                            <Label htmlFor="driverName">Driver <MyRequired /></Label>

                            <UserSelect
                                value={selectedPerson}
                                onChange={setSelectedPerson}
                                name="driverId"
                                placeholder="Select driver..."
                                required
                            />
                        </div>
                        <Input id="driverId" name="driverId" placeholder="e.g., DRV-001" value={selectedPerson?.id} type="hidden" required />
                        <Input id="driverName" name="driverName" placeholder="e.g.,Phirom" value={`${selectedPerson?.firstName} ${selectedPerson?.lastName}`} type="hidden" required />

                        <div className="space-y-2">
                            <Label htmlFor="tenorType">
                                TenorType
                            </Label>

                            <Select
                                defaultValue="OWN"
                                name="tenorType"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tenor type" />
                                </SelectTrigger>

                                <SelectContent>
                                    {vehicleParam?.tenor?.map((tenor) => (
                                        <SelectItem
                                            key={tenor}
                                            value={tenor}
                                        >
                                            {tenor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">
                                Category
                            </Label>

                            <Select
                                defaultValue={vehicleParam?.category[0]?.id}
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
                            <Label htmlFor="model">
                                Model
                            </Label>

                            <Input
                                id="model"
                                name="model"
                                placeholder="e.g., Honda"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mileage">
                                Mileage <MyRequired />
                            </Label>

                            <Input
                                id="mileage"
                                type="number"
                                name="mileage"
                                required
                                placeholder="e.g., 50000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">
                                Year
                            </Label>

                            <Input
                                id="year"
                                type="number"
                                name="year"
                                placeholder="e.g., 2023"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license-plate">
                                License Plate <MyRequired />
                            </Label>

                            <Input
                                id="license-plate"
                                name="licensePlate"
                                required
                                placeholder="e.g., TRK-004-NY"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">
                                Color <MyRequired />
                            </Label>

                            <Input
                                id="color"
                                name="color"
                                required
                                placeholder="e.g., Red"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">
                                Purchase Date
                            </Label>

                            <Input
                                type="date"
                                id="purchaseDate"
                                name="purchaseDate"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vehicleStatus">
                                Vehicle Status
                            </Label>

                            <Select
                                defaultValue="ACTIVE"
                                name="vehicleStatus"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent>
                                    {vehicleParam?.status?.map((status) => (
                                        <SelectItem
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label htmlFor="vin">
                                VIN
                            </Label>

                            <Input
                                id="vin"
                                name="vin"
                                placeholder="Vehicle Identification Number"
                            />
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label htmlFor="mark">
                                Note
                            </Label>

                            <Textarea
                                id="mark"
                                name="mark"
                                placeholder="Additional notes about the vehicle..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            <MyCancel />
                        </Button>

                        <Button type="submit" >
                            <MyCreate />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}