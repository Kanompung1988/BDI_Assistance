"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react"

export default function ErrorPage() {
  const router = useRouter()

  const handleRetry = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">เกิดข้อผิดพลาด</h2>
          <p className="mt-2 text-sm text-gray-600">เกิดข้อผิดพลาดขณะติดต่อระบบ กรุณาลองใหม่ภายหลัง</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>ลองใหม่อีกครั้ง</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>กลับหน้าหลัก</span>
          </button>

          <button
            onClick={() => router.push("/chat")}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>ติดต่อสอบถาม</span>
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">ปัญหาที่อาจเกิดขึ้น</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>ระบบกำลังอัปเดต</li>
                  <li>การเชื่อมต่ออินเทอร์เน็ตไม่เสถียร</li>
                  <li>เซิร์ฟเวอร์ชั่วคราวไม่สามารถใช้งานได้</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">หากปัญหายังคงอยู่ กรุณาติดต่อทีมสนับสนุน</p>
      </div>
    </div>
  )
}
