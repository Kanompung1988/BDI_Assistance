"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  MessageCircle,
  Search,
  TrendingUp,
  Camera,
  Navigation,
  BarChart3,
  Route,
  Users,
  Building2,
  Leaf,
  Map,
} from "lucide-react"
import { APIService } from "@/lib/api-service"

export default function HomePage() {
  const [mode, setMode] = useState<"tourist" | "entrepreneur">("tourist")
  const [userMessage, setUserMessage] = useState("")
  const [location, setLocation] = useState("18.8022,98.9525")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    setIsLoading(true)
    setResults(null)

    try {
      let result

      if (mode === "tourist") {
        result = await APIService.recommendPlaces({
          user_message: userMessage,
          location: location,
          radius: 3000,
        })
      } else {
        // ตรวจสอบว่าเป็นนักลงทุนใหม่หรือวิเคราะห์ธุรกิจเดิม
        const isNewBusiness =
          userMessage.toLowerCase().includes("เปิดใหม่") ||
          userMessage.toLowerCase().includes("ธุรกิจใหม่") ||
          userMessage.toLowerCase().includes("เริ่มต้น") ||
          userMessage.toLowerCase().includes("ลงทุน") ||
          userMessage.toLowerCase().includes("งบ")

        if (isNewBusiness) {
          result = await APIService.recommendNewInvestment({
            user_message: userMessage,
            location: location,
            entrepreneur_type: "new",
          })
        } else {
          result = await APIService.analyzeExistingBusiness({
            business_name: userMessage,
            location: location,
            category: "general",
          })
        }
      }
      setResults(result)
    } catch (error) {
      console.error("Error:", error)
      // Fallback to typhoon chat
      try {
        const fallbackResult = await APIService.chatWithTyphoon({
          messages: [{ role: "user", content: userMessage }],
        })
        setResults({ message: fallbackResult.response || fallbackResult.message })
      } catch (fallbackError) {
        router.push("/error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const openGoogleMaps = (url?: string, name?: string) => {
    if (url) {
      window.open(url, "_blank")
    } else if (name) {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}`
      window.open(searchUrl, "_blank")
    }
  }

  const renderRecommendationCard = (rec: any, index: number) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {rec.image ? (
          <img
            src={rec.image || "/placeholder.svg"}
            alt={rec.name || "สถานที่แนะนำ"}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=200&width=300"
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-16 w-16 text-blue-400" />
          </div>
        )}
        {rec.rating && (
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-bold">{rec.rating}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{rec.name || "ไม่ระบุชื่อ"}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{rec.description || "ไม่มีคำอธิบาย"}</p>

        {rec.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span>{rec.location}</span>
          </div>
        )}

        <button
          onClick={() => openGoogleMaps(rec.google_maps_url, rec.name)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Navigation className="h-5 w-5" />
          <span>ดูใน Google Maps</span>
        </button>
      </div>
    </div>
  )

  const quickSuggestions =
    mode === "tourist"
      ? [
          "หาร้านสเต็ก เหมาะสำหรับนั่งกินคนเดียว ฟังเพลงชิวๆ มีที่จอดรถ มีเงิน 2000 บาท",
          "คาเฟ่บรรยากาศดี วิวสวย เหมาะถ่ายรูป",
          "ร้านอาหารเจ มังสวิรัติ ราคาไม่แพง",
          "ร้านอาหารเกาหลี อร่อย ใกล้นิมมาน",
        ]
      : [
          "เป็นนักลงทุนรายใหม่ งบ 4000000 เปิดคาเฟ่ข้างเมญ่า อยากรู้ว่าควรทำขนมประมาณไหนดี",
          "วิเคราะห์ร้านข้าวมันไก่นิมมาน",
          "อยากเปิดร้านอาหารใหม่ งบ 2 ล้าน ที่ไหนดี",
          "ปรับปรุงร้านกาแฟเดิม เพิ่มยอดขาย",
        ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-3 shadow-lg">
                <span className="text-white font-bold text-xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  BDI Assistant
                </h1>
                <p className="text-blue-200 text-sm">ผู้ช่วยอัจฉริยะสำหรับนักท่องเที่ยวและผู้ประกอบการ</p>
              </div>
            </div>
            <nav className="flex space-x-2">
              <button
                onClick={() => router.push("/chat")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                <span>แชท</span>
              </button>
              <button
                onClick={() => router.push("/upload")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <Camera className="h-4 w-4" />
                <span>วิเคราะห์ภาพ</span>
              </button>
              <button
                onClick={() => router.push("/investment")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <TrendingUp className="h-4 w-4" />
                <span>การลงทุน</span>
              </button>
              <button
                onClick={() => router.push("/business")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <Building2 className="h-4 w-4" />
                <span>วิเคราะห์ธุรกิจ</span>
              </button>
              <button
                onClick={() => router.push("/carbon-tracker")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <Leaf className="h-4 w-4" />
                <span>คาร์บอนเครดิต</span>
              </button>
              <button
                onClick={() => router.push("/maps")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <Map className="h-4 w-4" />
                <span>แผนที่</span>
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-200 hover:text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-white/10"
              >
                <BarChart3 className="h-4 w-4" />
                <span>แดชบอร์ด</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            ค้นพบเชียงใหม่ด้วย AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            ระบบแนะนำสถานที่ท่องเที่ยวและวิเคราะห์โอกาสทางธุรกิจ ด้วยเทคโนโลยี AI ที่ทันสมัย
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center space-x-6 mb-12">
            <button
              onClick={() => setMode("tourist")}
              className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg ${
                mode === "tourist"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/25 transform scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl"
              }`}
            >
              <Users className="h-6 w-6" />
              <span>นักท่องเที่ยว</span>
            </button>
            <button
              onClick={() => setMode("entrepreneur")}
              className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg ${
                mode === "entrepreneur"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25 transform scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-xl"
              }`}
            >
              <TrendingUp className="h-6 w-6" />
              <span>ผู้ประกอบการ</span>
            </button>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                    {mode === "tourist" ? "คุณกำลังมองหาสถานที่แบบไหน?" : "อธิบายแผนการลงทุนของคุณ"}
                  </label>
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder={
                      mode === "tourist"
                        ? "เช่น: หาร้านอาหารเกาหลีอร่อยๆ ใกล้นิมมาน หรือ แนะนำคาเฟ่บรรยากาศดี"
                        : "เช่น: ผมมีงบ 3 ล้าน อยากเปิดคาเฟ่ที่ประตูท่าแพ หรือ วิเคราะห์ร้านข้าวมันไก่นิมมาน"
                    }
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg font-prompt leading-relaxed"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ตำแหน่ง (Lat, Lng)"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isLoading || !userMessage.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>กำลังค้นหา...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-6 w-6" />
                          <span>ถามเลย</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setUserMessage(suggestion)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <span className="text-blue-600 mr-2">💡</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mb-16">
            {/* Error Message */}
            {results.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-red-500 text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-red-800 font-bold text-xl">เกิดข้อผิดพลาด</h3>
                    <p className="text-red-700 text-lg">{results.error}</p>
                    <button
                      onClick={() => setResults(null)}
                      className="mt-3 text-red-600 hover:text-red-800 font-semibold"
                    >
                      ลองใหม่
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis/Message */}
            {(results.analysis || results.message || results.recommendations || results.recommendation) && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {mode === "tourist" ? "🏪 คำแนะนำสำหรับคุณ" : "💼 การวิเคราะห์ทางธุรกิจ"}
                </h3>
                <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                  {(results.analysis || results.message || results.recommendations || results.recommendation || "")
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {/* Recommendations Cards */}
            {results.recommendations &&
              Array.isArray(results.recommendations) &&
              results.recommendations.length > 0 && (
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    {mode === "tourist" ? "🏪 สถานที่แนะนำ" : "💼 โอกาสทางธุรกิจ"}
                    <span className="text-xl font-normal text-gray-500 ml-3">
                      ({results.recommendations.length} รายการ)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.recommendations.map((rec: any, index: number) => renderRecommendationCard(rec, index))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* AI Travel Chatbot */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Travel Chatbot</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              แชทสนทนากับ AI เพื่อขอคำแนะนำเกี่ยวกับสถานที่ท่องเที่ยว ร้านอาหาร และกิจกรรมต่างๆ
            </p>
            <button
              onClick={() => router.push("/chat")}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-2 group"
            >
              <span>เริ่มแชท</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Carbon Credit Tracker */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => router.push("/carbon-tracker")}
          >
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Carbon Credit Tracker</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">คำนวณคาร์บอนฟุตพริ้นท์และรับคะแนนสีเขียวจากการเดินทาง</p>
            <p className="text-sm text-gray-500">Environmental impact calculator</p>
          </div>

          {/* Traffic Monitor */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => router.push("/maps")}
          >
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Map className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Traffic Monitor</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">ติดตามการจราจรนิมมานเหมินทร์แบบเรียลไทม์</p>
            <p className="text-sm text-gray-500">Real-time traffic data</p>
          </div>

          {/* Business Dashboard */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Business Dashboard</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">แดชบอร์ดวิเคราะห์ธุรกิจและ ROI</p>
            <p className="text-sm text-gray-500">Business analytics & insights</p>
          </div>

          {/* Investment Analytics */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Investment Analytics</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">วิเคราะห์โอกาสการลงทุนและแนวโน้มตลาด</p>
            <p className="text-sm text-gray-500">Data-driven business insights</p>
          </div>

          {/* Image Analysis */}
          <div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 cursor-pointer transform hover:-translate-y-1"
            onClick={() => router.push("/upload")}
          >
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Camera className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Image Analysis</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">อัปโหลดภาพเพื่อวิเคราะห์ข้อมูลและรับคำแนะนำ</p>
            <p className="text-sm text-gray-500">OCR และ AI image processing</p>
          </div>

          {/* Route Optimization */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Route className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Route Optimization</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">วางแผนเส้นทางท่องเที่ยวที่เหมาะสมและประหยัดเวลา</p>
            <p className="text-sm text-gray-500">AI-powered itinerary planning</p>
          </div>

          {/* Real-time Data */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Data</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">ข้อมูลสดจาก Google Maps และ Weather API</p>
            <p className="text-sm text-gray-500">Live tourism data integration</p>
          </div>
        </div>
      </main>
    </div>
  )
}
