// scripts/generate-permissions.ts

import fs from "fs";
import path from "path";

interface Permission {
    id: number;
    name: string;
    description: string;
    path: string;
    httpMethod: string;
    createdAt: string;
    groupName: string | null;
}


interface Role {
    permissions: Permission[];
}

interface ApiResponse {
    data: {
        content: Permission[];
    };
}

// Read permissions.json
const jsonPath = path.resolve(
    "./scripts/permissions.json"
);

const rawData = fs.readFileSync(
    jsonPath,
    "utf-8"
);

const response: ApiResponse =
    JSON.parse(rawData);

// Extract unique permissions
const permissions = [
    ...new Set(
        response.data.content.map((permission) => permission.name)
    ),
].sort();

// Generate TS content
const content = `export const PERMISSIONS = {
${permissions
        .map((p) => `  ${p}: "${p}",`)
        .join("\n")}
} as const;

export type Permission =
    keyof typeof PERMISSIONS;
`;

// Create directory if missing
const constantsDir = path.resolve(
    "./src/constants"
);

if (!fs.existsSync(constantsDir)) {
    fs.mkdirSync(constantsDir, {
        recursive: true,
    });
}

// Output file
const outputPath = path.resolve(
    "./src/constants/permissions.ts"
);

// Write file
fs.writeFileSync(outputPath, content);

console.log(
    `✅ permissions.ts generated with ${permissions.length} permissions`
);