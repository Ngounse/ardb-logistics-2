"use client";

import {
    GoogleMap,
    DirectionsRenderer,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
type RoutePoint = {
    city: string;
    coordinates: [number, number];
};

interface Props {
    route: RoutePoint[];
    currentLocation: {
        city: string;
        coordinates: [number, number];
    };
}

const containerStyle = {
    width: "100%",
    height: "450px",
};

export default function ShipmentMap({
    route,
    currentLocation,
}: Props) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY!,
    });

    const [directions, setDirections] =
        useState<google.maps.DirectionsResult>();

    const [delivery, setDelivery] = useState<any>(null);

    useEffect(() => {
        api
            .get("delivery-service/api/v1/delivery/live/a4d03a75-88ca-46fe-9f65-1208a6b41801")
            .then((res) => {
                setDelivery(res.data.data);
            });
    }, []);

    useEffect(() => {
        console.log("delivery::", delivery);
        if (!isLoaded || !delivery) return;

        const service = new google.maps.DirectionsService();

        service.route(
            {
                origin: {
                    lat: delivery.pickup.latitude,
                    lng: delivery.pickup.longitude,
                },
                destination: {
                    lat: delivery.dropOff[0].latitude,
                    lng: delivery.dropOff[0].longitude,
                },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    }, [delivery, isLoaded]);


    if (!isLoaded) return <p>Loading map...</p>;
    if (!delivery) return <p>Loading delivery information...</p>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={13}
            center={{
                lat: delivery.pickup.latitude,
                lng: delivery.pickup.longitude,
            }}
        >
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "#2563eb",
                            strokeWeight: 6,
                        },
                    }}
                />
            )}
            {directions && (
                <DirectionsRenderer directions={directions} />
            )}

            <Marker
                position={{
                    lat: delivery.pickup.latitude,
                    lng: delivery.pickup.longitude,
                }}
                label="P"
            />

            <Marker
                position={{
                    lat: delivery.dropOff[0].latitude,
                    lng: delivery.dropOff[0].longitude,
                }}
                label="D"
            />
        </GoogleMap>
    );
}