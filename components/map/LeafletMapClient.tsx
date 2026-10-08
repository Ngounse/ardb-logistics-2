"use client";

import {
    MapContainer,
    TileLayer,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

import L from "leaflet";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Feature,
    Properties,
    ZoneT,
} from "@/app/admin/fleet/zone/utility";

import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";

// ============================================================
// TYPES
// ============================================================

export interface LayerWithFeature extends L.Layer {
    feature?: GeoJSON.Feature & {
        properties?: {
            id?: string | number;
            name?: string;
            status?: boolean;
            [key: string]: any;
        };
    };
}

interface MapViewProps {
    readonly ZoneT: ZoneT;
    readonly selectFeature: (feature: Feature) => void;
    readonly selectedFeature: Feature | null;
    readonly onCreate: (geojson: any) => Promise<any>;
    readonly onUpdate: (id: string | number, geojson: any) => Promise<void>;
    readonly onDelete: (id: string | number) => Promise<void>;
    readonly isForm: boolean;
    readonly isEditForm: boolean;
    readonly startDrawing: boolean;
    readonly setStartDrawing: (value: boolean) => void;
    readonly onSetIsForm: (value: boolean) => void;
    readonly onSetIsFormEdit: (value: boolean) => void;
}

// ============================================================
// POLYGON DRAW OPTIONS
// ============================================================

const PolygonOptions = {
    allowIntersection: false,

    showArea: true,

    drawError: {
        color: "#ff0000",
        message:
            "<strong>Oh snap!</strong> You can't draw that!",
    },

    shapeOptions: {
        color: "#fbff00",
        weight: 2,
        fillOpacity: 0.01,
    },
};


// ============================================================
// MAP INSTANCE
// ============================================================

function MapInstance({
    mapRef,
}: {
    mapRef: React.MutableRefObject<L.Map | null>;
}) {
    const map = useMap();

    useEffect(() => {
        mapRef.current = map;

        return () => {
            mapRef.current = null;
        };
    }, [map, mapRef]);

    return null;
}


// ============================================================
// DRAW CONTROL
// ============================================================

interface DrawControlProps {
    ZoneT: ZoneT;
    selectedFeature: Feature | null;
    selectFeature: (feature: Feature) => void;
    onCreate: (geojson: any) => Promise<any>;
    onUpdate: (id: string | number, geojson: any) => Promise<void>;
    onDelete: (id: string | number) => Promise<void>;
    editMode: boolean;
    drawnItemsRef: React.MutableRefObject<L.FeatureGroup | null>;
    pendingLayerRef: React.MutableRefObject<L.Polygon | null>;
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
    polygonDrawerRef: React.MutableRefObject<any>;
    setZoneName: React.Dispatch<React.SetStateAction<string>>;
    setProperties: any;
    onSetIsForm: (value: boolean) => void;
}

