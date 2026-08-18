import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/shell/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "인테리어 견적·시공관리 플랫폼 · 화면 설계서 통합 프리뷰",
  description:
    "20개 화면(SCR-*) 와이어프레임을 하나의 프로젝트로 통합한 그레이스케일 화면 설계서 프리뷰입니다.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
