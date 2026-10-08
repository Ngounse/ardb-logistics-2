"use client";

import { Autocomplete, GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
const libraries: ("places")[] = ["places"];

const containerStyle = {
    width: "100%",
    height: "300px",
};

type LocationPickerProps = {
    readonly onSelect?: (
        lat: number,
        lng: number,
        address: string
    ) => void;
    readonly defaultValue?: {
        readonly lat: number;
        readonly lng: number;
        readonly address: string;
    };
};

const defaultCenter = {
    lat: 11.5564, // example: phnom penh latitude
    lng: 104.9282, // example: phnom penh longitude
};

export default function LocationPicker({
    onSelect,
    defaultValue,
}: LocationPickerProps) {
    const [position, setPosition] = useState(
        defaultValue?.lat === 0 && defaultValue?.lng === 0
            ? defaultCenter
            : defaultValue || defaultCenter
    );

    const [address, setAddress] = useState(defaultValue?.address || "");

    const [selectedPlace, setSelectedPlace] = useState<{
        lat: number;
        lng: number;
        name: string | undefined;
    } | null>(null);

    const autocompleteRef =
        useRef<google.maps.places.Autocomplete | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY!,
        libraries,
    });

    if (loadError) return <p>Map failed to load</p>;
    if (!isLoaded) return <p>Loading map...</p>;

    const getAddressFromLatLng = (
        event: google.maps.MapMouseEvent
    ) => {

        // get address from lat lng using google maps geocoding api
        const lat = event.latLng!.lat();
        const lng = event.latLng!.lng();

        console.log("event::", lat, lng, event);

        // const geocoder = new window.google.maps.Geocoder();

        // geocoder.geocode(
        //     { location: { lat, lng } },
        //     (results, status) => {
        //         if (status === "OK" && results?.[0]) {
        //             const formattedAddress =
        //                 results[0].formatted_address;
        //             setAddress(formattedAddress);
        //             if (onSelect) {
        //                 onSelect(lat, lng, formattedAddress);
        //             }
        //         } else {
        //             console.error("Geocoder failed:", status);
        //         }
        //     }
        // );
    };

    const onPlaceChanged = () => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();

        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setPosition({ lat, lng });
        setSelectedPlace({
            lat,
            lng,
            name: place.formatted_address || place.name || "Unknown location",
        });
        const addressName = `${place.name} ${place.formatted_address || ""}`;
        setAddress(addressName);

        // animetion like 2 second to pan to the location
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(16);

        onSelect?.(lat, lng, place.formatted_address ?? "");
    };

    return (
        <div >
            <div>
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
                    <>
                        <Label htmlFor="address">Address</Label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Search in Cambodia..."
                            name="address"
                            className="w-full border rounded-lg px-3 py-2 outline-none"
                        />
                    </>
                </Autocomplete>
            </div>
            <div className="relative z-0">
                <GoogleMap
                    options={{
                        clickableIcons: false,
                    }}
                    mapContainerStyle={containerStyle}
                    center={position}
                    zoom={16}
                    onClick={(e) => {
                        const lat = e.latLng!.lat();
                        const lng = e.latLng!.lng();
                        setPosition({ lat, lng });
                        mapRef.current?.panTo({ lat, lng });
                        getAddressFromLatLng(e);
                        onSelect?.(lat, lng, selectedPlace?.name ?? "");
                    }}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                >

                    {/* {selectedPlace && (
                    <Marker
                        position={{
                            lat: selectedPlace.lat,
                            lng: selectedPlace.lng,
                        }}
                    />
                )} */}
                    <Marker position={position} />
                </GoogleMap>
            </div>
        </div>
    );
}
