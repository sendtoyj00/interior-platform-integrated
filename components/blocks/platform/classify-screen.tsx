"use client"

import { useState } from "react"
import { NumBadge } from "./num-badge"
import { ClassifyTag } from "./classify-tag"
import { RulesModal } from "./rules-modal"
import { Toast } from "./overlays"
import {
  NAV,
  INQUIRIES,
  CLASSIFY_RULES,
  SPACE_TAGS,
  BUDGET_TAGS,
  type Inquiry,
  type ClassifyRule,
  type Confidence,
} from "@/lib/blocks/platform/mock-data"

function ConfidencePill({ level }: { level: Confidence }) {
  const tone =
    level === "상"
      ? "border-foreground bg-foreground text-background"
      : level === "중"
        ? "border-foreground bg-background text-foreground"
        : "border-dashed border-foreground/50 bg-muted text-muted-foreground"
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] leading-none ${tone}`}>
      확신도 {level}
    </span>
  )
}

export function ClassifyScreen({ variant }: { variant: "desktop" | "mobile" }) {
  const mobile = variant === "mobile"
  const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES)
  const [rules, setRules] = useState<ClassifyRule[]>(CLASSIFY_RULES)
  const [showRules, setShowRules] = useState(false)
  const [showBetaTip, setShowBetaTip] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function fireToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  function correct(id: string, field: "spaceTag" | "budgetTag", value: string) {
    setInquiries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value, corrected: true } : q)),
    )
    fireToast("수동 정정 저장됨 · 규칙 개선 데이터로 수집")
  }

  function addRule(r: { keyword: string; tag: string; type: "공간유형" | "예산대" }) {
    setRules((prev) => [...prev, { id: `R${prev.length + 100}`, ...r }])
  }
  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground">
      {/* ── 헤더 ── */}
      <header className="flex items-center justify-between border-b border-foreground/25 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm border border-foreground" aria-hidden />
          <span className="text-xs font-bold">인테리어 플랫폼</span>
          <span className="ml-1 rounded border border-foreground/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            업체 관리자
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">무드하우스 인테리어 · 관리자</span>
          <div className="relative">
            <NumBadge n={1} />
            <button className="rounded border border-foreground/40 px-2 py-1 text-[10px] hover:bg-muted">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className={`flex flex-1 overflow-hidden ${mobile ? "flex-col" : ""}`}>
        {/* ── 사이드바 ── */}
        {!mobile && (
          <nav className="w-40 shrink-0 border-r border-foreground/25 p-2">
            <ul className="space-y-0.5">
              {NAV.map((n) => (
                <li key={n.key}>
                  <div
                    className={`rounded px-2 py-1.5 text-[11px] ${
                      n.key === "inquiries"
                        ? "border border-foreground bg-muted font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {n.label}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {mobile && (
          <div className="flex gap-1 overflow-x-auto border-b border-foreground/25 px-2 py-1.5">
            {NAV.map((n) => (
              <span
                key={n.key}
                className={`whitespace-nowrap rounded px-2 py-1 text-[10px] ${
                  n.key === "inquiries" ? "border border-foreground bg-muted font-semibold" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </span>
            ))}
          </div>
        )}

        {/* ── 바디 ── */}
        <main className="flex-1 overflow-auto p-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-sm font-bold">문의 자동분류 결과 확인</h1>
              <div className="mt-1.5 flex items-center gap-1.5">
                {/* ① 규칙 기반 자동 분류 (Beta) 배지 + 정보 툴팁 */}
                <div className="relative">
                  <NumBadge n={2} />
                  <span className="inline-flex items-center gap-1 rounded border border-foreground/50 bg-muted px-2 py-0.5 text-[10px] text-foreground">
                    규칙 기반 자동 분류 (Beta)
                    <button
                      type="button"
                      onMouseEnter={() => setShowBetaTip(true)}
                      onMouseLeave={() => setShowBetaTip(false)}
                      onClick={() => setShowBetaTip((v) => !v)}
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-foreground/60 text-[8px] leading-none"
                      aria-label="분류 방식 안내"
                    >
                      i
                    </button>
                  </span>
                  {showBetaTip && (
                    <div className="absolute left-0 top-full z-40 mt-1 w-60 rounded-md border border-foreground bg-card p-2 text-[10px] text-foreground shadow-lg text-pretty">
                      본 분류는 키워드 매칭 규칙과 통계 기반으로 동작하며, AI/LLM 모델의 판단이 아닙니다.
                      결과는 참고용이며 담당자 확인·정정이 필요합니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ⑤ 분류 규칙 관리 버튼 */}
            <div className="relative">
              <NumBadge n={3} />
              <button
                type="button"
                onClick={() => setShowRules(true)}
                className="rounded border border-foreground bg-background px-2.5 py-1 text-[11px] hover:bg-muted"
              >
                분류 규칙 관리
              </button>
            </div>
          </div>

          {/* ② 문의 목록 테이블 */}
          {mobile ? (
            <ul className="space-y-2">
              {inquiries.map((q) => (
                <li key={q.id} className="rounded-md border border-foreground/25 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold">{q.customer}</span>
                    <ConfidencePill level={q.confidence} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground text-pretty">{q.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <ClassifyTag
                      value={q.spaceTag}
                      type="공간유형"
                      ruleIds={q.spaceRules}
                      lowConfidence={q.confidence === "하"}
                      corrected={q.corrected}
                      options={SPACE_TAGS}
                      onCorrect={(v) => correct(q.id, "spaceTag", v)}
                    />
                    <ClassifyTag
                      value={q.budgetTag}
                      type="예산대"
                      ruleIds={q.budgetRules}
                      lowConfidence={q.confidence === "하"}
                      options={BUDGET_TAGS}
                      onCorrect={(v) => correct(q.id, "budgetTag", v)}
                    />
                  </div>
                  <div className="relative mt-2 inline-block">
                    <NumBadge n={12} />
                    <button
                      type="button"
                      onClick={() => fireToast(`${q.customer} 문의 담당자 배정 (SCR-INQ-002 로직)`)}
                      className="rounded border border-foreground bg-foreground px-2.5 py-1 text-[10px] text-background hover:bg-foreground/85"
                    >
                      담당자 배정
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="overflow-visible rounded-md border border-foreground/25">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-foreground/30 bg-muted text-left text-muted-foreground">
                    <th className="px-2 py-1.5 font-medium">고객명</th>
                    <th className="px-2 py-1.5 font-medium">문의내용 요약</th>
                    <th className="px-2 py-1.5 font-medium">자동분류 태그 (공간유형 · 예산대)</th>
                    <th className="px-2 py-1.5 font-medium">확신도</th>
                    <th className="px-2 py-1.5 font-medium">담당자</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((q) => (
                    <tr key={q.id} className="border-b border-foreground/10 align-top">
                      <td className="px-2 py-2 font-medium">{q.customer}</td>
                      <td className="max-w-[220px] px-2 py-2 text-muted-foreground text-pretty">{q.summary}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <ClassifyTag
                            value={q.spaceTag}
                            type="공간유형"
                            ruleIds={q.spaceRules}
                            lowConfidence={q.confidence === "하"}
                            corrected={q.corrected}
                            options={SPACE_TAGS}
                            onCorrect={(v) => correct(q.id, "spaceTag", v)}
                            badgeTag={4}
                            badgeEdit={5}
                          />
                          <ClassifyTag
                            value={q.budgetTag}
                            type="예산대"
                            ruleIds={q.budgetRules}
                            lowConfidence={q.confidence === "하"}
                            options={BUDGET_TAGS}
                            onCorrect={(v) => correct(q.id, "budgetTag", v)}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <ConfidencePill level={q.confidence} />
                      </td>
                      <td className="px-2 py-2">
                        <div className="relative inline-block">
                          <NumBadge n={12} />
                          <button
                            type="button"
                            onClick={() => fireToast(`${q.customer} 문의 담당자 배정 (SCR-INQ-002 로직 재사용)`)}
                            className="rounded border border-foreground bg-foreground px-2 py-1 text-[10px] text-background hover:bg-foreground/85"
                          >
                            담당자 배정
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 범례 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3 w-6 rounded border border-dashed border-foreground/50 bg-background" />
              확신도 &apos;하&apos; · 확인 필요
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3 w-6 rounded border border-foreground/30 bg-muted" />
              미분류 (매칭 규칙 없음)
            </span>
            <span>태그 클릭 = 분류 근거 · ✎ = 수동 정정</span>
          </div>
        </main>
      </div>

      {/* ── 푸터 (상태 메시지 영역) ── */}
      <footer className="border-t border-foreground/25 px-4 py-1.5 text-[10px] text-muted-foreground">
        상태: 문의 {inquiries.length}건 · 규칙 {rules.length}개 적용 중 · 규칙 기반 분류(AI 아님)
      </footer>

      {showRules && (
        <RulesModal rules={rules} onAdd={addRule} onDelete={deleteRule} onClose={() => setShowRules(false)} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
