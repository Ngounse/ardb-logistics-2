"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

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
    const [address, setAddress] = useState(""); const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
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


    return (
        <>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                // search box to get address

                zoom={16}
                onRightClick={(e) => {
                    console.log("e::", e);
                }}
                onClick={(e) => {
                    const lat = e.latLng!.lat();
                    const lng = e.latLng!.lng();
                    setPosition({ lat, lng });
                    onSelect?.(lat, lng, address);
                    getAddressFromLatLng(e);
                }}
            >
                <Marker position={position} />
            </GoogleMap>
            {/* Show selected address */}
            {/* <div style={{ marginTop: "10px" }}>
                <strong>Selected Address:</strong>
                <p>{address}</p>
            </div> */}
        </>
    );
}
