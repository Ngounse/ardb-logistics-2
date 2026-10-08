"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, CheckCheck } from "lucide-react"
import Image from "next/image"
import type { Message, MessageT } from "./types"
import { FormatTimestamp } from "@/lib/function"

interface ChatMessageProps {
  message: MessageT
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // const getStatusIcon = (status: MessageT["status"]) => {
  //   switch (status) {
  //     case "sent":
  //       return <Check className="h-3 w-3 text-muted-foreground" />
  //     case "delivered":
  //       return <CheckCheck className="h-3 w-3 text-muted-foreground" />
  //     case "read":
  //       return <CheckCheck className="h-3 w-3 text-blue-500" />
  //     case "ACTIVE":
  //       return <CheckCheck className="h-3 w-3 text-green-500" />
  //   }
  // }

  return (
    // is "isMine": true, then align right and use primary color, else align left and use muted color
    <div className={`flex items-start gap-3 ${message.isMine ? "justify-end" : "justify-start"}`}>
      {!message.isMine && (
        <Avatar className="h-6 sm:h-8 w-6 sm:w-8 mt-1 flex-shrink-0">
          {/* <Image src={"/placeholder.svg"} alt={message.title} /> */}
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(message.createdBy)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 min-w-0 ${message.isMine ? "ml-12" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{message.isMine ? "You" : message.createdBy}</span>
          <span className="text-xs text-muted-foreground">{FormatTimestamp(message.createdAt)}</span>
        </div>
        <div
          className={`inline-block sm:max-w-[85%] p-3 rounded-lg break-words ${message.isMine ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
            }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.id}</p>
        </div>

        {message.isRead && (
          <div className="flex items-center justify-end gap-1 mt-1">{<CheckCheck className="h-3 w-3 text-blue-500" />}</div>
        )}
      </div>

      {message.id === "current" && <div className="w-8 flex-shrink-0" />}
    </div>
  )
}
