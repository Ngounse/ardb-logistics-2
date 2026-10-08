export interface AgentFormData {
    id: string
    agentCode: string
    physicalAddress: string
    city: string
    province: string
    postalCode: string
    country: string
    securityDeposit: number
    latitude: number
    longitude: number
    status: string
    bankName: string
    accountNumber: string
    accountName: string
    commissionType: string
    commisionAmount: number
}

export interface AgentT extends AgentFormData {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}

export interface AgentParams {
    status: string[]
    commissionType: string[]
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

export interface AgentFilters {
    searchQuery: string
    agentStatus: string
    commissionType: string
}

