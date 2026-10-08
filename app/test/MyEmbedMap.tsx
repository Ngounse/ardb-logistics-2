// components/MyEmbedMap.jsx
'use client';

import { GoogleMapsEmbed } from '@next/third-parties/google';

export default function MyEmbedMap() {
    return (
        <GoogleMapsEmbed
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}
            height={400}
            width="100%"
            mode="place"
            q="Brooklyn+Bridge,New+York,NY" // The location to display
        />
    );
}
