"use client"
import { useEffect, useState } from "react"
import type { Chat, ChatT, Message, MessageT } from "./types"
import user6 from "@/public/user6.png"
import user7 from "@/public/user7.png"
import user8 from "@/public/user8.png"
import user9 from "@/public/user9.png"
import user10 from "@/public/user10.png"
import user11 from "@/public/user11.png"
import api from '@/lib/axios';
import { useChatSocket } from "./use-chat-socket";

export function useChatData(activeChat: string) {
  const [chats, setChats] = useState<ChatT[]>([])
  const [messages, setMessages] = useState<MessageT[]>([])

  const url = `chat-service/api/v1/chats`;
  const urlMessages = `chat-service/api/v1/messages`;

  useEffect(() => {
    api.get(url).then(response => {
      const d = response.data.data.result;
      console.log('Chat data fetched successfully:', d);
      setChats(d);
      // You can update your state with the fetched data here
    });
  }, [])


  // on selecting a chat, fetch messages for that chat
  useEffect(() => {
    if (!activeChat) return;
    console.log('Selected activeChat chat:', activeChat);
    api.get(`${urlMessages}/${activeChat}`).then(response => {
      const d = response.data.data.result;
      setMessages(d);
    });
  }, [activeChat]);

  const _token = localStorage.getItem("token") || "user-1"; // replace with real token retrieval

  const { sendMessage } = useChatSocket({
    token: _token,
    onMessage: (msg) => {
      console.log("📩 Incoming:", msg);
      // ✅ only add if current chat
      if (msg.chatId === activeChat) {
        setMessages((prev) => [...prev, msg]);
      }
    },
  });

  const addMessage = async (newMessage: Omit<MessageT, "id" | "timestamp">) => {
    if (!activeChat) return;
    const tempId = Date.now().toString();
    // const message: MessageT = {
    //   ...newMessage,
    //   id: Date.now().toString(),
    //   // timestamp: new Date(),
    //   sender: "You",
    //   isRead: false,
    //   readAt: null,
    // }
    // setMessages((prev) => [...prev, message])

    const optimisticMessage: MessageT = {
      ...newMessage,
      id: tempId,
      sender: "You",

    };

    // ✅ 1. Optimistic UI update
    setMessages((prev) => [...prev, optimisticMessage]);

    // Simulate delivery status update
    // setTimeout(() => {
    //   setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "delivered" } : msg)))
    // }, 1000)

    // try {
    //   // ✅ 2. Send to API
    //   const response = await api.post(
    //     `${urlMessages}`,
    //     {
    //       chatId: activeChat,
    //       content: newMessage.content,
    //       messageType: newMessage.messageType,
    //     }
    //   );

    //   const savedMessage = response.data;
    //   // ✅ 3. Replace temp message with real one from server
    //   setMessages((prev) =>
    //     prev.map((msg) =>
    //       msg.id === tempId ? savedMessage : msg
    //     )
    //   );
    // } catch (error) {
    //   console.error("Send message failed:", error);
    //   // ❌ rollback if failed
    //   setMessages((prev) =>
    //     prev.filter((msg) => msg.id !== tempId)
    //   );
    // }
    const message = {
      chatId: activeChat,
      senderId: "user-1",
      senderName: "You",
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      messageType: "TEXT",
    };

    // ✅ send to WebSocket
    sendMessage("/app/chat.send", message);

    // ✅ optimistic UI
    const completeMessage: MessageT = {
      id: Date.now().toString(),
      chatId: message.chatId,
      sender: message.senderId,
      content: message.content,
      // timestamp: message.timestamp,
      fileAttachments: [],
      messageType: 'TEXT',
      isRead: true,
      readAt: null,
      createdBy: message.senderName,
      isMine: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, completeMessage]);

    // if (msg.chatId === activeChat) {
    //   setMessages((prev) => [...prev, msg]);
    // }
  }

  return {
    chats,
    messages,
    addMessage,
  }
}
