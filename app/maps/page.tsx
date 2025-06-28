"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Navigation, AlertTriangle, TrendingUp, Clock, Cloud, Thermometer, Wind } from "lucide-react"

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

interface TrafficHotspot {
  lat: number
  lng: number
  intensity: "high" | "medium" | "low"
  description: string
}

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function MapsPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trafficData, setTrafficData] = useState<TrafficHotspot[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const router = useRouter()

  // Mock traffic hotspots in Nimman area
  const nimmanTrafficHotspots: TrafficHotspot[] = [
    {
      lat: 18.8022,
      lng: 98.9525,
      intensity: "high",
      description: "นิมมานเหมินทร์ - หน้า Maya Mall",
    },
    {
      lat: 18.8035,
      lng: 98.9515,
      intensity: "medium",
      description: "ถนนนิมมานเหมินทร์ ซอย 1",
    },
    {
      lat: 18.8045,
      lng: 98.9535,
      intensity: "high",
      description: "สี่แยกนิมมาน - One Nimman",
    },
    {
      lat: 18.8015,
      lng: 98.9545,
      intensity: "medium",
      description: "ถนนนิมมานเหมินทร์ ซอย 3",
    },
    {
      lat: 18.8055,
      lng: 98.9525,
      intensity: "low",
      description: "ถนนนิมมานเหมินทร์ ซอย 5",
    },
    {
      lat: 18.8025,
      lng: 98.9505,
      intensity: "high",
      description: "หน้า Think Park",
    },
  ]

  useEffect(() => {
    setTrafficData(nimmanTrafficHotspots)
    loadGoogleMapsScript()
    fetchWeatherData()

    // Update traffic data every 30 seconds
    const trafficInterval = setInterval(() => {
      updateTrafficData()
    }, 30000)

    // Update weather data every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchWeatherData()
    }, 600000)

    return () => {
      clearInterval(trafficInterval)
      clearInterval(weatherInterval)
    }
  }, [])

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=18.8022&lon=98.9525&appid=973959347b8a6178b1089d57b2fddf0a&units=metric&lang=th`,
      )
      const data = await response.json()

      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      })
    } catch (error) {
      console.error("Error fetching weather:", error)
      // Fallback weather data
      setWeather({
        temperature: 28,
        description: "ท้องฟ้าแจ่มใส",
        humidity: 65,
        windSpeed: 2.5,
        icon: "01d",
      })
    }
  }

  const updateTrafficData = () => {
    // Simulate real-time traffic updates
    const updatedData = nimmanTrafficHotspots.map((hotspot) => ({
      ...hotspot,
      intensity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : ("low" as "high" | "medium" | "low"),
    }))
    setTrafficData(updatedData)
    setLastUpdate(new Date())
  }

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initializeMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyABuTpUgOVnpTfnVrSelY76bxQp36UGa5k&libraries=geometry,places&callback=initMap`
    script.async = true
    script.defer = true

    window.initMap = initializeMap

    document.head.appendChild(script)
  }

  const initializeMap = () => {
    if (!mapRef.current) return

    const nimmanCenter = { lat: 18.8022, lng: 98.9525 }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 16,
      center: nimmanCenter,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    })

    // Add traffic layer
    const trafficLayer = new window.google.maps.TrafficLayer()
    trafficLayer.setMap(mapInstance)

    // Add custom traffic hotspot markers
    updateMapMarkers(mapInstance)

    setMap(mapInstance)
    setIsLoading(false)
  }

  const updateMapMarkers = (mapInstance: any) => {
    trafficData.forEach((hotspot) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hotspot.lat, lng: hotspot.lng },
        map: mapInstance,
        title: hotspot.description,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getTrafficColor(hotspot.intensity),
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        animation: window.google.maps.Animation.BOUNCE,
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #333;">${hotspot.description}</h3>
            <p style="margin: 0; color: #666;">ความหนาแน่นการจราจร: <strong>${getTrafficLabel(
              hotspot.intensity,
            )}</strong></p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">อัปเดตล่าสุด: ${lastUpdate.toLocaleTimeString("th-TH")}</p>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(mapInstance, marker)
      })

      // Stop bouncing after 3 seconds
      setTimeout(() => {
        marker.setAnimation(null)
      }, 3000)
    })
  }

  const getTrafficColor = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "#ff4444"
      case "medium":
        return "#ff8800"
      case "low":
        return "#ffdd00"
      default:
        return "#ff4444"
    }
  }

  const getTrafficLabel = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "สูง"
      case "medium":
        return "ปานกลาง"
      case "low":
        return "ต่ำ"
      default:
        return "ไม่ทราบ"
    }
  }

  const getTrafficStats = () => {
    const high = trafficData.filter((t) => t.intensity === "high").length
    const medium = trafficData.filter((t) => t.intensity === "medium").length
    const low = trafficData.filter((t) => t.intensity === "low").length
    return { high, medium, low }
  }

  const stats = getTrafficStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <MapPin className="h-8 w-8 text-blue-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Traffic Monitor</h1>
                <p className="text-blue-200 text-lg">ติดตามการจราจรนิมมานเหมินทร์แบบเรียลไทม์</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-blue-200 hover:text-white transition-colors"
              >
                ดูแดชบอร์ด
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors hover:bg-white/10 px-6 py-3 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>กลับหน้าหลัก</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather & Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Weather Card */}
          {weather && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-2xl p-3">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">สภาพอากาศ</h3>
                  <p className="text-blue-600 font-semibold text-2xl">{weather.temperature}°C</p>
                  <p className="text-sm text-gray-600">{weather.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Traffic Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-2xl p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">การจราจรหนาแน่น</h3>
                <p className="text-red-600 font-semibold text-2xl">{stats.high} จุด</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 rounded-2xl p-3">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">การจราจรปานกลาง</h3>
                <p className="text-orange-600 font-semibold text-2xl">{stats.medium} จุด</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 rounded-2xl p-3">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">การจราจรเบา</h3>
                <p className="text-yellow-600 font-semibold text-2xl">{stats.low} จุด</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-2xl p-3">
                <Navigation className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">จุดติดตามทั้งหมด</h3>
                <p className="text-blue-600 font-semibold text-2xl">{trafficData.length} จุด</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Update Status */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold">สถานะ: อัปเดตแบบเรียลไทม์</span>
            </div>
            <div className="text-green-700 text-sm">อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString("th-TH")}</div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">แผนที่การจราจรนิมมานเหมินทร์</h2>
                <p className="text-gray-600">
                  จุดสีแดง = การจราจรหนาแน่น, จุดสีส้ม = การจราจรปานกลาง, จุดสีเหลือง = การจราจรเบา
                </p>
              </div>
              <button
                onClick={updateTrafficData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                รีเฟรชข้อมูล
              </button>
            </div>
          </div>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">กำลังโหลดแผนที่...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-96 md:h-[600px]" />
          </div>
        </div>

        {/* Weather Details */}
        {weather && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <Thermometer className="h-6 w-6 text-blue-600" />
              <span>รายละเอียดสภาพอากาศ</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Thermometer className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">อุณหภูมิ</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">{weather.temperature}°C</p>
                <p className="text-blue-700">{weather.description}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Cloud className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">ความชื้น</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">{weather.humidity}%</p>
                <p className="text-green-700">ความชื้นสัมพัทธ์</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Wind className="h-6 w-6 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">ความเร็วลม</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">{weather.windSpeed} m/s</p>
                <p className="text-purple-700">ลมปานกลาง</p>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Hotspots List */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">จุดการจราจรหนาแน่น</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trafficData.map((hotspot, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  hotspot.intensity === "high"
                    ? "border-red-200 bg-red-50 hover:bg-red-100"
                    : hotspot.intensity === "medium"
                      ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                      : "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      hotspot.intensity === "high"
                        ? "bg-red-500"
                        : hotspot.intensity === "medium"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                    }`}
                  ></div>
                  <h4 className="font-semibold text-gray-900">{hotspot.description}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  ความหนาแน่น: <span className="font-medium">{getTrafficLabel(hotspot.intensity)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  พิกัด: {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                </p>
                <button
                  onClick={() => {
                    if (map) {
                      map.setCenter({ lat: hotspot.lat, lng: hotspot.lng })
                      map.setZoom(18)
                    }
                  }}
                  className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  ดูในแผนที่
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-4">คำอธิบายสัญลักษณ์</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <span className="text-blue-800 font-medium">การจราจรหนาแน่นสูง</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-500"></div>
              <span className="text-blue-800 font-medium">การจราจรปานกลาง</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <span className="text-blue-800 font-medium">การจราจรเบา</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-700">
            💡 <strong>เคล็ดลับ:</strong> คลิกที่จุดในแผนที่เพื่อดูข้อมูลเพิ่มเติม หรือคลิก "ดูในแผนที่" ในรายการด้านล่างเพื่อซูมไปยังตำแหน่งนั้น
          </div>
        </div>
      </main>
    </div>
  )
}
