"use client"

import { Num } from "@/components/blocks/ops/num"
import { PaymentHistoryCard } from "@/components/blocks/ops/payment-history-card"
import { INITIAL_MILESTONES, type Milestone } from "@/lib/blocks/ops/payment-mock"
import { COMPANY_MENU, CUSTOMER_MENU, MENU_LABEL } from "@/lib/menu-labels"

type Device = "desktop" | "mobile"
type Embed = "customer" | "company"

/**
 * 결제 이력 조회 화면 데모.
 * 동일한 PaymentHistoryCard 컴포넌트를 고객 마이페이지 / 업체 대시보드
 * 두 컨텍스트에 임베드하여 재사용 가능함을 보여준다.
 * empty=true 이면 빈 상태(Empty State) 확인용으로 빈 배열을 전달한다.
 */
export function PaymentHistoryApp({
  device,
  embed,
  empty,
}: {
  device: Device
  embed: Embed
  empty: boolean
}) {
  const mobile = device === "mobile"
  const data: Milestone[] = empty ? [] : INITIAL_MILESTONES

  return (
    <div className="relative flex flex-col border border-foreground bg-background text-foreground">
      {/* header */}
      <header className="flex items-center justify-between border-b border-foreground px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="border border-foreground px-2 py-1 text-xs font-bold">
            LOGO
          </span>
          <span className="text-xs text-muted-foreground">
            {embed === "customer" ? "고객 마이페이지" : "업체 대시보드"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-foreground/50 px-2 py-1 text-[11px]">
            {embed === "customer" ? "역할: 고객" : "역할: 업체 관리자"}
          </span>
          <button className="border border-foreground px-2 py-1 text-[11px] hover:bg-muted">
            로그아웃
          </button>
        </div>
      </header>

      <div className={mobile ? "flex flex-col" : "flex"}>
        {/* sidebar (desktop only) */}
        {!mobile && (
          <aside className="w-48 shrink-0 border-r border-foreground p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
              메뉴
            </p>
            <nav className="flex flex-col gap-1 text-xs">
              {(embed === "customer" ? CUSTOMER_MENU : COMPANY_MENU).map((label) => {
                const active = label === MENU_LABEL.payment
                return (
                  <span
                    key={label}
                    className={[
                      "border border-foreground/40 px-2 py-1.5",
                      active
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                )
              })}
            </nav>
          </aside>
        )}

        {/* body */}
        <main className="min-w-0 flex-1 p-4">
          <div className="mb-3">
            <p className="text-sm font-bold">
              {embed === "customer" ? "결제관리 · 내 결제 현황" : "결제관리 · 고객 결제 현황 (읽기)"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              아래 카드는 마이페이지·대시보드 공용 임베드 컴포넌트입니다.
            </p>
          </div>

          {/* embedded reusable card */}
          <div className={mobile ? "" : "max-w-md"}>
            <PaymentHistoryCard milestones={data} compact={mobile} />
          </div>
        </main>
      </div>

      {/* footer: status message area */}
      <footer className="relative flex items-center gap-2 border-t border-foreground px-4 py-2 text-[11px] text-muted-foreground">
        <Num n={4} />
        <span className="border border-foreground/40 px-1.5 py-0.5">STATUS</span>
        <span>
          {empty
            ? "등록된 결제 정보 없음 — 빈 상태 표시 중"
            : "읽기 전용 · 결제 정보 수정은 업체 결제 관리 화면에서 가능합니다."}
        </span>
      </footer>
    </div>
  )
}
