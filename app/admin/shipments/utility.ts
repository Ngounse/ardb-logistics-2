
export interface ExpressFormData {
    pickup: AddressT
    pickupDate: string
    deliveryPackage: string
    packageId: string
    dropOff: AddressT[]
    note: string
}

export interface ExpressFormDataRes extends ExpressFormData {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    orderType: string
    vehicleTypeId: any
    zones: any
    feeBy: any
    baseFee: number
    totalFee: any
    paymentType: any
    paymentStatus: any
    totalDistance: number
    totalDurationEstimate: number
}

export type DeliveryStatus =
    "PENDING" |
    "ACCEPTED" |
    "PICKUP" |
    "CANCELLED" |
    "DELIVERED" |
    "TRANSIT" |
    "REJECT" |
    "RETURNED" |
    "COMPLETED"

export interface ExpressRes {
    id: string
    note: string
    deliveryPackage: any
    orderType: string
    vehicleTypeId: string
    vehicleTypeFeeAmount: number
    driverId: any
    pickup: AddressInfo
    pickupDate: string
    dropOff: AddressInfo[]
    status: string
    feeBy: string
    baseFee: number
    totalFee: number
    paymentType: string
    totalDistance: number
    totalDurationEstimate: number
    totalDurationDelivery: number
    createdById: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    currency: string
}

export interface ExpressFormConfirmData {
    id: string
    vehicleTypeId: string
    feeBy: string
    paymentType: string
}

export interface AddressT {
    name: string
    phone: string
    note: string
    weight: number
    addressName: string
    latitude: number
    longitude: number
    id?: string
}

export interface ExpressT {
    paymentMethods: any[]
    packages: Package[]
    feeBy: string[]
}

export interface Package {
    code: string
    value: string
}

export interface ExpressParam {
    paymentMethods: string[]
    packages: Package[]
    feeBy: string[]
}

export interface OperatorParam {
    status: string[]
    orderTypes: string[]
}

export interface AddressInfo {
    id: string
    name: string
    note: string
    latitude: number
    longitude: number
    addressName: string
    distance: string
    duration: string
    weight: number
    status: string
    files: any[]
}