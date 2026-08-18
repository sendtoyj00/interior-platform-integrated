"use client"

import Link from "next/link"
import { SCREENS } from "@/lib/screen-registry"
import { CATEGORY_LABEL, CATEGORY_ORDER, ROLE_LABEL, ROLE_HOME_SLUG, type RoleKey } from "@/lib/roles"
import { useRole } from "@/components/shell/role-context"

const QUICK_START: { role: Exclude<RoleKey, "guest">; desc: string }[] = [
  { role: "company_admin", desc: "문의·견적·계약·시공·결제 전 과정을 관리하는 업체 대시보드로 진입" },
  { role: "field_staff", desc: "배정된 현장의 공정 진행률과 지연 이슈를 관리하는 화면으로 진입" },
  { role: "customer", desc: "내 프로젝트의 견적·계약·공정·결제·사진을 한 화면에서 조회" },
  { role: "platform_admin", desc: "가입 업체 승인, 권한(RBAC), 알림 발송이력을 관리" },
]

export default function HomePage() {
  const { setViewRole } = useRole()

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="font-mono text-[11px] text-muted-foreground">화면 설계서 통합 프리뷰</p>
        <h1 className="mt-1 text-xl font-bold text-foreground text-balance">
          인테리어 견적·시공관리 업무 플랫폼 — 전체 20개 화면 통합
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground text-pretty">
          v0.dev로 개별 생성된 6묶음(1-4, 5-7, 8-10, 11-13, 14-17, 18-20)의 화면 코드를 하나의 Next.js
          프로젝트로 통합했습니다. 공통 그레이스케일 디자인 시스템, 카테고리별 통합 메뉴, 화면 간 실제 이동
          흐름(로그인 → 역할별 기본 화면, 문의처리 → 견적서 작성, 대시보드 → 공정관리/문의관리 등)을 하나의
          앱에서 확인할 수 있습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/screens"
            className="rounded border border-foreground bg-foreground px-4 py-2 text-xs font-semibold text-background"
          >
            전체 화면 목록 (20개) →
          </Link>
          <Link
            href="/flow"
            className="rounded border border-foreground/30 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            화면 흐름도 보기 →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-foreground">역할별 빠른 시작 (SCR-AUTH-003 로그인 분기와 동일)</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_START.map((q) => (
            <Link
              key={q.role}
              href={`/screens/${ROLE_HOME_SLUG[q.role]}`}
              onClick={() => setViewRole(q.role)}
              className="flex flex-col gap-1.5 rounded-md border border-foreground/15 bg-background p-4 hover:border-foreground"
            >
              <span className="w-fit rounded bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
                {ROLE_LABEL[q.role]}
              </span>
              <p className="text-[11px] text-muted-foreground text-pretty">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-foreground">카테고리별 화면 현황</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {CATEGORY_ORDER.map((cat) => {
            const items = SCREENS.filter((s) => s.category === cat)
            return (
              <div key={cat} className="rounded-md border border-foreground/15 bg-background p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{cat}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{CATEGORY_LABEL[cat]}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{items.length}</p>
                <ul className="mt-2 flex flex-col gap-0.5">
                  {items.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/screens/${s.slug}`} className="text-[11px] text-muted-foreground hover:text-foreground hover:underline">
                        {s.scrId}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-md border border-dashed border-foreground/30 bg-background p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p className="mb-1 font-bold text-foreground">통합 시 반영한 사항</p>
        <p>· 디자인 통합: 6개 프로젝트의 서로 다른 프레임/배지 컴포넌트를 하나의 공용 DeviceFrame(데스크톱 1920 / 모바일 360)으로 통일</p>
        <p>· 메뉴 통합: 카테고리(인증·업체관리·문의·견적·계약·시공·결제·알림·대시보드·확장검토) 기준 사이드바로 20개 화면 전체를 탐색</p>
        <p>· 기능 흐름 통합: 로그인 성공 시 역할별 기본 화면 자동 이동, 문의처리→견적서 작성 이동, 대시보드→공정관리/문의관리 이동을 실제 라우팅으로 연결하고, 그 외 문서상 &quot;이동 화면(제안)&quot;은 각 화면 하단 바로가기 패널로 연결</p>
      </section>
    </div>
  )
}
