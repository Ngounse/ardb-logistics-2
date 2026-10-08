"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useChatSocket({
    token,
    onMessage,
}: {
    token: string;
    onMessage: (msg: any) => void;
}) {
    const clientRef = useRef<Client | null>(null);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/chat-service/ws`;

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${url}`),

            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            debug: (str) => console.log(str),

            reconnectDelay: 50000, // auto reconnect
        });

        client.onConnect = () => {
            console.log("✅ Connected WebSocket");

            // ✅ PRIVATE
            client.subscribe("/user/queue/messages", (message) => {
                const data = JSON.parse(message.body);
                onMessage(data);
            });

            // ✅ PUBLIC
            client.subscribe("/topic/chats", (message) => {
                const data = JSON.parse(message.body);
                onMessage(data);
            });
        };

        client.onStompError = (frame) => {
            console.error("❌ Broker error:", frame.headers["message"]);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [token]);

    const sendMessage = (destination: string, body: any) => {
        clientRef.current?.publish({
            destination,
            body: JSON.stringify(body),
        });
    };

    return { sendMessage };
}