"use client";

import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const libraries: ("places")[] = ["places"];

export default function GoogleMapRoute() {
    const [directions, setDirections] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);

    const autocompleteRef =
        useRef<google.maps.places.Autocomplete | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    const data = {
        pickup: {
            latitude: 11.55365645084435,
            longitude: 104.91125822067261,
        },
        dropOff: [
            {
                latitude: 11.550103560331582,
                longitude: 104.952392578125,
            },
        ],
    };

    // Route
    useEffect(() => {
        if (!window.google) return;

        const directionsService = new google.maps.DirectionsService();

        const pickup = data.pickup;
        const drops = data.dropOff;

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
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    }, []);

    // Search select
    const onPlaceChanged = () => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();

        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setSelectedPlace({
            lat,
            lng,
            name: place.formatted_address,
        });

        mapRef.current?.panTo({ lat, lng });
    };

    // Click on map
    const handleMapClick = async (
        e: google.maps.MapMouseEvent
    ) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Reverse Geocoding
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
                    setSelectedPlace({
                        lat,
                        lng,
                        name: results[0].formatted_address,
                    });

                    console.log({
                        lat,
                        lng,
                        place: results[0].formatted_address,
                    });
                } else {
                    setSelectedPlace({
                        lat,
                        lng,
                        name: "Unknown location",
                    });
                }
            }
        );
    };

    return (

        <div className="space-y-4">
            {/* Search */}
            <Autocomplete
                onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={onPlaceChanged}
                options={{
                    componentRestrictions: {
                        country: "kh",
                    },
                }}
            >
                <input
                    type="text"
                    placeholder="Search in Cambodia..."
                    className="w-full border rounded-lg px-4 py-3 outline-none"
                />
            </Autocomplete>

            {/* Map */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                    lat: data.pickup.latitude,
                    lng: data.pickup.longitude,
                }}
                zoom={13}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onClick={handleMapClick}
            >
                {/* Route */}
                {directions && (
                    <DirectionsRenderer directions={directions} />
                )}

                {/* Marker */}
                {selectedPlace && (
                    <Marker
                        position={{
                            lat: selectedPlace.lat,
                            lng: selectedPlace.lng,
                        }}
                    />
                )}
            </GoogleMap>

            {/* Selected Location Info */}
            {selectedPlace && (
                <div className="p-4 border rounded-lg space-y-2">
                    <div>
                        <strong>Place:</strong>{" "}
                        {selectedPlace.name}
                    </div>

                    <div>
                        <strong>Latitude:</strong>{" "}
                        {selectedPlace.lat}
                    </div>

                    <div>
                        <strong>Longitude:</strong>{" "}
                        {selectedPlace.lng}
                    </div>
                </div>
            )}
        </div>
    );
}