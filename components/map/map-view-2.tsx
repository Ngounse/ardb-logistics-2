"use client";

import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
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

export const MapView2 = forwardRef<any, MapViewProps>(
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
          center={{ lat: 20, lng: 0 }}
          zoom={2}
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
          {selectedShipment && (viewMode === "all" || viewMode === "routes") && (
            <>
              <Polyline
                path={[
                  {
                    lat: selectedShipment.origin.coordinates[1],
                    lng: selectedShipment.origin.coordinates[0],
                  },
                  {
                    lat: selectedShipment.currentLocation.coordinates[1],
                    lng: selectedShipment.currentLocation.coordinates[0],
                  },
                ]}
                options={{ strokeColor: "#3b82f6" }}
              />

              <Polyline
                path={[
                  {
                    lat: selectedShipment.currentLocation.coordinates[1],
                    lng: selectedShipment.currentLocation.coordinates[0],
                  },
                  {
                    lat: selectedShipment.destination.coordinates[1],
                    lng: selectedShipment.destination.coordinates[0],
                  },
                ]}
                options={{ strokeColor: "#9ca3af" }}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>
    );
  }
);

MapView2.displayName = "MapView";
