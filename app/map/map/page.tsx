"use client";

import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
    width: "100%",
    height: "500px",
};

export default function GoogleMapRoute({ dataMock }: any) {
    const [directions, setDirections] = useState<any>(null);

    const data = {
        "pickup": {
            "name": "",
            "phone": "0963",
            "note": "",
            "weight": 0,
            "addressName": "Olympic Market\nផ្លូវលេខ 310\nផ្ទះលេខ 26\nPhnom Penh\nCambodia\nView on Google Maps",
            "latitude": 11.55365645084435,
            "longitude": 104.91125822067261
        },
        "pickupDate": "2026-04-06T08:30:00.000Z",
        "packageId": "6f330bc7-2d14-442b-8c7e-9a510ded7b9f",
        "deliveryPackage": "6f330bc7-2d14-442b-8c7e-9a510ded7b9f",
        "dropOff": [
            {
                "name": "",
                "phone": "0741",
                "note": "",
                "weight": 0,
                "addressName": "Koh Norea River Bank\nHX22+2X\nPhnom Penh\nCambodia\nView on Google Maps",
                "latitude": 11.550103560331582,
                "longitude": 104.952392578125,
                "": null
            }
        ],
        "note": ""
    }

    useEffect(() => {
        if (!window.google) return;
        const directionsService = new google.maps.DirectionsService();
        const pickup = data.pickup;
        const drops = data.dropOff;
        console.log("data::", data);
        directionsService.route(
            {
                origin: {
                    lat: pickup.latitude,
                    lng: pickup.longitude,
                },
                destination: {
                    lat: drops[drops.length - 1].latitude,
                    lng: drops[drops.length - 1].longitude,
                },
                waypoints: drops.slice(0, -1).map((d: any) => ({
                    location: { lat: d.latitude, lng: d.longitude },
                    stopover: true,
                })),
                optimizeWaypoints: true, // 🔥 IMPORTANT
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    setDirections(result);
                }
            }
        );
    }, [data]);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                    lat: data.pickup.latitude,
                    lng: data.pickup.longitude,
                }}
                zoom={13}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
}