import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function MyMapTiler() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const tokyo = { lng: 104.91489660140819, lat: 11.586757466036202, };
    const zoom = 14;
    maptilersdk.config.apiKey = '8gdV3yKMm3AQ6Rjs42YZ';

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
        if (!mapContainer.current) return; // ensure container exists before initializing

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [tokyo.lng, tokyo.lat],
            zoom: zoom
        });

    }, [tokyo.lng, tokyo.lat, zoom]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />

        </div>
    );
}