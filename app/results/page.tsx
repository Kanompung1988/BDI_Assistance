"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Star, ExternalLink, Navigation } from "lucide-react"

interface Recommendation {
  name: string
  description: string
  rating?: number
  image?: string
  location?: string
  google_maps_url?: string
}

interface ResultData {
  recommendations?: Recommendation[]
  recommendation?: Recommendation
  analysis?: string
  message?: string
}

interface APIResponse {
  // Travel response format
  recommendations?: Recommendation[]
  recommendation?: Recommendation

  // Investment response format
  analysis?: string
  message?: string

  // Alternative formats
  data?: any
  result?: any
  places?: Recommendation[]
  suggestions?: Recommendation[]

  // Chat response format
  response?: string

  // Error handling
  error?: string
  status?: string
}

export default function ResultsPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState("")
  const router = useRouter()

  useEffect(() => {
    console.log("Results page mounted")

    const storedResult = sessionStorage.getItem("searchResult")
    const storedQuery = sessionStorage.getItem("searchQuery")
    const storedMode = sessionStorage.getItem("searchMode")

    console.log("Raw stored data:", {
      result: storedResult,
      query: storedQuery,
      mode: storedMode,
    })

    if (storedResult) {
      try {
        const parsedResult: APIResponse = JSON.parse(storedResult)
        console.log("Parsed result:", parsedResult)

        // Normalize the response structure
        const normalizedResult: ResultData = {
          recommendations:
            parsedResult.recommendations ||
            parsedResult.places ||
            parsedResult.suggestions ||
            parsedResult.data?.recommendations ||
            parsedResult.result?.recommendations ||
            [],
          recommendation:
            parsedResult.recommendation || parsedResult.data?.recommendation || parsedResult.result?.recommendation,
          analysis: parsedResult.analysis || parsedResult.data?.analysis || parsedResult.result?.analysis,
          message:
            parsedResult.message || parsedResult.response || parsedResult.data?.message || parsedResult.result?.message,
        }

        console.log("Normalized result:", normalizedResult)
        console.log("Result structure:", {
          hasRecommendations: !!normalizedResult.recommendations?.length,
          hasRecommendation: !!normalizedResult.recommendation,
          hasAnalysis: !!normalizedResult.analysis,
          hasMessage: !!normalizedResult.message,
          recommendationsLength: normalizedResult.recommendations?.length || 0,
        })

        setResultData(normalizedResult)
        setSearchQuery(storedQuery || "")
        setSearchMode(storedMode || "")
      } catch (error) {
        console.error("Error parsing stored result:", error)
        router.push("/error")
      }
    } else {
      console.log("No stored result found, redirecting to home")
      router.push("/")
    }
  }, [router])

  const openGoogleMaps = (url?: string, name?: string) => {
    if (url) {
      window.open(url, "_blank")
    } else if (name) {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}`
      window.open(searchUrl, "_blank")
    }
  }

  // เพิ่ม function นี้หลังจาก openGoogleMaps function
  const renderTextRecommendations = (data: any) => {
    // ตรวจสอบว่ามีข้อมูลแนะนำในรูปแบบ text หรือไม่
    const textContent =
      data.recommendations_text ||
      data.suggestion_text ||
      data.places_text ||
      data.text_recommendations ||
      data.formatted_recommendations

    if (textContent) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {searchMode === "tourist" ? "สถานที่แนะนำ" : "คำแนะนำทางธุรกิจ"}
          </h3>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{textContent}</div>
        </div>
      )
    }

    // หากไม่มี text format ให้แปลง JSON เป็น text
    if (recommendations.length > 0) {
      const textFormat = recommendations
        .map((rec, index) => {
          return `${index + 1}. ${rec.name || "ไม่ระบุชื่อ"}
   📍 ${rec.location || "ไม่ระบุตำแหน่ง"}
   ⭐ คะแนน: ${rec.rating || "ไม่มีคะแนน"}
   📝 ${rec.description || "ไม่มีคำอธิบาย"}
   ${rec.google_maps_url ? `🗺️ Google Maps: ${rec.google_maps_url}` : ""}
   
`
        })
        .join("")

      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {searchMode === "tourist" ? "สถานที่แนะนำ" : "คำแนะนำทางธุรกิจ"}
            <span className="text-sm font-normal text-gray-500 ml-2">({recommendations.length} รายการ)</span>
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">{textFormat}</pre>
          </div>
        </div>
      )
    }

    return null
  }

  /* ------------------------------------------------------------
   * Ensure recommendations is always an array to avoid
   * "recommendations.map is not a function" runtime errors
   * ---------------------------------------------------------- */
  let recommendations: Recommendation[] = []

  const rawRecs = resultData?.recommendations

  if (Array.isArray(rawRecs)) {
    recommendations = rawRecs
  } else if (rawRecs && typeof rawRecs === "object") {
    // Sometimes the API may return an object keyed by id;
    // convert it to an array of values.
    recommendations = Object.values(rawRecs as Record<string, Recommendation>)
  } else if (resultData?.recommendation) {
    recommendations = [resultData.recommendation]
  }

  // เพิ่มการตรวจสอบข้อมูลใน recommendation card
  const renderRecommendationCard = (rec: Recommendation, index: number) => (
    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
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
            <MapPin className="h-16 w-16 text-gray-400" />
          </div>
        )}
        {rec.rating && (
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{rec.rating}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.name || "ไม่ระบุชื่อ"}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{rec.description || "ไม่มีคำอธิบาย"}</p>

        {rec.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{rec.location}</span>
          </div>
        )}

        <button
          onClick={() => openGoogleMaps(rec.google_maps_url, rec.name)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Navigation className="h-4 w-4" />
          <span>ดูใน Google Maps</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log("Final recommendations array:", recommendations)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-semibold">Travel & Investment</h1>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                searchMode === "tourist" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}
            >
              {searchMode === "tourist" ? "นักท่องเที่ยว" : "ผู้ประกอบการ"}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">คำค้นหา:</h2>
          <p className="text-gray-600">"{searchQuery}"</p>
        </div>

        {/* Analysis Text (for business analysis) */}
        {resultData.analysis && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">การวิเคราะห์</h3>
            <div className="prose max-w-none text-gray-600">
              {resultData.analysis.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        {resultData.message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-800">{resultData.message}</p>
          </div>
        )}

        {/* Recommendations */}
        {renderTextRecommendations(resultData)}

        {/* Card Format (แสดงเฉพาะเมื่อมี recommendations และต้องการแสดงแบบ card) */}
        {recommendations.length > 0 && !resultData.recommendations_text && !resultData.suggestion_text && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {searchMode === "tourist" ? "สถานที่แนะนำ (รูปแบบการ์ด)" : "คำแนะนำทางธุรกิจ (รูปแบบการ์ด)"}
              <span className="text-sm font-normal text-gray-500 ml-2">({recommendations.length} รายการ)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => renderRecommendationCard(rec, index))}
            </div>
          </div>
        )}

        {/* No Results */}
        {recommendations.length === 0 && !resultData.analysis && !resultData.message && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบผลลัพธ์</h3>
            <p className="text-gray-600 mb-6">ลองปรับเปลี่ยนคำค้นหาหรือเงื่อนไขการค้นหา</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ค้นหาใหม่
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            ค้นหาใหม่
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            สอบถามเพิ่มเติม
          </button>
        </div>
      </main>
    </div>
  )
}
