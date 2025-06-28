import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Recommend Places - Request body:", body)

    const response = await fetch("https://2f2a-203-156-9-142.ngrok-free.app/recommend-places/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("Recommend Places - API Response Status:", response.status)

    const responseText = await response.text()
    console.log("Recommend Places - Raw Response:", responseText)

    if (!response.ok) {
      console.error("Recommend Places - API Error:", responseText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Recommend Places - JSON Parse Error:", parseError)
      data = {
        message: responseText,
        recommendations: responseText,
      }
    }

    console.log("Recommend Places - Parsed Data:", data)

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Error in recommend-places API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
        recommendations: [],
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
