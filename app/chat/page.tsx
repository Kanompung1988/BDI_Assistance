"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Bot, User, MessageCircle } from "lucide-react"
import { APIService } from "@/lib/api-service"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "สวัสดีครับ! ผมเป็น BDI Assistant ที่พร้อมช่วยตอบคำถามเกี่ยวกับสถานที่ท่องเที่ยว ร้านอาหาร และคำแนะนำทางธุรกิจในเชียงใหม่ มีอะไรให้ช่วยไหมครับ? 😊",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const data = await APIService.chatWithTyphoon({
        messages: [
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: inputMessage },
        ],
      })

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || data.message || "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "ขออภัย เกิดข้อผิดพลาดในการติดต่อระบบ กรุณาลองใหม่อีกครั้ง 🙏",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const quickActions = [
    "แนะนำร้านอาหารอร่อยๆ ในนิมมาน",
    "คาเฟ่บรรยากาศดีเชียงใหม่",
    "ขอคำแนะนำเปิดร้านกาแฟ",
    "สถานที่ท่องเที่ยวน่าสนใจ",
    "ร้านอาหารเจ/มังสวิรัติ",
    "ตลาดนัดวันเสาร์อาทิตย์",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-orange-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl p-2 shadow-lg">
                <MessageCircle className="h-6 w-6 text-amber-800" />
              </div>
              <div>
                <h1 className="text-xl font-bold">BDI Chat Assistant</h1>
                <p className="text-amber-100 text-sm">แชทสนทนากับ AI</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-amber-100 hover:text-white transition-colors hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col mb-6">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-xs lg:max-w-2xl ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div
                    className={`rounded-2xl px-6 py-4 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-2xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-6">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="พิมพ์คำถามของคุณ..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-prompt"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">ส่ง</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action)}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-amber-300 hover:shadow-md transition-all duration-300"
            >
              <p className="text-sm font-medium text-gray-900">{action}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
