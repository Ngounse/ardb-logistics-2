"use client";

import {
    DirectionsRenderer,
    GoogleMap,
    LoadScript,
    Marker,
    Polyline,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const containerStyle = {
    width: "100%",
    height: "600px",
};

const center = {
    lat: 11.55365645084435,
    lng: 104.91125822067261,
};

const libraries: ("places")[] = ["places"];

export default function LiveTrackingMapWebSocket() {
    const mapRef = useRef<google.maps.Map | null>(null);

    const [directions, setDirections] = useState<any>(null);
    const [routePath, setRoutePath] = useState<
        google.maps.LatLngLiteral[]
    >([]);
    const [driverPath, setDriverPath] = useState<
        google.maps.LatLngLiteral[]
    >([]);

    // Driver live position
    const [driverPosition, setDriverPosition] = useState({
        lat: 11.55365645084435,
        lng: 104.91125822067261,
    });

    // Pickup
    const pickup = {
        lat: 11.55365645084435,
        lng: 104.91125822067261,
    };

    // Dropoff
    const destination = {
        lat: 11.535994,
        lng: 104.934609,
    };



    // Create route
    useEffect(() => {
        if (!window.google) return;

        const directionsService =
            new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: pickup,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {

                    const path =
                        result.routes[0].overview_path.map((point) => ({
                            lat: point.lat(),
                            lng: point.lng(),
                        }));

                    setRoutePath(path);
                }
            }
        );
    }, []);

    // Simulate LIVE tracking
    useEffect(() => {
        const socketFactory = () =>
            new SockJS(
                "http://10.0.166.18:8888/logistic-delivery-service/ws"
            );

        const client = new Client({
            webSocketFactory: socketFactory,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("Connected");

            client.subscribe(
                "/topic/delivery/location/5c55ba1e-fcaf-4c30-a6f9-390f8e778bf5",
                (message) => {
                    const data = JSON.parse(message.body);

                    const pos = {
                        lat: Number(data.latitude),
                        lng: Number(data.longitude),
                    };

                    setDriverPosition(pos);
                    setDriverPath((prev) => [...prev, pos]);

                    mapRef.current?.panTo(pos);
                }
            );
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <LoadScript
            googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
            }
            libraries={libraries}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {/* Route */}
                {directions && (
                    <DirectionsRenderer directions={directions}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: "#2563eb",
                                strokeOpacity: 1,
                                strokeWeight: 6,
                            },
                        }} />
                )}

                {/* Pickup */}
                <Marker
                    position={pickup}
                    label="P"
                />

                {/* Destination */}
                <Marker
                    position={destination}
                    label="D"
                />

                {/* Live Driver */}
                <Marker
                    position={driverPosition}
                    label="🚚"
                />

                <Polyline
                    path={routePath}
                    options={{
                        strokeColor: "#1e1b4b",
                        strokeOpacity: 1,
                        strokeWeight: 10,
                        zIndex: 1,
                    }}
                />

                <Polyline
                    path={routePath}
                    options={{
                        strokeColor: "#4338ca",
                        strokeOpacity: 1,
                        strokeWeight: 6,
                        zIndex: 2,
                    }}
                />

                <Polyline
                    path={driverPath}
                    options={{
                        strokeColor: "#FF0000",
                        strokeWeight: 5,
                        strokeOpacity: 1,
                    }}
                />

                <Polyline
                    path={[
                        pickup,
                        destination
                    ]}
                    options={{
                        strokeOpacity: 0,
                        icons: [
                            {
                                icon: {
                                    path: "M 0,-1 0,1",
                                    strokeOpacity: 1,
                                    scale: 4,
                                },
                                offset: "0",
                                repeat: "20px",
                            },
                        ],
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
}