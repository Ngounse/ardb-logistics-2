import { Ban, Car, CheckCircle, Clock, Forklift, Package, Truck, Wrench } from "lucide-react"
import { DriverT } from "../drivers/page"

export interface VehicleT extends DriverT {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    driverId: any
    driverName: string
    tenorType: string
    feeType: string
    feeAmount?: number
    mark?: string
    model?: string
    year: string
    licensePlate: string
    vin: string
    color: string
    photo: any
    mileage: number
    purchaseDate: any
    vehicleStatus: string
    categoryId: string

    weight: string
    phone: string
}

export interface VehicleParam {
    status: string[]
    feeType: string[]
    tenor: string[]
    category: Category[]
}

export interface Category {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    name: string
    note: string
    feeType: string
    feeAmount: number
    vehicles: any[]
}


export const vehicleTypeIcons = {
    truck: Truck,
    van: Package,
    car: Car,
    forklift: Forklift,
};

export const statusConfig = {
    active: {
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900",
        label: "Active",
    },
    repair: {
        icon: Wrench,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        label: "Repair",
    },
    available: {
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900",
        label: "Available",
    },
    inactive: {
        icon: Ban,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900",
        label: "Inactive",
    },
};

export interface VehicleFilters {
    driverId: string
    tenorType: string
    licensePlate: string
    vin: string
    vehicleStatus: string
}