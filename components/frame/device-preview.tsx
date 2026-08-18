"use client"

import type { ReactNode } from "react"

/**
 * 전 화면 공통 디바이스 프리뷰 프레임.
 * 데스크톱(1920px, 브라우저 크롬 UI)과 모바일(360px, 기기 노치 UI)을
 * 동일한 톤앤매너로 렌더링해서 20개 화면 전체의 "디자인 통합"을 담당한다.
 */

const DESKTOP_W = 1920
const DESKTOP_H = 1080
const MOBILE_W = 360
const MOBILE_H = 800

export function DesktopPreview({
  children,
  scale = 0.5,
  url = "platform.interior-mgmt.co",
}: {
  children: ReactNode
  scale?: number
  url?: string
}) {
  return (
    <div className="inline-flex flex-col gap-2">
      <div
        className="wireframe-preview overflow-hidden rounded-lg border-2 border-foreground/70 bg-background shadow-sm"
        style={{ width: DESKTOP_W * scale, height: (DESKTOP_H + 40) * scale }}
      >
        <div
          style={{
            width: DESKTOP_W,
            height: DESKTOP_H + 40,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="flex h-10 items-center gap-1.5 border-b border-foreground/30 bg-muted px-3">
            <span className="h-2.5 w-2.5 rounded-full border border-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full border border-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full border border-foreground/40" />
            <span className="ml-3 flex-1 truncate rounded border border-foreground/30 bg-background px-3 py-1 font-mono text-[13px] text-muted-foreground">
              {url}
            </span>
            <span className="border border-foreground px-2 py-1 font-mono text-[10px] font-bold text-foreground">와이어프레임</span>
          </div>
          <div style={{ height: DESKTOP_H }} className="relative overflow-hidden bg-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobilePreview({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex flex-col gap-2">
      <div
        className="wireframe-preview overflow-hidden rounded-[2rem] border-4 border-foreground/80 bg-background shadow-sm"
        style={{ width: MOBILE_W + 8, height: MOBILE_H + 8 }}
      >
        <div className="flex items-center justify-center border-b border-foreground/20 bg-muted py-2">
          <span className="h-1.5 w-16 rounded-full bg-foreground/30" />
        </div>
        <div style={{ width: MOBILE_W, height: MOBILE_H }} className="relative overflow-hidden bg-background">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * renderScreen(mode) 함수 하나로 데스크톱/모바일 두 프리뷰를 동시에 그려주는 헬퍼.
 * 화면 내부에 공유 로컬 상태(토글 등)가 있는 경우, renderScreen 클로저 안에서
 * 그 상태를 참조하면 두 프리뷰가 항상 동기화된다.
 */
export function DualDevicePreview({
  renderScreen,
  desktopScale = 0.5,
  url,
}: {
  renderScreen: (mode: "desktop" | "mobile") => ReactNode
  desktopScale?: number
  url?: string
}) {
  return (
    <div className="flex flex-col items-start gap-8 xl:flex-row xl:flex-wrap">
      <section>
        <FrameLabel title="DESKTOP" spec={`${DESKTOP_W} × ${DESKTOP_H}`} />
        <DesktopPreview scale={desktopScale} url={url}>
          {renderScreen("desktop")}
        </DesktopPreview>
      </section>
      <section>
        <FrameLabel title="MOBILE" spec={`${MOBILE_W} × ${MOBILE_H}`} />
        <MobilePreview>{renderScreen("mobile")}</MobilePreview>
      </section>
    </div>
  )
}

function FrameLabel({ title, spec }: { title: string; spec: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="rounded border border-foreground bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
        {title}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">{spec}</span>
      <span className="rounded border border-foreground/50 bg-background px-1.5 py-0.5 text-[10px] font-semibold text-foreground">화면 와이어프레임</span>
    </div>
  )
}
