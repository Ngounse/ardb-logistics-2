export interface BaseFeeT {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    feeType: string
    baseAmount: number
    note: string
    orderType: string
}

export interface BaseFeeParam {
    feeType: [string]
    orderTypes: [string]
}

export interface BaseFeeHistoryT {
    createdById: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    feeType: string
    baseAmount: number
    note: string
    orderType: string
}
