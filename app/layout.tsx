import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BDI Assistant - ผู้ช่วยอัจฉริยะสำหรับนักท่องเที่ยวและผู้ประกอบการ",
  description: "ระบบแนะนำสถานที่ท่องเที่ยวและวิเคราะห์โอกาสทางธุรกิจด้วย AI ที่ทันสมัย",
  keywords: "เชียงใหม่, ท่องเที่ยว, ธุรกิจ, AI, แนะนำร้าน, วิเคราะห์การลงทุน",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @font-face {
            font-family: 'Prompt';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('Prompt'), local('Prompt-Regular'), local('Prompt Regular');
          }
        `,
          }}
        />
      </head>
      <body className="font-noto-sans-thai">{children}</body>
    </html>
  )
}
