export const Status = [
    { key: 'ACTIVE', value: 'Active', boolean: true },
    { key: 'INACTIVE', value: 'Inactive', boolean: false },
];

export interface PersonAddress {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: string
    personId: string
    name: string
    description: string
    address: string
    latitude: number
    longitude: number
}

export interface WalletT {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    id: number
    userId: number
    balance: number
    currency: CurrencyT
    status: string
    description: string
    transactions: any[]
}

export interface CurrencyT {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    code: string
    name: string
    symbol: string
    decimalPlaces: number
    isActive: boolean
    hibernateLazyInitializer: HibernateLazyInitializer
}

export interface ExchangeRateT {
    createdBy: string
    createdAt: any
    updatedBy: string
    updatedAt: any
    id: number
    fromCurrency: CurrencyT
    toCurrency: CurrencyT
    rate: number
    inverseRate: number
    effectiveDate: string
    expiryDate: any
    source: string
    isActive: boolean
    expired: boolean
    currentlyEffective: boolean
}

export interface HibernateLazyInitializer { }