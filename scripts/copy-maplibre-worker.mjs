import {
    copyFileSync,
    mkdirSync,
} from "node:fs";

import {
    resolve,
} from "node:path";

const sourceDir = resolve(
    "node_modules/maplibre-gl/dist"
);

const destinationDir = resolve(
    "public/maplibre"
);

mkdirSync(
    destinationDir,
    {
        recursive: true,
    }
);

copyFileSync(
    resolve(
        sourceDir,
        "maplibre-gl-worker.mjs"
    ),
    resolve(
        destinationDir,
        "maplibre-gl-worker.mjs"
    )
);

copyFileSync(
    resolve(
        sourceDir,
        "maplibre-gl-shared.mjs"
    ),
    resolve(
        destinationDir,
        "maplibre-gl-shared.mjs"
    )
);

console.log(
    "MapLibre worker files copied."
);