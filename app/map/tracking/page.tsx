"use client";

import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { Polyline } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const containerStyle = {
    width: "100%",
    height: "600px",
};

const center = {
    lat: 11.55365645084435,
    lng: 104.91125822067261,
};

const libraries: ("places")[] = ["places"];

export default function LiveTrackingMap() {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedLocation, setSelectedLocation] =
        useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<any>(null);
    const [routePath, setRoutePath] = useState<
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

    const handleMapClick = (
        e: google.maps.MapMouseEvent
    ) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setSelectedLocation({ lat, lng });

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode(
            {
                location: { lat, lng },
            },
            (results, status) => {
                if (
                    status === "OK" &&
                    results &&
                    results.length > 0
                ) {
                    console.log(results[0].formatted_address);

                    setSelectedAddress(
                        results[0].formatted_address
                    );
                } else {
                    setSelectedAddress("Address not found");
                }
            }
        );
    };

    // Simulate LIVE tracking
    useEffect(() => {
        // const interval = setInterval(() => {
        //     setDriverPosition((prev) => {
        //         const newLat = prev.lat - 0.0002;
        //         const newLng = prev.lng + 0.0005;

        //         const updated = {
        //             lat: newLat,
        //             lng: newLng,
        //         };

        //         // Move map center
        //         mapRef.current?.panTo(updated);

        //         return updated;
        //     });
        // }, 3000);

        // return () => clearInterval(interval);
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
                onClick={handleMapClick}
            ></GoogleMap>
            {selectedLocation && (
                <Marker position={selectedLocation} />
            )}
            <div className="mt-2">
                <strong>Address:</strong> {selectedAddress}

            </div>
        </LoadScript>
    );
}