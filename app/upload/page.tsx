"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, FileText, AlertCircle, Camera, CheckCircle, ImageIcon } from "lucide-react"
import { APIService } from "@/lib/api-service"

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files)

    // Check if total files exceed 5
    if (fileArray.length > 5) {
      setError("คุณสามารถอัปโหลดได้สูงสุด 5 ไฟล์")
      return
    }

    // Validate each file
    const validFiles: File[] = []
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, JPEG)")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 10MB")
        return
      }

      validFiles.push(file)
    }

    setSelectedFiles(validFiles)
    setError(null)
    setResult(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await APIService.analyzeImages(selectedFiles)
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setError("เกิดข้อผิดพลาดในการวิเคราะห์ภาพ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFiles([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-800 to-red-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <Camera className="h-8 w-8 text-orange-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Image Analysis</h1>
                <p className="text-orange-200 text-lg">วิเคราะห์ภาพด้วย AI</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-orange-200 hover:text-white transition-colors hover:bg-white/10 px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">อัปโหลดภาพเพื่อวิเคราะห์</h2>
            <p className="text-xl text-gray-600">
              อัปโหลดภาพร้าน เมนู หรือป้ายต่างๆ เพื่อให้ระบบ AI วิเคราะห์และให้คำแนะนำ (สูงสุด 5 ไฟล์)
            </p>
          </div>

          {selectedFiles.length === 0 && !result && (
            <div
              className={`border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
                dragActive
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-24 w-24 text-orange-400 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</h3>
                <p className="text-gray-600 mb-8 text-xl">รองรับไฟล์ PNG, JPG, JPEG ขนาดไม่เกิน 10MB (สูงสุด 5 ไฟล์)</p>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 inline-block shadow-lg">
                  เลือกไฟล์ภาพ
                </div>
              </label>
            </div>
          )}

          {selectedFiles.length > 0 && !result && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border-2 border-orange-200">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <span>ไฟล์ที่เลือก ({selectedFiles.length} ไฟล์)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-lg text-gray-900 mb-2 truncate">{file.name}</p>
                      <p className="text-gray-600 text-sm">ขนาด: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-6">
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 px-10 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span>กำลังวิเคราะห์...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-8 w-8" />
                      <span>วิเคราะห์ภาพทั้งหมด</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetUpload}
                  className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  เลือกใหม่
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 flex items-start space-x-4">
              <AlertCircle className="h-10 w-10 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-red-800 font-bold text-xl">เกิดข้อผิดพลาด</h4>
                <p className="text-red-700 text-lg mt-2">{error}</p>
                <button onClick={() => setError(null)} className="mt-4 text-red-600 hover:text-red-800 font-semibold">
                  ลองใหม่
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10">
                <h3 className="text-3xl font-bold text-green-800 mb-8 flex items-center space-x-3">
                  <FileText className="h-8 w-8" />
                  <span>ผลการวิเคราะห์</span>
                </h3>

                {/* Individual Image Analysis */}
                {result.analysis?.images && (
                  <div className="space-y-8">
                    {result.analysis.images.map((imgAnalysis: any, index: number) => (
                      <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <ImageIcon className="h-6 w-6 text-blue-500" />
                          <span>
                            ภาพที่ {index + 1}: {imgAnalysis.image_path?.split("_")?.pop() || `Image ${index + 1}`}
                          </span>
                        </h4>
                        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                          {imgAnalysis.description?.split("\n").map((paragraph: string, pIndex: number) => (
                            <p key={pIndex} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Personality Analysis */}
                {result.analysis?.personality_analysis && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mt-8">
                    <h4 className="text-2xl font-bold text-blue-800 mb-4">การวิเคราะห์บุคลิกภาพ</h4>
                    <div className="prose max-w-none text-blue-700 text-lg leading-relaxed">
                      {result.analysis.personality_analysis.split("\n").map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Analysis */}
                {(result.analysis || result.description) && !result.analysis?.images && (
                  <div className="prose max-w-none text-green-700 text-lg leading-relaxed">
                    {(result.analysis || result.description).split("\n").map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-6">
                <button
                  onClick={resetUpload}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 px-10 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                >
                  วิเคราะห์ภาพใหม่
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-3xl p-10 border-2 border-blue-200">
          <h3 className="text-3xl font-bold text-blue-900 mb-6">ความสามารถของระบบ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-blue-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">อ่านข้อความในภาพ (OCR)</h4>
              <p className="text-gray-600">ระบบสามารถอ่านและแปลงข้อความในภาพเป็นข้อมูลดิจิทัล</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-green-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">วิเคราะห์เนื้อหาภาพ</h4>
              <p className="text-gray-600">ระบุวัตถุ บุคคล และสิ่งต่างๆ ในภาพพร้อมคำอธิบาย</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-purple-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">ให้คำแนะนำ</h4>
              <p className="text-gray-600">วิเคราะห์และให้คำแนะนำเชิงธุรกิจจากภาพที่อัปโหลด</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
