"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, MapPin, DollarSign, Building2, Users, BarChart3 } from "lucide-react"
import { APIService } from "@/lib/api-service"

export default function InvestmentPage() {
  const [investMessage, setInvestMessage] = useState(
    "เป็นนักลงทุนรายใหม่ งบ 4000000 เปิดคาเฟ่ข้างเมญ่า อยากรู้ว่าควรทำขนมประมาณไหนดี ควรวางกลยุทธ์ทางการตลาดยังไง",
  )
  const [placeName, setPlaceName] = useState("เมญ่า")
  const [province, setProvince] = useState("เชียงใหม่")
  const [entrepreneurType, setEntrepreneurType] = useState("new")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!investMessage.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      // Geocode the location (simplified - using default coordinates)
      const lat = 18.8022
      const lon = 98.9525

      const data = await APIService.recommendNewInvestment({
        user_message: investMessage,
        location: `${lat},${lon}`,
        entrepreneur_type: entrepreneurType,
      })

      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: "เกิดข้อผิดพลาดในการขอคำแนะนำ กรุณาลองใหม่อีกครั้ง" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <TrendingUp className="h-8 w-8 text-green-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">New Investment Recommendation</h1>
                <p className="text-green-200 text-lg">คำแนะนำการลงทุนใหม่</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors hover:bg-white/10 px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Investment Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">แผนการลงทุนของคุณ</h2>
            <p className="text-xl text-gray-600">อธิบายแผนการลงทุน งบประมาณ และเป้าหมายของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <DollarSign className="inline h-5 w-5 mr-2" />
                อธิบายแผนการลงทุนของคุณ
              </label>
              <textarea
                value={investMessage}
                onChange={(e) => setInvestMessage(e.target.value)}
                placeholder="เช่น: เป็นนักลงทุนรายใหม่ งบ 4,000,000 บาท อยากเปิดคาเฟ่ข้างเมญ่า..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-lg leading-relaxed"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  สถานที่
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="เช่น เมญ่า"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  <Building2 className="inline h-5 w-5 mr-2" />
                  จังหวัด
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="เช่น เชียงใหม่"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  <Users className="inline h-5 w-5 mr-2" />
                  ประเภทผู้ประกอบการ
                </label>
                <select
                  value={entrepreneurType}
                  onChange={(e) => setEntrepreneurType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="new">นักลงทุนใหม่</option>
                  <option value="experienced">มีประสบการณ์</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !investMessage.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="h-6 w-6" />
                  <span>ขอคำแนะนำการลงทุน</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {result.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-red-800 font-bold text-xl">เกิดข้อผิดพลาด</h3>
                    <p className="text-red-700 text-lg">{result.error}</p>
                  </div>
                </div>
              </div>
            )}

            {(result.recommendation || result.analysis || result.message) && (
              <div className="bg-white rounded-2xl shadow-xl p-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <span>คำแนะนำการลงทุน</span>
                </h3>
                <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                  {(result.recommendation || result.analysis || result.message || "")
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="bg-green-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">การวิเคราะห์งบประมาณ</h3>
            <p className="text-gray-600">วิเคราะห์งบประมาณที่เหมาะสมสำหรับการลงทุน</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="bg-blue-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">การวิเคราะห์ทำเล</h3>
            <p className="text-gray-600">ประเมินความเหมาะสมของทำเลที่ตั้ง</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="bg-purple-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">กลยุทธ์การตลาด</h3>
            <p className="text-gray-600">แนะนำกลยุทธ์การตลาดที่เหมาะสม</p>
          </div>
        </div>
      </main>
    </div>
  )
}
