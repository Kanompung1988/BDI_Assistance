"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, MapPin, Tag, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { APIService } from "@/lib/api-service"

export default function BusinessAnalysisPage() {
  const [businessName, setBusinessName] = useState("ร้านข้าวมันไก่นิมมาน")
  const [placeName, setPlaceName] = useState("นิมมานเหมินทร์")
  const [province, setProvince] = useState("เชียงใหม่")
  const [category, setCategory] = useState("food")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      // Check if placeName is already in lat,lon format
      let lat, lon
      if (placeName.includes(",") && placeName.split(",").length === 2) {
        ;[lat, lon] = placeName.split(",").map((coord) => Number.parseFloat(coord.trim()))
      } else {
        // Use default coordinates for Nimman
        lat = 18.8022
        lon = 98.9525
      }

      const data = await APIService.analyzeExistingBusiness({
        business_name: businessName,
        location: `${lat},${lon}`,
        category: category,
      })

      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: "เกิดข้อผิดพลาดในการวิเคราะห์ธุรกิจ กรุณาลองใหม่อีกครั้ง" })
    } finally {
      setIsLoading(false)
    }
  }

  const businessCategories = [
    { value: "food", label: "ร้านอาหาร" },
    { value: "cafe", label: "คาเฟ่" },
    { value: "retail", label: "ร้านค้าปลีก" },
    { value: "service", label: "ธุรกิจบริการ" },
    { value: "entertainment", label: "ธุรกิจบันเทิง" },
    { value: "general", label: "ทั่วไป" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <Building2 className="h-8 w-8 text-purple-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Existing Business Analysis</h1>
                <p className="text-purple-200 text-lg">วิเคราะห์ธุรกิจที่มีอยู่</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors hover:bg-white/10 px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Business Analysis Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">วิเคราะห์ธุรกิจของคุณ</h2>
            <p className="text-xl text-gray-600">ใส่ข้อมูลธุรกิจเพื่อรับการวิเคราะห์เชิงลึก</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Building2 className="inline h-5 w-5 mr-2" />
                ชื่อธุรกิจ
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="เช่น ร้านข้าวมันไก่นิมมาน"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  สถานที่ / พิกัด
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="เช่น นิมมานเหมินทร์ หรือ 18.8022,98.9525"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  <Tag className="inline h-5 w-5 mr-2" />
                  ประเภทธุรกิจ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {businessCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !businessName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="h-6 w-6" />
                  <span>วิเคราะห์ธุรกิจ</span>
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

            {(result.analysis || result.message) && (
              <div className="bg-white rounded-2xl shadow-xl p-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <span>ผลการวิเคราะห์ธุรกิจ</span>
                </h3>
                <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                  {(result.analysis || result.message || "").split("\n").map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="bg-blue-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">แนวโน้มตลาด</h3>
            <p className="text-gray-600 text-sm">วิเคราะห์แนวโน้มและโอกาสในตลาด</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="bg-green-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">กลุ่มลูกค้า</h3>
            <p className="text-gray-600 text-sm">วิเคราะห์กลุ่มเป้าหมายและพฤติกรรม</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="bg-purple-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ทำเลที่ตั้ง</h3>
            <p className="text-gray-600 text-sm">ประเมินความเหมาะสมของทำเล</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="bg-orange-100 rounded-2xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ผลตอบแทน</h3>
            <p className="text-gray-600 text-sm">คาดการณ์ผลตอบแทนการลงทุน</p>
          </div>
        </div>
      </main>
    </div>
  )
}
