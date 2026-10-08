export interface ZoneT {
    type: string
    features: Feature[]
}

export interface Feature {
    type: string
    geometry: Geometry
    properties: Properties
}

export interface Geometry {
    type: string
    coordinates: number[][][]
}

export interface Properties {
    id: string
    status: boolean
    name: string
    surgeMultiplier: any
    createdAt: string
    createdBy: string
    updatedAt: any
    updatedBy: any
    description: string
}

export interface PolygonCreate {
    type: string
    features: Feature[]
}

export interface Geometry {
    type: string
    coordinates: number[][][]
}

export interface DriverInZoneT {
    zoneId: string
    driverId: string
    createdAt: string
    createdBy: string
    driverName: string,
    driverPhone: string,
    driverEmail: string,
}

export interface Root {
    type: string
    features: Feature[]
}

export interface Feature {
    type: string
    properties: Properties
    geometry: Geometry
}

export interface Geometry {
    type: string
    coordinates: number[][][]
}