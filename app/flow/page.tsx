"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SCREENS, getScreenByScrId } from "@/lib/screen-registry"
import { CATEGORY_LABEL, CATEGORY_ORDER } from "@/lib/roles"

export default function FlowPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] text-muted-foreground">메인 &gt; 화면 흐름도</p>
        <h1 className="mt-1 text-lg font-bold text-foreground">화면 간 이동 흐름도</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground text-pretty">
          v0 화면생성 프롬프트 문서의 &quot;이동 화면(제안)&quot; 항목을 화면 간 연결 그래프로 정리한
          것입니다. 굵게 표시된 연결은 실제 라우팅으로 동작합니다(로그인 → 역할별 화면, 문의처리 → 견적서
          작성, 대시보드 → 공정관리/문의관리). 나머지는 각 화면의 &quot;관련 화면 바로가기&quot; 패널을 통해
          이동할 수 있습니다.
        </p>
      </div>

      <div className="rounded-md border border-foreground/15 bg-background p-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">실제 라우팅으로 연결된 핵심 흐름</p>
        <ul className="flex flex-col gap-2 text-xs">
          <FlowLine from="SCR-AUTH-003" to="SCR-DASH-001" label="로그인(업체 관리자 계정)" />
          <FlowLine from="SCR-AUTH-003" to="SCR-PROC-001" label="로그인(현장 담당자 계정)" />
          <FlowLine from="SCR-AUTH-003" to="SCR-DASH-002" label="로그인(고객 계정)" />
          <FlowLine from="SCR-AUTH-003" to="SCR-COMP-001" label="로그인(플랫폼 관리자 계정)" />
          <FlowLine from="SCR-INQ-002" to="SCR-QUOTE-001" label="'견적서 작성하기' 선택" />
          <FlowLine from="SCR-DASH-001" to="SCR-PROC-001" label="프로젝트 리스트 행 클릭" />
          <FlowLine from="SCR-DASH-001" to="SCR-INQ-002" label="빈 상태 '문의 확인하러 가기'" />
        </ul>
      </div>

      <div className="flex flex-col gap-8">
        {CATEGORY_ORDER.map((cat) => {
          const items = SCREENS.filter((s) => s.category === cat && s.related.length > 0)
          if (items.length === 0) return null
          return (
            <section key={cat}>
              <h2 className="mb-2 text-sm font-bold text-foreground">{CATEGORY_LABEL[cat]}</h2>
              <div className="flex flex-col gap-2">
                {items.map((s) => (
                  <div key={s.slug} className="rounded-md border border-foreground/15 bg-background p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/screens/${s.slug}`}
                        className="rounded border border-foreground bg-foreground px-2 py-0.5 font-mono text-[11px] font-bold text-background hover:opacity-90"
                      >
                        {s.scrId}
                      </Link>
                      <span className="text-xs font-medium text-foreground">{s.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1.5">
                        {s.related.map((r) => {
                          const target = getScreenByScrId(r)
                          if (!target) return null
                          return (
                            <Link
                              key={r}
                              href={`/screens/${target.slug}`}
                              className="rounded border border-foreground/30 px-2 py-0.5 font-mono text-[11px] text-foreground hover:bg-muted"
                            >
                              {target.scrId}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function FlowLine({ from, to, label }: { from: string; to: string; label: string }) {
  const fromScreen = getScreenByScrId(from)
  const toScreen = getScreenByScrId(to)
  return (
    <li className="flex flex-wrap items-center gap-2">
      {fromScreen ? (
        <Link href={`/screens/${fromScreen.slug}`} className="font-mono font-bold text-foreground underline">
          {from}
        </Link>
      ) : (
        <span className="font-mono font-bold">{from}</span>
      )}
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
      {toScreen ? (
        <Link href={`/screens/${toScreen.slug}`} className="font-mono font-bold text-foreground underline">
          {to}
        </Link>
      ) : (
        <span className="font-mono font-bold">{to}</span>
      )}
      <span className="text-muted-foreground">— {label}</span>
    </li>
  )
}
