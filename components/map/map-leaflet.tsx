import React, { useEffect, useState, useRef } from "react";
import {
    TileLayer,
    MapContainer,
    LayersControl
} from "react-leaflet";
import L from "leaflet";
// Import the routing machine JS and CSS:
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

// Extend the Leaflet namespace to include Routing
declare module 'leaflet' {
    namespace Routing {
        interface Control extends L.Control {
            addTo(map: L.Map): this;
            setWaypoints(waypoints: L.LatLngExpression[]): this;
        }
        function control(options?: any): Control;
    }
}

const LeafletMap = () => {
    // The map instance:
    const [map, setMap] = useState<L.Map | null>(null);

    // Start-End point for the routing machine
    const [start, setStart] = useState<[number, number]>([38.9072, -77.0369])
    const [end, setEnd] = useState<[number, number]>([37.7749, -122.4194])
    const [routingMachine, setRoutingMachine] = useState<L.Routing.Control | null>(null)

    // Routing machine ref
    const RoutingMachineRef = useRef<L.Routing.Control | null>(null)

    // Create the routing-machine instance:
    useEffect(() => {
        if (!map) return
        if (map) {
            RoutingMachineRef.current = L.Routing.control({
                position: 'topleft',
                lineOptions: {
                    styles: [
                        {
                            color: '#757de8',
                        },
                    ],
                },
                waypoints: [start, end],
            })
            setRoutingMachine(RoutingMachineRef.current)
        }
    }, [map])

    // Set waypoints when start and end points are updated:
    useEffect(() => {
        if (routingMachine && map) {
            routingMachine.addTo(map)
            if (start && end) routingMachine.setWaypoints([start, end])
        }
    }, [routingMachine, start, end])

    // Update start and end points on button click:
    const handleClick = () => {
        if (start[0] === 38.9072) {
            setStart([40.7128, -74.0060])
            setEnd([47.6062, -122.3321])
        }
        if (start[0] === 40.7128) {
            setStart([38.9072, -77.0369])
            setEnd([37.7749, -122.4194])
        }
    }

    return (
        <div className={`h-[600px] map-container `}>
            <MapContainer
                className="h-full w-full"
                center={[37.0902, -95.7129]}
                zoom={3}
                zoomControl={false}
                // Set the map instance to state when ready:
                ref={(mapRef) => {
                    if (mapRef) {
                        setMap(mapRef);
                    }
                }}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Map">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
