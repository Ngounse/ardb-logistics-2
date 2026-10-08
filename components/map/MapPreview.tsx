"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

// Fix default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom colors
const pickupIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
});

const dropIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
});

type Props = {
    data: any;
};

export default function MapPreview({ data }: Props) {
    const pickup = data.pickup;
    const drops = data.dropOff;

    const positions = useMemo(() => {
        return [
            [pickup.latitude, pickup.longitude],
            ...drops.map((d: any) => [d.latitude, d.longitude]),
        ];
    }, [data]);

    return (
        <MapContainer
            center={[pickup.latitude, pickup.longitude]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Pickup */}
            <Marker
                position={[pickup.latitude, pickup.longitude]}
                icon={pickupIcon}
                zIndexOffset={1000}
            >
                <Popup>
                    <b>Pickup</b> <br />
                    {pickup.name}
                </Popup>
            </Marker>

            {/* DropOffs */}
            {drops.map((drop: any, i: number) => (
                <Marker
                    key={i}
                    position={[drop.latitude, drop.longitude]}
                    icon={dropIcon}
                    zIndexOffset={1000}
                >
                    <Popup>
                        <b>Drop {i + 1}</b> <br />
                        {drop.name || "No name"}
                    </Popup>
                </Marker>
            ))}

            {/* Route line */}
            <Polyline positions={positions} />
        </MapContainer>
    );
}