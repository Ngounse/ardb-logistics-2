import type { StaticImageData } from "next/image"

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string | StaticImageData
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

export interface Chat {
  id: string
  name: string
  avatar?: string | StaticImageData
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  role?: string
}

export interface MessageT {
  id: string,
  sender: string,
  content: string,
  messageType: "TEXT" | "IMAGE" | "FILE",
  isRead: boolean,
  readAt: Date | null,
  createdAt: string,
  createdBy: string,
  isMine: boolean,
  fileAttachments: null | any[]
  chatId: string,
}

export interface ChatT {
  id: string,
  title: string,
  lastMessage: MessageT,
  status: "ACTIVE" | "INACTIVE",
  chatType: "PRIVATE" | "GROUP"
}
