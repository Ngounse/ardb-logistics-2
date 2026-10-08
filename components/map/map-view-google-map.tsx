"use client";

import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { forwardRef, useState } from "react";

import type { Shipment } from "./live-shipment-map";

interface MapViewProps {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
  viewMode: "all" | "clusters" | "routes";
  isLoading: boolean;
  theme?: string;
}

const containerStyle = {
  width: "100%",
  height: "600px",
};

export const MapViewGooglemap = forwardRef<any, MapViewProps>(
  ({ shipments, selectedShipment, onShipmentSelect, viewMode }, ref) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const handleLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      if (ref) {
        (ref as any).current = mapInstance; // ✅ attach map instance to mapRef
      }
    };

    const [directions, setDirections] = useState<any>(null);

    const directionsCallback = (response: any) => {
      if (response !== null && response.status === "OK") {
        setDirections(response);
      }
    };

    return (
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 11.566835371084132, lng: 104.90025473998718, }}
          zoom={8}
          onLoad={handleLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* Shipment Markers */}
          {shipments.map((shipment) => (
            <Marker
              key={shipment.id}
              position={{
                lat: shipment.currentLocation.coordinates[1],
                lng: shipment.currentLocation.coordinates[0],
              }}
              onClick={() => onShipmentSelect(shipment)}
            />
          ))}

          {/* Routes */}
          {selectedShipment && viewMode === "routes" && (
            <>
              <DirectionsService
                options={{
                  origin: {
                    lat: selectedShipment.origin.coordinates[1],
                    lng: selectedShipment.origin.coordinates[0],
                  },
                  destination: {
                    lat: selectedShipment.destination.coordinates[1],
                    lng: selectedShipment.destination.coordinates[0],
                  },
                  travelMode:
                    selectedShipment.type === "air"
                      ? google.maps.TravelMode.DRIVING // Air doesn't exist in API
                      : selectedShipment.type === "sea"
                        ? google.maps.TravelMode.DRIVING
                        : selectedShipment.type === "rail"
                          ? google.maps.TravelMode.TRANSIT
                          : google.maps.TravelMode.DRIVING,
                }}
                callback={directionsCallback}
              />

              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    polylineOptions: {
                      strokeColor: "#2563eb",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}
            </>
          )}

        </GoogleMap>
      </LoadScript>
    );
  }
);

MapViewGooglemap.displayName = "MapView";
