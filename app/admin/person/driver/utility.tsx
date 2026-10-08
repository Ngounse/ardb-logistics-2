export interface DriverParams {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    person: Person
    employeeCode: any
    status: string
    driverType: string
    licenseNumber: string
    licenseType: string
    licenseNo: string
    licenseIssueDate: string
    licenseExpiryDate: string
    drivingExperience: number
    accidentCount: number
    violationCount: number
    latitude: number
    longitude: number
    isAvailable: any
    plateNumber: string
    vehicleCategoryName: string
    vehicleType: string
    zone: string
    phone: string
    submittedFrom: string
    personId: string

    driverTmpType: string
    approvalStatus: string
    otp: string
    otpExpire: string
    verifiedExpiration: string
    confirmed: boolean
    firstName: string
    lastName: string
    email: string
    gender: string
    dateOfBirth: string
    bankAccountNo: any
    otpverified: boolean

    vehicleCategoryId: string
    address: string
}

export interface DriverParam {
    driverType: string[]
    licenseType: string[]
    driverStatus: string[]
}

export interface StatusLog {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    becomeDriverId: string
    status: string
    note: string
}

export interface DriverT extends DriverParams {
    person: any
    latitude: any
    longitude: any
}

export interface Registration {
    createdBy: string
    createdAt: string
    updatedBy: any
    updatedAt: any
    id: string
    driverTmpType: string
    approvalStatus: any
    otp: string
    otpExpire: string
    verifiedExpiration: string
    confirmed: boolean
    firstName: any
    lastName: any
    email: any
    phone: string
    gender: any
    dateOfBirth: any
    bankAccountNo: any
    employeeCode: any
    status: any
    driverType: any
    VehicleType: any
    licenseNumber: any
    licenseType: any
    licenseIssueDate: any
    licenseExpiryDate: any
    drivingExperience: any
    accidentCount: any
    violationCount: any
    otpverified: boolean
    submittedFrom: string
}

export interface Person {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    photos: Photo[]
    gender: string
    dateOfBirth: string
    personType: string[]
    bankAccountNo: any
    address: string
}

export type DriverFilters = {
    driverStatus: string | undefined
    driverType: string | undefined
    employeeCode: string | undefined
    licenseNumber: string | undefined
    licenseType: string | undefined
    name: string | undefined
}

export type BecomeFilters = {
    id: string
    personId: string
    licenseNumber: string
    status: string | undefined
}
export interface Photo {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    fileName: string
    objectName: string
    contentType: string
    size: number
    personPhotoId: string
    agentId: any
}

export type RegistrationFilters = {
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: string
    approvalStatus: string
}