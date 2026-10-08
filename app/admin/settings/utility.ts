export type PersonsPhoto = {
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

export interface UserT {
    id: string | undefined
    email: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    name: string | undefined
    phone: string | undefined
    pin: string | undefined
    confirmPin: string | undefined
    roleIds: number[]
    countryCode: string
    userTypes: string[]
}
