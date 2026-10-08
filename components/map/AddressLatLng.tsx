"use client";

import {
    APIProvider,
    Map,
    useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

type PlaceResult = {
    address: string;
    lat: number;
    lng: number;
};

function PlaceAutocomplete({
    onSelect,
}: {
    onSelect: (place: PlaceResult) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputRef.current || !window.google?.maps?.places) return;

        const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            {
                fields: ["formatted_address", "geometry"],
            }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            onSelect({
                address: place.formatted_address || "",
                lat: place.geometry.location?.lat() || 0,
                lng: place.geometry.location?.lng() || 0,
            });
        });
    }, []);

    return (
        <input
            ref={inputRef}
            placeholder="Search location..."
            className="w-full p-2 border rounded"
        />
    );
}

export default function MapPicker2() {
    const [place, setPlace] = useState<PlaceResult | null>(null);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY!}
            libraries={["places"]} // 👈 THIS IS REQUIRED
        >
            <div className="space-y-4">
                <PlaceAutocomplete onSelect={setPlace} />

                {place && (
                    <div className="text-sm">
                        <p><strong>Address:</strong> {place.address}</p>
                        <p>Lat: {place.lat}</p>
                        <p>Lng: {place.lng}</p>
                    </div>
                )}

                <Map
                    style={{ width: "100%", height: "400px" }}
                    defaultCenter={{ lat: 11.5564, lng: 104.9282 }} // Phnom Penh
                    defaultZoom={13}
                />
            </div>
        </APIProvider>
    );
}