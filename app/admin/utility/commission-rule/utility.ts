export interface CommissionRuleT {
    createdById: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: number
    orderType: string
    commissionType: string
    amount: number
    active: boolean
}

export interface CommissionRuleParam {
    fulfillmentType: [string]
    commissionType: [string]
}

export interface CommissionRuleForm {
    fulfillmentType: string;
    commissionType: string;
    amount: number;
    active: boolean;
}

export type TierPriceParam = {
    tierPriceType: [string]
}

export interface TierPriceT {
    createdById: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: number
    amountFrom: number
    amountTo: number
    amount: number
    tierPriceType: string
    commissionRuleId: number
}

export interface TierPriceForm {
    tierPriceType: string
    amountFrom: number
    amountTo: number
    amount: number
}
