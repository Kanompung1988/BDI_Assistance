"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Calculator,
  Leaf,
  Car,
  Bike,
  Footprints,
  Bus,
  Navigation,
  Award,
  TrendingDown,
  TreePine,
} from "lucide-react"

interface Location {
  name: string
  lat: number
  lng: number
}

interface CarbonResult {
  distance: number
  carbonFootprint: number
  greenPoints: number
  travelMode: string
  recommendations: string[]
}

export default function CarbonTrackerPage() {
  const [startLocation, setStartLocation] = useState<Location>({
    name: "นิมมานเหมินทร์",
    lat: 18.8022,
    lng: 98.9525,
  })
  const [endLocation, setEndLocation] = useState<Location>({
    name: "ประตูท่าแพ",
    lat: 18.7869,
    lng: 98.9953,
  })
  const [travelMode, setTravelMode] = useState<string>("driving")
  const [result, setResult] = useState<CarbonResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateCarbonFootprint = (distance: number, mode: string) => {
    // Carbon emission factors (kg CO2 per km)
    const emissionFactors = {
      walking: 0.0,
      bicycling: 0.02,
      driving: 0.21,
      transit: 0.12,
      motorcycle: 0.15,
    }

    // Green points calculation
    const greenPointsMap = {
      walking: 100,
      bicycling: 85,
      transit: 60,
      motorcycle: 40,
      driving: 25,
    }

    const carbonPerKm = emissionFactors[mode as keyof typeof emissionFactors] || 0.21
    const carbonFootprint = distance * carbonPerKm * 1000 // Convert to grams
    const greenPoints = greenPointsMap[mode as keyof typeof greenPointsMap] || 25

    // Generate recommendations
    const recommendations = []
    if (mode === "driving") {
      recommendations.push("🚌 ลองใช้รถสาธารณะแทน ลดคาร์บอนได้ 43%")
      recommendations.push("🚲 ปั่นจักรยานลดคาร์บอนได้ 90%")
      if (distance < 2) {
        recommendations.push("🚶‍♂️ เดินเท้าได้ ลดคาร์บอน 100%")
      }
    } else if (mode === "transit") {
      recommendations.push("🚲 ปั่นจักรยานเป็นมิตรกับสิ่งแวดล้อมมากกว่า")
      if (distance < 3) {
        recommendations.push("🚶‍♂️ เดินเท้าได้ ลดคาร์บอน 100%")
      }
    } else if (mode === "bicycling") {
      recommendations.push("🌟 ทางเลือกที่ดีมาก! เป็นมิตรกับสิ่งแวดล้อม")
    } else if (mode === "walking") {
      recommendations.push("🏆 ยอดเยี่ยม! ไม่ปล่อยคาร์บอนเลย")
    }

    return {
      distance,
      carbonFootprint,
      greenPoints,
      travelMode: mode,
      recommendations,
    }
  }

  const handleCalculate = async () => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const distance = calculateDistance(startLocation.lat, startLocation.lng, endLocation.lat, endLocation.lng)

    const result = calculateCarbonFootprint(distance, travelMode)
    setResult(result)
    setIsLoading(false)
  }

  const travelModes = [
    { value: "walking", label: "เดินเท้า", icon: Footprints, color: "green" },
    { value: "bicycling", label: "จักรยาน", icon: Bike, color: "blue" },
    { value: "transit", label: "รถสาธารณะ", icon: Bus, color: "purple" },
    { value: "motorcycle", label: "รถจักรยานยนต์", icon: Car, color: "orange" },
    { value: "driving", label: "รถยนต์", icon: Car, color: "red" },
  ]

  const popularLocations = [
    { name: "นิมมานเหมินทร์", lat: 18.8022, lng: 98.9525 },
    { name: "ประตูท่าแพ", lat: 18.7869, lng: 98.9953 },
    { name: "ตลาดวโรรส", lat: 18.7906, lng: 98.992 },
    { name: "ดอยสุเทพ", lat: 18.8048, lng: 98.9216 },
    { name: "สนามบินเชียงใหม่", lat: 18.7669, lng: 98.9625 },
    { name: "เซ็นทรัลเฟสติวัล", lat: 18.8041, lng: 98.9767 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <Leaf className="h-8 w-8 text-green-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Carbon Credit Tracker</h1>
                <p className="text-green-200 text-lg">คำนวณคาร์บอนฟุตพริ้นท์และคะแนนสีเขียว</p>
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
        {/* Calculator Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">คำนวณคาร์บอนฟุตพริ้นท์</h2>
            <p className="text-xl text-gray-600">เลือกจุดเริ่มต้น จุดหมาย และวิธีการเดินทาง</p>
          </div>

          <div className="space-y-8">
            {/* Start Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <MapPin className="inline h-5 w-5 mr-2 text-green-600" />
                จุดเริ่มต้น
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={startLocation.name}
                  onChange={(e) => {
                    const selected = popularLocations.find((loc) => loc.name === e.target.value)
                    if (selected) setStartLocation(selected)
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {popularLocations.map((location) => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={`${startLocation.lat.toFixed(4)}, ${startLocation.lng.toFixed(4)}`}
                  onChange={(e) => {
                    const coords = e.target.value.split(",")
                    if (coords.length === 2) {
                      const lat = Number.parseFloat(coords[0].trim())
                      const lng = Number.parseFloat(coords[1].trim())
                      if (!isNaN(lat) && !isNaN(lng)) {
                        setStartLocation({ ...startLocation, lat, lng })
                      }
                    }
                  }}
                  placeholder="พิกัด (lat, lng)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* End Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Navigation className="inline h-5 w-5 mr-2 text-red-600" />
                จุดหมาย
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={endLocation.name}
                  onChange={(e) => {
                    const selected = popularLocations.find((loc) => loc.name === e.target.value)
                    if (selected) setEndLocation(selected)
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {popularLocations.map((location) => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={`${endLocation.lat.toFixed(4)}, ${endLocation.lng.toFixed(4)}`}
                  onChange={(e) => {
                    const coords = e.target.value.split(",")
                    if (coords.length === 2) {
                      const lat = Number.parseFloat(coords[0].trim())
                      const lng = Number.parseFloat(coords[1].trim())
                      if (!isNaN(lat) && !isNaN(lng)) {
                        setEndLocation({ ...endLocation, lat, lng })
                      }
                    }
                  }}
                  placeholder="พิกัด (lat, lng)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Travel Mode */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Car className="inline h-5 w-5 mr-2 text-blue-600" />
                วิธีการเดินทาง
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {travelModes.map((mode) => {
                  const IconComponent = mode.icon
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setTravelMode(mode.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                        travelMode === mode.value
                          ? `border-${mode.color}-500 bg-${mode.color}-50 text-${mode.color}-700`
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <IconComponent className="h-8 w-8" />
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>กำลังคำนวณ...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-6 w-6" />
                  <span>คำนวณคาร์บอนฟุตพริ้นท์</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Main Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Distance */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 rounded-2xl p-3">
                    <Navigation className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">ระยะทาง</h3>
                    <p className="text-blue-600 font-semibold">{result.distance.toFixed(2)} กิโลเมตร</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  จาก {startLocation.name} ไป {endLocation.name}
                </p>
              </div>

              {/* Carbon Footprint */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-red-100 rounded-2xl p-3">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">คาร์บอนฟุตพริ้นท์</h3>
                    <p className="text-red-600 font-semibold">{result.carbonFootprint.toFixed(0)} กรัม CO₂</p>
                  </div>
                </div>
                <p className="text-gray-600">ปริมาณคาร์บอนที่ปล่อยออกมา</p>
              </div>

              {/* Green Points */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 rounded-2xl p-3">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">คะแนนสีเขียว</h3>
                    <p className="text-green-600 font-semibold">{result.greenPoints}/100 คะแนน</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.greenPoints}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <TreePine className="h-8 w-8 text-green-600" />
                <span>คำแนะนำเพื่อสิ่งแวดล้อม</span>
              </h3>
              <div className="space-y-4">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-medium">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-10 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-6">ผลกระทบต่อสิ่งแวดล้อม</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-green-800 mb-3">เทียบเท่ากับ:</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>🌳 ต้นไม้ {(result.carbonFootprint / 22000).toFixed(3)} ต้น (ต่อปี)</li>
                    <li>💡 หลับไฟ LED {(result.carbonFootprint / 10).toFixed(0)} หลอด (1 ชั่วโมง)</li>
                    <li>📱 ชาร์จมือถือ {(result.carbonFootprint / 8.3).toFixed(0)} ครั้ง</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-800 mb-3">วิธีลดคาร์บอน:</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>🚲 ปั่นจักรยานแทนขับรถ</li>
                    <li>🚌 ใช้รถสาธารณะ</li>
                    <li>🚶‍♂️ เดินเท้าระยะใกล้</li>
                    <li>🌱 ปลูกต้นไม้เพื่อดูดซับ CO₂</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="bg-green-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Carbon Neutral</h3>
            <p className="text-gray-600">เป้าหมายลดการปล่อยคาร์บอนสุทธิเป็นศูนย์</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="bg-blue-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Green Points</h3>
            <p className="text-gray-600">สะสมคะแนนจากการเดินทางที่เป็นมิตรกับสิ่งแวดล้อม</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="bg-purple-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <TreePine className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Travel</h3>
            <p className="text-gray-600">ท่องเที่ยวอย่างยั่งยืนเพื่ออนาคตที่ดีกว่า</p>
          </div>
        </div>
      </main>
    </div>
  )
}
