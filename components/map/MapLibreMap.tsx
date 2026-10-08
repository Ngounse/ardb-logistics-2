"use client";

import {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";

import maplibregl, {
    type Map as MapLibreMapInstance,
    type Marker as MapLibreMarker,
    type GeoJSONSource,
    type LngLatBoundsLike,
    type MapMouseEvent,
} from "maplibre-gl";

import {
    MaplibreTerradrawControl,
} from "@watergis/maplibre-gl-terradraw";

import "maplibre-gl/dist/maplibre-gl.css";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";

import type {
    Feature,
    FeatureCollection,
    Geometry,
    LineString,
    Point,
    Polygon,
} from "geojson";

export type LocationPoint = {
    lat: number;
    lng: number;
    address?: string;
    label?: string;
};

export type ZoneFeature = Feature<Polygon | Geometry>;

export type MapLibreMapRef = {
    getMap: () => MapLibreMapInstance | null;
    fitAll: () => void;
    startDrawing: () => void;
    stopDrawing: () => void;
    getDrawnFeatures: () => FeatureCollection;
};

type MapLibreMapProps = {
    pickup?: LocationPoint;
    delivery?: LocationPoint;
    driver?: LocationPoint;

    /**
     * Route GeoJSON LineString.
     */
    route?: Feature<LineString> | LineString;

    /**
     * Existing zones/polygons.
     */
    zones?: FeatureCollection;

    /**
     * Selected zone when editing.
     */
    selectedFeature?: ZoneFeature | null;

    /**
     * Show drawing controls.
     */
    enableDrawing?: boolean;

    /**
     * Start drawing automatically.
     */
    startDrawing?: boolean;

    /**
     * Called when drawing/editing changes.
     */
    onDrawChange?: (features: FeatureCollection) => void;

    /**
     * Called when map is clicked.
     */
    onMapClick?: (event: MapMouseEvent) => void;

    /**
     * Called when a zone is clicked.
     */
    onZoneClick?: (feature: Feature) => void;

    className?: string;

    center?: [number, number];

    zoom?: number;

    /**
     * MapLibre style URL.
     */
    styleUrl?: string;

    /**
     * Restrict map navigation to Cambodia.
     */
    restrictCambodia?: boolean;
};

const PHNOM_PENH: [number, number] = [
    104.9282,
    11.5564,
];

/**
 * Approximate Cambodia bounds.
 *
 * [west, south, east, north]
 */
const CAMBODIA_BOUNDS: LngLatBoundsLike = [
    102.25,
    10.35,
    107.65,
    14.75,
];

const MapLibreMap = forwardRef<
    MapLibreMapRef,
    MapLibreMapProps
>(function MapLibreMap(
    {
        pickup,
        delivery,
        driver,
        route,
        zones,
        selectedFeature,

        enableDrawing = false,
        startDrawing = false,

        onDrawChange,
        onMapClick,
        onZoneClick,

        className = "h-[500px] w-full",
        center = PHNOM_PENH,
        zoom = 12,

        styleUrl = "https://tiles.openfreemap.org/styles/liberty",

        restrictCambodia = true,
    },
    ref
) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<MapLibreMapInstance | null>(null);

    const drawRef = useRef<any>(null);

    const markersRef = useRef<MapLibreMarker[]>([]);

    const initializedRef = useRef(false);

    /**
     * ---------------------------------------------------------
     * Expose methods to parent
     * ---------------------------------------------------------
     */
    useImperativeHandle(
        ref,
        () => ({
            getMap: () => mapRef.current,

            fitAll: () => {
                fitAllLocations();
            },

            startDrawing: () => {
                if (!drawRef.current) return;

                drawRef.current
                    .getTerraDrawInstance()
                    ?.setMode("polygon");
            },

            stopDrawing: () => {
                if (!drawRef.current) return;

                drawRef.current
                    .getTerraDrawInstance()
                    ?.setMode("static");
            },

            getDrawnFeatures: () => {
                if (!drawRef.current) {
                    return {
                        type: "FeatureCollection",
                        features: [],
                    };
                }

                return (
                    drawRef.current
                        .getTerraDrawInstance()
                        ?.getSnapshot() ?? {
                        type: "FeatureCollection",
                        features: [],
                    }
                );
            },
        }),
        []
    );

    /**
     * ---------------------------------------------------------
     * Create map
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (!containerRef.current) return;
        if (initializedRef.current) return;

        initializedRef.current = true;

        const map = new maplibregl.Map({
            container: containerRef.current,

            style: styleUrl,

            center,

            zoom,

            maxBounds: restrictCambodia
                ? CAMBODIA_BOUNDS
                : undefined,
            // attributionControl: true, // Todo
            attributionControl: undefined, // Disable default attribution control to customize it
        });

        mapRef.current = map;

        map.addControl(
            new maplibregl.NavigationControl({
                showZoom: true,
                showCompass: true,
            }),
            "top-right"
        );

        map.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: false,
                showUserLocation: true,
            }),
            "top-right"
        );

        map.on("load", () => {
            setupDrawing(map);

            map.on("click", (event) => {
                onMapClick?.(event);
            });

            map.on("click", "zones-fill", (event) => {
                const feature = event.features?.[0];

                if (feature) {
                    onZoneClick?.(feature);
                }
            });

            map.on("mouseenter", "zones-fill", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "zones-fill", () => {
                map.getCanvas().style.cursor = "";
            });

            fitAllLocations();
        });

        return () => {
            markersRef.current.forEach((marker) => {
                marker.remove();
            });

            markersRef.current = [];

            map.remove();

            mapRef.current = null;

            initializedRef.current = false;
        };
    }, []);

    /**
     * ---------------------------------------------------------
     * Setup Terra Draw
     * ---------------------------------------------------------
     */
    const setupDrawing = (
        map: MapLibreMapInstance
    ) => {
        if (!enableDrawing) return;

        const draw = new MaplibreTerradrawControl({
            modes: [
                "polygon",
                "select",
                "delete-selection",
                "delete",
            ],
            open: false,
        }) as unknown as maplibregl.IControl & {
            getTerraDrawInstance: () => any;
        };

        map.addControl(draw, "top-left");

        drawRef.current = draw;

        const terraDraw =
            draw.getTerraDrawInstance();

        if (!terraDraw) return;

        terraDraw.on("finish", () => {
            emitDrawChange();
        });

        terraDraw.on("change", () => {
            emitDrawChange();
        });

        if (startDrawing) {
            terraDraw.setMode("polygon");
        }
    };

    /**
     * ---------------------------------------------------------
     * Emit drawing data
     * ---------------------------------------------------------
     */
    const emitDrawChange = () => {
        if (!drawRef.current) return;

        const terraDraw =
            drawRef.current.getTerraDrawInstance();

        if (!terraDraw) return;

        const snapshot =
            terraDraw.getSnapshot();

        onDrawChange?.(snapshot);
    };

    /**
     * ---------------------------------------------------------
     * Markers
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        markersRef.current.forEach((marker) => {
            marker.remove();
        });

        markersRef.current = [];

        const addMarker = (
            location: LocationPoint,
            type: "pickup" | "delivery" | "driver"
        ) => {
            const element =
                document.createElement("div");

            element.className =
                "flex items-center justify-center";

            const icon = document.createElement("div");

            icon.className = `
        flex h - 9 w - 9
items - center justify - center
rounded - full
border - 2 border - white
shadow - lg
text - white
font - bold
text - sm
    `;

            if (type === "pickup") {
                icon.className += " bg-blue-600";
                icon.innerHTML = "P";
            }

            if (type === "delivery") {
                icon.className += " bg-red-600";
                icon.innerHTML = "D";
            }

            if (type === "driver") {
                icon.className += " bg-green-600";
                icon.innerHTML = "🚗";
            }

            element.appendChild(icon);

            const popup = new maplibregl.Popup({
                offset: 25,
            }).setHTML(`
    < div class="text-sm" >
        ${location.label
                    ? `<div class="font-semibold">${location.label}</div>`
                    : ""
                }

          ${location.address
                    ? `<div>${location.address}</div>`
                    : ""
                }

<div class="mt-1 text-xs text-gray-500">
    ${location.lat.toFixed(6)},
    ${location.lng.toFixed(6)}
</div>
        </div >
    `);

            const marker = new maplibregl.Marker({
                element,
            })
                .setLngLat([
                    location.lng,
                    location.lat,
                ])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
        };

        if (pickup) {
            addMarker(
                pickup,
                "pickup"
            );
        }

        if (delivery) {
            addMarker(
                delivery,
                "delivery"
            );
        }

        if (driver) {
            addMarker(
                driver,
                "driver"
            );
        }
    }, [
        pickup,
        delivery,
        driver,
    ]);

    /**
     * ---------------------------------------------------------
     * Route
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!map.isStyleLoaded()) {
            map.once("load", () => {
                updateRoute();
            });

            return;
        }

        updateRoute();

        function updateRoute() {
            const map = mapRef.current;

            if (!map) return;

            const source =
                map.getSource("route") as GeoJSONSource | undefined;

            if (!route) {
                if (source) {
                    source.setData({
                        type: "FeatureCollection",
                        features: [],
                    });
                }

                return;
            }

            const routeFeature: Feature<LineString> =
                "type" in route &&
                    route.type === "Feature"
                    ? route
                    : {
                        type: "Feature",
                        properties: {},
                        geometry: route,
                    };

            if (source) {
                source.setData(routeFeature);
                return;
            }

            map.addSource("route", {
                type: "geojson",
                data: routeFeature,
            });

            map.addLayer({
                id: "route-line",
                type: "line",
                source: "route",

                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },

                paint: {
                    "line-color": "#2563eb",
                    "line-width": 5,
                    "line-opacity": 0.85,
                },
            });
        }
    }, [route]);

    /**
     * ---------------------------------------------------------
     * Zones
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!map.isStyleLoaded()) {
            map.once("load", () => {
                updateZones();
            });

            return;
        }

        updateZones();

        function updateZones() {
            const map = mapRef.current;

            if (!map) return;

            const source = map.getSource("zones") as GeoJSONSource | undefined;

            const data: FeatureCollection =
                zones ?? {
                    type: "FeatureCollection",
                    features: [],
                };

            if (source) {
                source.setData(data);
                return;
            }

            map.addSource("zones", {
                type: "geojson",
                data,
            });

            map.addLayer({
                id: "zones-fill",
                type: "fill",
                source: "zones",

                paint: {
                    "fill-color": "#16a34a",
                    "fill-opacity": 0.2,
                },
            });

            map.addLayer({
                id: "zones-outline",
                type: "line",
                source: "zones",

                paint: {
                    "line-color": "#16a34a",
                    "line-width": 2,
                },
            });
        }
    }, [zones]);

    /**
     * ---------------------------------------------------------
     * Selected zone
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        if (!map.isStyleLoaded()) {
            map.once("load", () => {
                updateSelectedFeature();
            });

            return;
        }

        updateSelectedFeature();

        function updateSelectedFeature() {
            const map = mapRef.current;

            if (!map) return;

            const source =
                map.getSource("selected-zone") as GeoJSONSource | undefined;

            const data =
                selectedFeature ?? {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [],
                    },
                };

            if (source) {
                source.setData(data);
                return;
            }

            map.addSource("selected-zone", {
                type: "geojson",
                data,
            });

            map.addLayer({
                id: "selected-zone-fill",
                type: "fill",
                source: "selected-zone",

                paint: {
                    "fill-color": "#ef4444",
                    "fill-opacity": 0.25,
                },
            });

            map.addLayer({
                id: "selected-zone-outline",
                type: "line",
                source: "selected-zone",

                paint: {
                    "line-color": "#ef4444",
                    "line-width": 3,
                },
            });
        }
    }, [selectedFeature]);

    /**
     * ---------------------------------------------------------
     * Fit all locations
     * ---------------------------------------------------------
     */
    const fitAllLocations = () => {
        const map = mapRef.current;

        if (!map) return;

        const locations = [
            pickup,
            delivery,
            driver,
        ].filter(Boolean) as LocationPoint[];

        if (locations.length === 0) {
            map.flyTo({
                center,
                zoom,
                essential: true,
            });

            return;
        }

        if (locations.length === 1) {
            map.flyTo({
                center: [
                    locations[0].lng,
                    locations[0].lat,
                ],
                zoom: 14,
                essential: true,
            });

            return;
        }

        const bounds =
            new maplibregl.LngLatBounds();

        locations.forEach((location) => {
            bounds.extend([
                location.lng,
                location.lat,
            ]);
        });

        map.fitBounds(bounds, {
            padding: 80,
            maxZoom: 15,
            duration: 800,
        });
    };

    return (
        <div
            ref={containerRef}
            className={className}
        />
    );
});

export default MapLibreMap;
