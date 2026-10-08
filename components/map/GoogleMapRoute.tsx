"use client";

import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
    width: "100%",
    height: "500px",
};

export default function GoogleMapRoute({ data }: any) {
    const [directions, setDirections] = useState<any>(null);

    // useEffect(() => {
    //     if (!window.google) return;

    //     const directionsService = new google.maps.DirectionsService();
    //     const pickup = data.pickup;
    //     const drops = data.dropOff;

    //     console.log("data::", data);


    //     directionsService.route(
    //         {
    //             origin: {
    //                 lat: pickup.latitude,
    //                 lng: pickup.longitude,
    //             },
    //             destination: {
    //                 lat: drops[drops.length - 1].latitude,
    //                 lng: drops[drops.length - 1].longitude,
    //             },
    //             waypoints: drops.slice(0, -1).map((d: any) => ({
    //                 location: { lat: d.latitude, lng: d.longitude },
    //                 stopover: true,
    //             })),
    //             optimizeWaypoints: true, // 🔥 IMPORTANT
    //             travelMode: google.maps.TravelMode.DRIVING,
    //         },
    //         (result, status) => {
    //             if (status === "OK") {
    //                 setDirections(result);
    //             }
    //         }
    //     );
    // }, [data]);

    return (
        // <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        //     <GoogleMap
        //         mapContainerStyle={containerStyle}
        //         center={{
        //             lat: data.pickup.latitude,
        //             lng: data.pickup.longitude,
        //         }}
        //         zoom={13}
        //     >
        //         {/* {directions && <DirectionsRenderer directions={directions} />} */}
        //     </GoogleMap>
        // </LoadScript>
        <>
            not implemented yet
        </>
    );
}