import { PersonT } from "../person"


export interface MerchantT {
    merchantId: string
    shopName: string
    businessType: string
    createdAt: string
    updatedAt: any
    person: PersonT
}

export interface MerchantFormData extends MerchantT {
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: string
    dateOfBirth: string
}

export interface MerchantParams {
    businessType: string[]
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

export interface MerchantFilters {
    shopName: string
    businessType: string
    sort?: string
}

