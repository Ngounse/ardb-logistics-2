// lib/beacon.ts

export type BeaconEvent = {
    event: string;
    page?: string;
    action?: string;
    entity?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
};

export function sendBeacon(event: BeaconEvent) {
    if (typeof window === "undefined") return;

    const payload = {
        ...event,
        url: window.location.href,
        timestamp: new Date().toISOString(),
    };

    const blob = new Blob(
        [JSON.stringify(payload)],
        { type: "application/json" }
    );

    // navigator.sendBeacon(
    //     "http://localhost:5000/beacon",
    //     blob
    // );
}