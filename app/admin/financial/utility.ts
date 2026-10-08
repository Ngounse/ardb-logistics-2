export type TransactionT = {
    createdById: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    deliveryId: string
    merchantId: string
    agentId: string
    driverId: string
    invoiceId: string
    currency: string
    amount: number
    fee: number
    feeType: string
    commissionAmount: number
    toAccount: string
    description: string
    settlementStatus: string
}

export type TransactionF = {
    deliveryId: string
    invoiceId: string
    settlementStatus: | null | string | undefined
    fromDate: Date | undefined
    toDate: Date | undefined
}

export const SettlementStatus = ['PENDING', 'PROCESSING', 'SETTLED', 'FAILED']