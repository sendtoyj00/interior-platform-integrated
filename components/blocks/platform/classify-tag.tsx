"use client"

import { useState } from "react"
import { NumBadge } from "./num-badge"
import { ruleById } from "@/lib/blocks/platform/mock-data"

type TagType = "공간유형" | "예산대"

export function ClassifyTag({
  value,
  type,
  ruleIds,
  lowConfidence,
  corrected,
  options,
  onCorrect,
  badgeTag,
  badgeEdit,
}: {
  value: string | null
  type: TagType
  ruleIds: string[]
  lowConfidence: boolean
  corrected?: boolean
  options: string[]
  onCorrect: (v: string) => void
  badgeTag?: number
  badgeEdit?: number
}) {
  const [showBasis, setShowBasis] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const unclassified = value === null

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* 자동분류 태그 (클릭 → 분류 근거 팝오버) */}
      <div className="relative">
        {badgeTag != null && <NumBadge n={badgeTag} />}
        <button
          type="button"
          onClick={() => {
            setShowBasis((v) => !v)
            setShowEdit(false)
          }}
          className={[
            "rounded px-2 py-0.5 text-[11px] leading-tight",
            unclassified
              ? "border border-foreground/30 bg-muted text-muted-foreground"
              : lowConfidence
                ? "border border-dashed border-foreground/50 bg-background text-foreground"
                : "border border-foreground bg-background text-foreground",
          ].join(" ")}
          title={unclassified ? "매칭 규칙 없음" : "클릭 시 분류 근거 표시"}
        >
          {unclassified ? "미분류" : value}
        </button>

        {/* ③ 분류 근거 팝오버 */}
        {showBasis && (
          <div className="absolute left-0 top-full z-40 mt-1 w-56 rounded-md border border-foreground bg-card p-2.5 shadow-lg">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">분류 근거 ({type})</span>
              <button
                type="button"
                onClick={() => setShowBasis(false)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            {ruleIds.length === 0 ? (
              <p className="text-[11px] text-muted-foreground text-pretty">
                매칭된 규칙이 없어 자동 분류되지 않았습니다. 담당자 수동 확인이 필요합니다.
              </p>
            ) : (
              <ul className="space-y-1">
                {ruleIds.map((id) => {
                  const r = ruleById(id)
                  if (!r) return null
                  return (
                    <li key={id} className="rounded border border-foreground/20 bg-background px-2 py-1">
                      <div className="text-[10px] text-muted-foreground">{r.id} · 매칭 키워드</div>
                      <div className="text-[11px] text-foreground">
                        <span className="text-muted-foreground">{`"${r.keyword}"`}</span>
                        {" → "}
                        <span className="font-medium">{r.tag}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            <p className="mt-1.5 border-t border-foreground/15 pt-1.5 text-[10px] text-muted-foreground">
              ※ 규칙/통계 기반 분류 결과이며 AI/LLM 판단이 아닙니다.
            </p>
          </div>
        )}
      </div>

      {/* ④ 수정 아이콘 (클릭 → 담당자 수동 정정 드롭다운) */}
      <div className="relative">
        {badgeEdit != null && <NumBadge n={badgeEdit} />}
        <button
          type="button"
          onClick={() => {
            setShowEdit((v) => !v)
            setShowBasis(false)
          }}
          className="flex h-5 w-5 items-center justify-center rounded border border-foreground/40 bg-background text-[10px] text-foreground hover:bg-muted"
          aria-label="태그 수동 정정"
          title="태그 수동 정정"
        >
          ✎
        </button>

        {showEdit && (
          <div className="absolute left-0 top-full z-40 mt-1 w-44 rounded-md border border-foreground bg-card p-2 shadow-lg">
            <div className="mb-1 text-[11px] font-semibold text-foreground">태그 수동 정정</div>
            <ul className="max-h-40 space-y-0.5 overflow-auto">
              {options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onCorrect(opt)
                      setShowEdit(false)
                    }}
                    className={[
                      "w-full rounded px-2 py-1 text-left text-[11px] hover:bg-muted",
                      opt === value ? "bg-muted font-medium text-foreground" : "text-foreground",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 수동 정정됨 라벨 */}
      {corrected && (
        <span
          className="rounded border border-foreground/40 bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
          title="수동 정정된 데이터는 추후 분류 규칙 개선에 활용됩니다."
        >
          수동 정정됨
        </span>
      )}
    </div>
  )
}
