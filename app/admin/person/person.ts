export interface PersonParams {
    gender: string[]
    feeType: string[]
    personType: string[]
}

export interface PersonT {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    photo: any
    gender: string
    dateOfBirth: Date
    personType: string[]
    feeType?: string
    feeAmount?: number
    bankAccountNo?: number | null
    photos: Photo[]
}

export type Photo = {
    "id": string,
    "fileName": string,
    "contentType": string,
    "size": number,
} 