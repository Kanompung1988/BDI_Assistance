const API_BASE_URL = "https://2f2a-203-156-9-142.ngrok-free.app"

export class APIService {
  private static async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    // When executed in the browser we talk to our Next.js route-handlers
    // (e.g. /api/recommend-places) which in turn proxy to the external API.
    // On the server we can hit the external service directly.
    const isBrowser = typeof window !== "undefined"
    const url = isBrowser ? `/api${endpoint}` : `${API_BASE_URL}${endpoint}`

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Only send the ngrok header when talking to the remote service
        ...(isBrowser ? {} : { "ngrok-skip-browser-warning": "true" }),
      },
      body: JSON.stringify(data),
    }

    try {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("APIService → POST", url, data)
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      return (await response.json()) as T
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("APIService request failed:", err)
      throw err
    }
  }

  static async recommendPlaces(data: {
    user_message: string
    location: string
    radius: number
  }) {
    return this.makeRequest("/recommend-places", data)
  }

  static async recommendNewInvestment(data: {
    user_message: string
    location: string
    entrepreneur_type: string
  }) {
    return this.makeRequest("/recommend-new-investment", data)
  }

  static async analyzeExistingBusiness(data: {
    business_name: string
    location: string
    category: string
  }) {
    return this.makeRequest("/analyze-existing-investment", data)
  }

  static async chatWithTyphoon(data: {
    messages: Array<{ role: string; content: string }>
  }) {
    return this.makeRequest("/typhoon-chat", data)
  }

  static async analyzeImages(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    const isBrowser = typeof window !== "undefined"
    const url = isBrowser ? `/api/analyze-image` : `${API_BASE_URL}/analyze-image`

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: isBrowser ? undefined : { "ngrok-skip-browser-warning": "true" },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return response.json()
  }

  static async getWeatherData(lat?: number, lng?: number) {
    const isBrowser = typeof window !== "undefined"
    const url = isBrowser
      ? `/api/weather?lat=${lat || 18.8022}&lon=${lng || 98.9525}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat || 18.8022}&lon=${lng || 98.9525}&appid=973959347b8a6178b1089d57b2fddf0a&units=metric&lang=th`

    const response = await fetch(url, {
      headers: isBrowser ? {} : { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`)
    }

    return response.json()
  }
}
