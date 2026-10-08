"use client";

import dynamic from "next/dynamic";

const MapLibreMap = dynamic(
    () => import("@/components/map/MapLibreMap"),
    {
        ssr: false,
    }
);

export default function LiveTrackingMap() {

    return (
        <MapLibreMap
            pickup={{
                lat: 11.5564,
                lng: 104.9282,
                label: "Pickup",
                address:
                    "Independence Monument, Phnom Penh, Cambodia",
            }}
            delivery={{
                lat: 11.575,
                lng: 104.922,
                label: "Delivery",
                address:
                    "Phnom Penh, Cambodia",
            }}
            driver={{
                lat: 11.565,
                lng: 104.930,
                label: "Driver",
            }}
            className="h-[500px] w-full rounded-xl"
            route={{
                type: "LineString",
                coordinates: [
                    [104.9282, 11.5564],
                    [104.9301, 11.5580],
                    [104.9350, 11.5620],
                    [104.9220, 11.5750],
                ],
            }}
        />
    )
}