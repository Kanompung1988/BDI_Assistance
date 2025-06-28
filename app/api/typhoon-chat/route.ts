import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Typhoon Chat - Request body:", body)

    const response = await fetch("https://2f2a-203-156-9-142.ngrok-free.app/typhoon-chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(body),
    })

    console.log("Typhoon Chat - API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Typhoon Chat - API Error:", errorText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Typhoon Chat - API Response Data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in typhoon-chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to get chat response",
        details: error instanceof Error ? error.message : "Unknown error",
        response: "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้",
      },
      { status: 500 },
    )
  }
}
