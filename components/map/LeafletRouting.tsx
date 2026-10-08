"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

interface Props {
    from: [number, number];
    to: [number, number];
}

export default function LeafletRouting({ from, to }: Props) {
    useEffect(() => {
        const map = L.map("routing-map").setView(from, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            routeWhileDragging: true,
            show: true,
            addWaypoints: true,
        }).addTo(map);

        return () => {
            map.remove();
        };
    }, [from, to]);

    return <div id="routing-map" className="w-full h-[600px] rounded-xl" />;
}
