import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Existing Investment - Request body:", body)

    const response = await fetch("https://2f2a-203-156-9-142.ngrok-free.app/analyze-existing-investment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("Existing Investment - API Response Status:", response.status)

    const responseText = await response.text()
    console.log("Existing Investment - Raw Response:", responseText)

    if (!response.ok) {
      console.error("Existing Investment - API Error:", responseText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Existing Investment - JSON Parse Error:", parseError)
      data = {
        message: responseText,
        analysis: responseText,
      }
    }

    console.log("Existing Investment - Parsed Data:", data)

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Error in analyze-existing-investment API:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze existing investment",
        details: error instanceof Error ? error.message : "Unknown error",
        analysis: "ไม่สามารถวิเคราะห์ได้ในขณะนี้",
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
