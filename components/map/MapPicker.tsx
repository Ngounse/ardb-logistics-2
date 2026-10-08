"use client"; // Required for client-side functionality in the Next.js App Router

import { useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places']; // Required for places/geocoding services

const MapPicker = ({ onAddressSelect }: any) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries,
    });

    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const center = useMemo(() => ({ lat: 34.0549, lng: -118.2431 }), []); // Default center

    const handleMapClick = async (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });

        // Use Google Maps Geocoding service to get the address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (!results) return
            if (status === 'OK' && results[0]) {
                // Pass the full address object or a formatted string to a parent component
                onAddressSelect(results[0].formatted_address, { lat, lng });
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    };

    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={10}
            onClick={handleMapClick}
        >
            {markerPosition && <MarkerF position={markerPosition} />}
        </GoogleMap>
    );
};

export default MapPicker;