function DrawControl({
    ZoneT,
    selectedFeature,
    selectFeature,
    onCreate,
    onUpdate,
    onDelete,
    editMode,
    drawnItemsRef,
    pendingLayerRef,
    setIsCreating,
    setIsDrawing,
    polygonDrawerRef,
    setZoneName,
    setProperties,
    onSetIsForm,
}: DrawControlProps) {
    const map = useMap();

    // ========================================================
    // CREATE DRAWN ITEMS GROUP
    // ========================================================

    useEffect(() => {
        if (!drawnItemsRef.current) { drawnItemsRef.current = new L.FeatureGroup(); }
        const drawnItems = drawnItemsRef.current;
        map.addLayer(drawnItems);
        return () => {
            map.removeLayer(drawnItems);
        };
    }, [map, drawnItemsRef,]);

    // ========================================================
    // RESET STYLE
    // ========================================================

    const resetStyle = (
        layer: L.Path
    ) => {
        layer.setStyle({
            color: "#1eff00",
            fillColor: "#ffffff00",
            weight: 2,
            fillOpacity: 0.01,
        });
    };

    // ========================================================
    // HOVER
    // ========================================================

    const attachHover = (
        layer: L.Layer
    ) => {
        if (!(layer instanceof L.Path)) { return; }


        const originalStyle = {
            color: "#1eff00",
            weight: (layer as any).options?.weight || 2,
        };

        layer.on({
            mouseover: () => {
                layer.setStyle({
                    color: "darkgreen",
                    weight: 4,
                });
            },

            mouseout: () => {
                layer.setStyle(originalStyle);
            },
        });
    };

    // ========================================================
    // CLICK
    // ========================================================

    const attachInteractions = (
        layer: L.Layer
    ) => {
        if (!(layer instanceof L.Path)) { return; }
        resetStyle(layer);
        layer.on({
            click: () => {
                // if (isEditForm) { return; } // Todo:
                const typedLayer = layer as LayerWithFeature;
                if (!typedLayer.feature) { return; }
                // Don't select temporary polygon
                if (pendingLayerRef.current === layer) { return; }
                selectFeature(typedLayer.feature as Feature);
            },
        });
    };

    // ========================================================
    // LOAD EXISTING ZONES
    // ========================================================

    useEffect(() => {
        if (!ZoneT) { return; }

        if (!drawnItemsRef.current) { return; }

        const drawnItems = drawnItemsRef.current;

        drawnItems.clearLayers();

        const data = ZoneT as any;

        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                const typedLayer = layer as LayerWithFeature;

                typedLayer.feature = {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        id: feature.properties?.id || feature.id,
                    },
                };

                attachHover(typedLayer);
                attachInteractions(typedLayer);
                drawnItems.addLayer(typedLayer);
            },
        });
    }, [ZoneT, selectFeature,]);

    // ========================================================
    // SELECTED FEATURE
    // ========================================================

    useEffect(() => {
        if (!drawnItemsRef.current || !selectedFeature) return;

        const drawnItems = drawnItemsRef.current;
        const selectedId = String(selectedFeature.properties?.id);

        drawnItems.eachLayer((layer: any) => {
            if (pendingLayerRef.current === layer) return;

            const layerId = String(layer.feature?.properties?.id);

            if (layerId === selectedId) {
                // SHOW SELECTED
                if (!map.hasLayer(layer)) {
                    map.addLayer(layer);
                }

                layer.setStyle({
                    color: "darkgreen",
                    fillColor: "green",
                    weight: 4,
                    fillOpacity: 0.15,
                });

                if (editMode && layer.editing) {
                    layer.editing.enable();
                } else if (layer.editing) {
                    layer.editing.disable();
                }

                // ✅ Always zoom to selected zone
                if (layer.getBounds) {
                    map.flyToBounds(layer.getBounds(), {
                        padding: [150, 150],
                    });
                }
            } else {
                // OTHER ZONES
                if (editMode) {
                    if (map.hasLayer(layer)) {
                        map.removeLayer(layer);
                    }
                } else {
                    if (!map.hasLayer(layer)) {
                        map.addLayer(layer);
                    }

                    layer.setStyle({
                        color: "#1eff00",
                        fillColor: "#ffffff00",
                        weight: 2,
                        fillOpacity: 0.01,
                    });
                }
            }
        });
    }, [selectedFeature, editMode, map]);

    // ========================================================
    // CREATED EVENT
    //
    // IMPORTANT:
    // We DO NOT call onCreate() here.
    //
    // We keep the polygon temporarily until the
    // user fills the form and clicks Save Zone.
    // ========================================================

    useEffect(() => {
        if (!drawnItemsRef.current) { return; }
        const drawnItems = drawnItemsRef.current;
        const handleCreated = (
            e: any
        ) => {
            const layer = e.layer as L.Polygon;

            // ------------------------------------------
            // STYLE TEMPORARY POLYGON
            // ------------------------------------------

            layer.setStyle({
                fill: true,
                fillColor: "#4d4500",
                color: "#ff0101",
                fillOpacity: 0.2,
                weight: 3,
            });

            attachHover(layer);
            layer.on({
                mouseout: () => {
                    layer.setStyle({ color: "red", weight: 4, fillOpacity: 1, });
                },
            });
            attachInteractions(layer);

            // ------------------------------------------
            // SAVE AS PENDING LAYER
            // ------------------------------------------

            pendingLayerRef.current = layer;
            // ------------------------------------------
            // ADD TO MAP
            // ------------------------------------------

            drawnItems.addLayer(layer);

            // ------------------------------------------
            // SHOW CREATE FORM
            // ------------------------------------------

            setIsCreating(true);

            // ------------------------------------------
            // DRAWING FINISHED
            // ------------------------------------------

            polygonDrawerRef.current = null;
            setIsDrawing(false);

            // ------------------------------------------
            // CLEAR NAME
            // ------------------------------------------
            setZoneName("");
            const geojson = layer.toGeoJSON();

            // --------------------------------------
            // UPDATE NAME
            // --------------------------------------

            geojson.properties = { ...(geojson.properties || {}), name: '', };
            setProperties(geojson);
            onSetIsForm(true);
            console.log("Polygon created temporarily. Waiting for form submit.");
        };

        map.on(
            L.Draw.Event.CREATED,
            handleCreated
        );

        return () => {
            map.off(
                L.Draw.Event.CREATED,
                handleCreated
            );
        };
    }, [
        map,
        onCreate,
    ]);

    // ========================================================
    // DELETE EVENT
    // ========================================================

    useEffect(() => {
        if (!drawnItemsRef.current) { return; }

        const handleDeleted = (e: any) => {
            e.layers.eachLayer(
                async (layer: any) => {

                    const id = layer.feature?.properties?.id;

                    if (!id) { return; }

                    try {
                        await onDelete(id);
                    } catch (error) {
                        console.error("Failed to delete zone:", error);
                    }
                }
            );
        };
        map.on(L.Draw.Event.DELETED, handleDeleted);
        return () => { map.off(L.Draw.Event.DELETED, handleDeleted); };
    }, [map, onDelete,]);

    return null;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function LeafletMapClient({
    ZoneT,
    selectFeature,
    selectedFeature,
    onCreate,
    onUpdate,
    onDelete,
    isForm,
    isEditForm,
    onSetIsForm,
    onSetIsFormEdit,
    startDrawing,
    setStartDrawing,
}: MapViewProps) {

    // ========================================================
    // MAP CENTER
    // ========================================================

    const center: [number, number] = [11.5564, 104.9282,];
    // ========================================================
    // STATE
    // ========================================================
    const [zoneName, setZoneName,] = useState<string>("");
    const [zoneDescription, setZoneDescription,] = useState<string>("");
    const [properties, setProperties,] = useState<Feature | null>(null);
    const [tile, setTile,] = useState<| "osm" | "carto" | "dark" | "satellite" | "openStreet">("osm");
    // const [editMode, setEditMode,] = useState<boolean>(false);
    // Are we currently drawing?
    const [isDrawing, setIsDrawing,] = useState<boolean>(false);
    // Are we currently creating a zone?
    const [isCreating, setIsCreating,] = useState<boolean>(false);
    // Are we saving?
    const [isSaving, setIsSaving,] = useState<boolean>(false);

    // ========================================================
    // REFS
    // ========================================================

    const mapRef = useRef<L.Map | null>(null);

    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

    // Temporary polygon waiting for form submit
    const pendingLayerRef = useRef<L.Polygon | null>(null);

    // Leaflet.Draw polygon instance
    const polygonDrawerRef = useRef<any>(null);

    // ========================================================
    // TILE LAYERS
    // ========================================================

    const tileLayers = {
        openStreet: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        carto: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        satellite: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    };

    // ========================================================
    // START POLYGON DRAWING
    // ========================================================

    const startPolygonDrawing = () => {
        if (!mapRef.current) {
            console.warn("Map is not ready");
            return;
        }
        onSetIsForm(true);
        if (polygonDrawerRef.current) {
            polygonDrawerRef.current.disable();
            polygonDrawerRef.current = null;
            setIsDrawing(false);
            onSetIsForm(false);
            return;
        }

        if (pendingLayerRef.current) {
            drawnItemsRef.current?.removeLayer(
                pendingLayerRef.current
            );

            pendingLayerRef.current = null;
            setIsCreating(false);
            setZoneName("");
            setZoneDescription("")
        }

        const drawer = new (L.Draw.Polygon as any)(
            mapRef.current,
            PolygonOptions
        );

        polygonDrawerRef.current = drawer;
        drawer.enable();
        setIsDrawing(true);
    };

    // ========================================================
    // CANCEL NEW ZONE
    // ========================================================

    const cancelNewZone = () => {

        // ------------------------------------------
        // Stop drawing
        // ------------------------------------------

        if (polygonDrawerRef.current) {
            polygonDrawerRef.current.disable();
            polygonDrawerRef.current = null;
        }

        // ------------------------------------------
        // Remove temporary polygon
        // ------------------------------------------

        if (pendingLayerRef.current) {
            drawnItemsRef.current?.removeLayer(pendingLayerRef.current);
            pendingLayerRef.current = null;
        }

        // ------------------------------------------
        // Reset form
        // ------------------------------------------

        setZoneName("");
        setZoneDescription("")
        setIsDrawing(false);
        setIsCreating(false);
        handelAutoClose();
    };

    // ========================================================
    // SAVE NEW ZONE
    // ========================================================

    const saveNewZone = async () => {
        const layer = pendingLayerRef.current;

        // ------------------------------------------
        // CHECK POLYGON
        // ------------------------------------------

        if (!layer) {
            console.warn("No polygon to save");
            return;
        }
        // ------------------------------------------
        // CHECK NAME
        // ------------------------------------------

        const name = zoneName.trim();
        const description = zoneDescription.trim();
        try {
            setIsSaving(true);

            // --------------------------------------
            // GET GEOJSON
            // --------------------------------------

            const geojson = layer.toGeoJSON();

            // --------------------------------------
            // ADD FORM DATA
            // --------------------------------------

            geojson.properties = {
                ...(geojson.properties ||
                    {}),

                name, description,
            };

            // --------------------------------------
            // API PARAM
            // --------------------------------------

            const apiParam = {
                type: "FeatureCollection",
                features: [geojson,],
            };

            // --------------------------------------
            // CALL API
            // --------------------------------------

            const res = await onCreate(apiParam);

            // --------------------------------------
            // RESPONSE
            // --------------------------------------

            const d: Properties = res.data;
            const { id, } = d;

            // --------------------------------------
            // SAVE ID TO LAYER
            // --------------------------------------

            layer.feature = {
                ...geojson,
                properties: {
                    ...(geojson.properties || {}), id, name,
                },
            };
            // --------------------------------------
            // CHANGE STYLE TO NORMAL
            // --------------------------------------
            layer.setStyle({
                color: "#1eff00",
                fillColor: "#ffffff00",
                weight: 2,
                fillOpacity: 0.01,
            });
            // --------------------------------------
            // FINISH
            // --------------------------------------
            pendingLayerRef.current = null;
            setZoneName("");
            setZoneDescription("")

        } catch (error) {
            console.error("Failed to create zone:", error);
        } finally {
            setIsSaving(false);
            cancelNewZone();
            setTimeout(() => {
                handelAutoClose();
            }, 1);
        }
    };

    // ========================================================
    // UPDATE SELECTED FEATURE NAME
    // ========================================================

    useEffect(() => {
        if (isEditForm) {
            setProperties(selectedFeature);
            // setEditMode(false)
            setTimeout(() => {
                // setEditMode(true)
            }, 1);
        }
    }, [selectedFeature,]);

    const handelAutoClose = () => {
        onSetIsForm(false);
        onSetIsFormEdit(false);
    }

    // ========================================================
    // SAVE EXISTING ZONE
    // ========================================================

    const saveExistingZone =
        async () => {
            if (!selectedFeature?.properties?.id) { return; }
            // if (properties?.properties.surgeMultiplier < 1 || properties?.properties.surgeMultiplier > 9) {
            //     toast({
            //         title: "Invalid Layer Level",
            //         description: "Please enter a valid layer level (1 to 9).",
            //         variant: "destructive",
            //     });
            //     return;
            // }
            const selectedId = selectedFeature.properties.id;

            drawnItemsRef.current?.eachLayer(
                async (layer: any) => {

                    const layerId = layer.feature?.properties?.id;
                    if (String(layerId) !== String(selectedId)) { return; }
                    // --------------------------------------
                    // GEOJSON
                    // --------------------------------------

                    const geojson = layer.toGeoJSON();

                    // --------------------------------------
                    // UPDATE NAME
                    // --------------------------------------

                    geojson.properties = {
                        ...(geojson.properties),
                        name: properties?.properties.name,
                        description: properties?.properties.description,
                        surgeMultiplier: properties?.properties.surgeMultiplier,
                    };

                    // --------------------------------------
                    // API
                    // --------------------------------------

                    await onUpdate(
                        selectedId,
                        geojson
                    ).then((res) => {
                        onSetIsFormEdit(false)
                    });

                    // --------------------------------------
                    // UPDATE LOCAL LAYER
                    // --------------------------------------

                    layer.feature = {
                        ...geojson,

                        properties: {
                            ...(geojson.properties ||
                                {}),
                            id: selectedId,
                            name: zoneName.trim(),
                        },
                    };
                }
            );
            onSetIsFormEdit(false)
            setTimeout(() => {
                handelAutoClose();
            }, 1);
        };

    const cancelExistingZone =
        async () => {
            if (!selectedFeature?.properties?.id) { return; }
            const selectedId = selectedFeature.properties.id;

            drawnItemsRef.current?.eachLayer(
                async (layer: any) => {

                    const layerId = layer.feature?.properties?.id;
                    if (String(layerId) !== String(selectedId)) { return; }
                    // --------------------------------------
                    // GEOJSON
                    // --------------------------------------

                    const geojson = layer.toGeoJSON();
                    onSetIsFormEdit(false)
                    layer.feature = {
                        ...geojson,

                        properties: {
                            ...(geojson.properties ||
                                {}),
                            id: selectedId,
                            name: zoneName.trim(),
                        },
                    };
                }
            );
            onSetIsFormEdit(false)
            setTimeout(() => {
                handelAutoClose();
            }, 1);
        };
    // ========================================================
    // TOGGLE EDIT MODE
    // ========================================================

    useEffect(() => {
        if (!startDrawing) return;
        startPolygonDrawing();
        // reset parent trigger
        setStartDrawing(false);
    }, [startDrawing]);

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className={`w-full h-full ${isForm ? 'grid' : ''} grid-cols-2 relative`}>
            {/* ==================================================
                FORM CARD
            ================================================== */}
            {isForm &&
                <Card className="">
                    <CardContent className="p-4">

                        {isCreating ? (

                            <div className="mt-4">

                                <h3 className="font-semibold text-lg mb-4">
                                    Create Zone
                                </h3>

                                <div className="">
                                    <Label htmlFor="zoneName">Zone Name *</Label>
                                    <Input
                                        id="zoneName"
                                        value={zoneName}
                                        onChange={(e) => setZoneName(e.target.value)}
                                        placeholder="Enter zone name"
                                        name="name"
                                    />
                                </div>

                                <div className="mt-2 text-gray-500">
                                    <Label className="color-gray-500" htmlFor="zoneName">Zone Type</Label>
                                    <Input readOnly className="color-gray-500" id="type" defaultValue={properties?.geometry.type} placeholder="Enter zone type" name="type" />
                                </div>

                                <div className="mt-4 ">
                                    <Label htmlFor="zoneName">Description</Label>
                                    <Input id="zone-description" placeholder="Enter zone description" name="description"
                                        value={zoneDescription}
                                        onChange={(e) => setZoneDescription(e.target.value)}
                                        defaultValue={properties?.properties.description} />
                                </div>


                                {/* <div className="mt-2 text-gray-500">
                                    <Label className="color-gray-500" htmlFor="zoneName">Layer Level</Label>
                                    <Input readOnly className="color-gray-500" type="number" min="1" defaultValue={properties?.properties.surgeMultiplier} placeholder="Enter layer level: 1, 2, 3" name="surgeMultiplier" />
                                </div> */}
                                <Input className="color-gray-500" type="hidden" min="1" defaultValue={properties?.properties.surgeMultiplier} value={1} name="surgeMultiplier" />

                                <div className="mt-2 grid sm:grid-cols-2 gap-4 text-gray-500">
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="geometry " className="color-gray-500">Coordinates</Label>
                                        <Textarea readOnly id="geometry" defaultValue={JSON.stringify(properties?.geometry.coordinates)} rows={5} placeholder="Enter coordinates" name="coordinates" />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className="w-full mt-4"
                                    disabled={isSaving || zoneName == ''}
                                    onClick={saveNewZone}
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : "Save Zone"}
                                </Button>

                                {/* ------------------------------------------
                                        CANCEL
                                ------------------------------------------ */}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full mt-2"
                                    disabled={isSaving}
                                    onClick={cancelNewZone}
                                >
                                    Cancel
                                </Button>

                            </div>

                        ) : (

                            <>
                                {!isEditForm && <Button
                                    type="button"
                                    className="w-full"
                                    variant={isDrawing ? "destructive" : "default"}
                                    onClick={startPolygonDrawing}
                                >
                                    {isDrawing ? "Cancel Drawing" : "Draw Polygon"}
                                </Button>
                                }

                                {/* <Button
                                    type="button"
                                    className="w-full"
                                    onClick={toggleEditMode}
                                >
                                    Edit Polygon
                                </Button> */}

                                {(selectedFeature && isEditForm) && (
                                    <div className="">

                                        <h3 className="font-semibold text-lg">
                                            Edit Zone
                                        </h3>

                                        <div className="mt-4 text-gray-500">
                                            <Label htmlFor="zoneName">Zone Id</Label>
                                            <Input readOnly defaultValue={selectedFeature.properties.id} />
                                        </div>

                                        <div className="mt-4">
                                            <Label htmlFor="zoneName">Zone Name </Label>
                                            <Input
                                                id="zoneName"
                                                defaultValue={selectedFeature.properties.name}
                                                onChange={(e) => {
                                                    const nextName = e.target.value;
                                                    setProperties((prev) => ({
                                                        ...(prev ?? selectedFeature),
                                                        properties: {
                                                            ...((prev ?? selectedFeature)?.properties ?? {}),
                                                            name: nextName,
                                                        },
                                                    }));
                                                    setZoneName(nextName);
                                                }}
                                                placeholder="Enter zone name"
                                                name="name"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <Label htmlFor="zoneDescription">Zone Description </Label>
                                            <Input
                                                id="zoneDescription"
                                                defaultValue={selectedFeature.properties.description}
                                                onChange={(e) => {
                                                    const nextDescription = e.target.value;
                                                    setProperties((prev) => ({
                                                        ...(prev ?? selectedFeature),
                                                        properties: {
                                                            ...((prev ?? selectedFeature)?.properties ?? {}),
                                                            description: nextDescription,
                                                        },
                                                    }));
                                                    setZoneDescription(nextDescription);
                                                }}
                                                placeholder="Enter zone description"
                                                name="description"
                                            />
                                        </div>

                                        <div className="mt-4 text-gray-500">
                                            <Label htmlFor="zoneName">Zone Type</Label>
                                            <Input readOnly id="type" defaultValue={selectedFeature.geometry.type} placeholder="Enter zone type" name="type" />
                                        </div>

                                        {/* <div className="mt-4 ">
                                            <Label htmlFor="zoneName">Layer Level</Label>
                                            <Input id="surgeMultiplier" type="number" min="1" defaultValue={selectedFeature.properties.surgeMultiplier} placeholder="Enter surge multiplier: 1 , 2 , 3" name="surgeMultiplier"
                                                onChange={(e) => {
                                                    const nextSurgeMultiplier = e.target.value;
                                                    setProperties((prev) => ({
                                                        ...(prev ?? selectedFeature),
                                                        properties: {
                                                            ...((prev ?? selectedFeature)?.properties ?? {}),
                                                            surgeMultiplier: nextSurgeMultiplier,
                                                        },
                                                    }));
                                                }} />
                                        </div> */}
                                        <Input id="surgeMultiplier" type="hidden" min="1" value={1} defaultValue={selectedFeature.properties.surgeMultiplier} placeholder="Enter surge multiplier: 1 , 2 , 3" name="surgeMultiplier" />

                                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                            <div className="grid gap-2 col-span-2">
                                                <Label htmlFor="geometry">Coordinates</Label>
                                                <Textarea id="geometry" defaultValue={JSON.stringify(selectedFeature.geometry.coordinates)} rows={5} placeholder="Enter coordinates" name="coordinates" />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full"
                                                disabled={isSaving}
                                                onClick={cancelExistingZone}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                className="w-full"
                                                disabled={isSaving}
                                                onClick={saveExistingZone}
                                            >
                                                {isSaving
                                                    ? "Saving..."
                                                    : "Save Zone"}
                                            </Button>

                                        </div>


                                    </div>
                                )}

                            </>
                        )}

                    </CardContent>

                </Card>
            }

            <div className="absolute top-0 right-0 z-[2]">

                <select
                    className="
                        p-2
                        border
                        border-gray-300
                        dark:border-gray-600
                        rounded-md
                        bg-white
                        dark:bg-gray-700
                        text-gray-900
                        dark:text-gray-100
                        shadow
                    "
                    onChange={(e) =>
                        setTile(e.target.value as | "osm" | "carto" | "dark" | "satellite" | "openStreet")
                    }
                    value={tile}
                >
                    <option value="osm">    OSM  </option>
                    <option value="carto">  Light   </option>
                    <option value="dark">     Dark  </option>
                    <option value="satellite">     Satellite  </option>
                    <option value="openStreet">     OpenStreet   </option>
                </select>

            </div>

            {/* ==================================================
                MAP
            ================================================== */}

            <MapContainer
                center={center}
                zoom={13}
                className="w-full h-[600px] rounded-xl z-0"
                scrollWheelZoom
            >

                {/* ------------------------------------------
                    MAP INSTANCE
                ------------------------------------------ */}

                <MapInstance mapRef={mapRef} />

                {/* ------------------------------------------
                    TILE
                ------------------------------------------ */}

                <TileLayer
                    url={tileLayers[tile]}
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* ------------------------------------------
                    DRAW CONTROL
                ------------------------------------------ */}

                <DrawControl
                    ZoneT={ZoneT}
                    selectedFeature={selectedFeature}
                    selectFeature={selectFeature}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    editMode={isEditForm}
                    drawnItemsRef={drawnItemsRef}
                    pendingLayerRef={pendingLayerRef}
                    setIsCreating={setIsCreating}
                    setIsDrawing={setIsDrawing}
                    polygonDrawerRef={polygonDrawerRef}
                    setZoneName={setZoneName}
                    setProperties={setProperties}
                    onSetIsForm={onSetIsForm}
                />

            </MapContainer>

        </div>
    );
}