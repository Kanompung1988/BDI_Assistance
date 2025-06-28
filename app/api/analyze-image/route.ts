import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch("https://2f2a-203-156-9-142.ngrok-free.app/analyze-image/", {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in analyze-image API:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
