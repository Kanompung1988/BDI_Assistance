import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat") || "18.8022"
    const lon = searchParams.get("lon") || "98.9525"

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=973959347b8a6178b1089d57b2fddf0a&units=metric&lang=th`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(
      {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        visibility: data.visibility,
        feelsLike: Math.round(data.main.feels_like),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("Error in weather API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch weather data",
        details: error instanceof Error ? error.message : "Unknown error",
        // Fallback data
        temperature: 28,
        description: "ท้องฟ้าแจ่มใส",
        humidity: 65,
        windSpeed: 2.5,
        icon: "01d",
        pressure: 1013,
        visibility: 10000,
        feelsLike: 30,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}
