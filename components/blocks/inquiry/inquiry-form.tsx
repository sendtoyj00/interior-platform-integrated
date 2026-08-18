"use client"

import type React from "react"

import { useMemo, useRef, useState } from "react"
import { Marker } from "./marker"

const COMPANIES = [
  "가온 인테리어",
  "리브 디자인 스튜디오",
  "한샘 리하우스 강남점",
  "우드플랜 시공",
  "모던하우스 인테리어",
  "화이트룸 디자인",
]

const SPACE_TYPES = ["아파트", "빌라/연립", "오피스텔", "단독주택", "상가/사무실", "기타"]

const AREAS = ["10평 이하", "10~20평", "20~30평", "30~40평", "40~50평", "50평 이상"]

type UploadFile = {
  id: string
  name: string
  size: number
  error: boolean
}

const ALLOWED = ["image/jpeg", "image/png", "application/pdf"]
const MAX_SIZE = 10 * 1024 * 1024

// Wireframe field wrapper: dashed box + label + marker
function Field({
  n,
  label,
  required,
  children,
}: {
  n: number
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative rounded-md border border-dashed border-foreground/40 bg-background p-4">
      <Marker n={n} />
      <div className="mb-2 flex items-baseline gap-1 text-sm font-semibold text-foreground">
        <span>{label}</span>
        {required ? (
          <span className="text-foreground">*</span>
        ) : (
          <span className="text-xs font-normal text-muted-foreground">(선택)</span>
        )}
      </div>
      {children}
    </div>
  )
}

const inputCls =
  "w-full rounded-sm border border-foreground/40 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"

export function InquiryForm({ idPrefix }: { idPrefix: string }) {
  const [company, setCompany] = useState("")
  const [companyQuery, setCompanyQuery] = useState("")
  const [companyOpen, setCompanyOpen] = useState(false)

  const [area, setArea] = useState("")
  const [spaceType, setSpaceType] = useState("")

  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")

  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const [detail, setDetail] = useState("")
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragging, setDragging] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredCompanies = useMemo(
    () => COMPANIES.filter((c) => c.toLowerCase().includes(companyQuery.toLowerCase())),
    [companyQuery],
  )

  const budgetError = budgetMin !== "" && budgetMax !== "" && Number(budgetMin) > Number(budgetMax)

  const isValid =
    company !== "" &&
    area !== "" &&
    spaceType !== "" &&
    budgetMin !== "" &&
    budgetMax !== "" &&
    !budgetError &&
    dateStart !== "" &&
    dateEnd !== ""

  function handleFiles(list: FileList | null) {
    if (!list) return
    const next: UploadFile[] = Array.from(list).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      error: !ALLOWED.includes(f.type) || f.size > MAX_SIZE,
    }))
    setFiles((prev) => [...prev, ...next])
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function handleSubmit() {
    if (!isValid) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1200)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-foreground/40 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-foreground text-2xl">
          ✓
        </div>
        <h3 className="text-lg font-bold text-foreground">문의가 접수되었습니다</h3>
        <p className="max-w-xs text-sm text-muted-foreground text-pretty">
          담당 업체가 확인 후 연락드릴 예정입니다. 진행 상황은 마이페이지에서 확인하실 수 있습니다.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button
            className="rounded-sm border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background"
            onClick={() => {
              // 이동(제안): SCR-DASH-002 고객 마이페이지
            }}
          >
            마이페이지로 이동 →
          </button>
          <button
            className="rounded-sm border border-foreground/40 px-4 py-2 text-sm text-foreground"
            onClick={() => {
              setDone(false)
              setCompany("")
              setCompanyQuery("")
              setArea("")
              setSpaceType("")
              setBudgetMin("")
              setBudgetMax("")
              setDateStart("")
              setDateEnd("")
              setDetail("")
              setFiles([])
            }}
          >
            새 문의 작성
          </button>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          SCR-INQ-002(업체 문의 목록)에 신규 문의로 반영됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Step 1: 업체 선택 */}
      <div className="flex gap-3">
        <StepNo n={1} />
        <div className="flex-1">
          <Field n={1} label="업체 선택" required>
            <div className="relative">
              <input
                className={inputCls}
                placeholder="업체명 검색 또는 선택"
                value={company || companyQuery}
                onChange={(e) => {
                  setCompany("")
                  setCompanyQuery(e.target.value)
                  setCompanyOpen(true)
                }}
                onFocus={() => setCompanyOpen(true)}
                aria-label="업체 선택 검색"
              />
              {companyOpen && (
                <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-sm border border-foreground/40 bg-background text-sm shadow-sm">
                  {filteredCompanies.length === 0 && (
                    <li className="px-3 py-2 text-muted-foreground">검색 결과 없음</li>
                  )}
                  {filteredCompanies.map((c) => (
                    <li key={c}>
                      <button
                        className="block w-full px-3 py-2 text-left hover:bg-muted"
                        onClick={() => {
                          setCompany(c)
                          setCompanyQuery("")
                          setCompanyOpen(false)
                        }}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {company && <p className="mt-1 text-xs text-muted-foreground">선택됨: {company}</p>}
          </Field>
        </div>
      </div>

      {/* Step 2: 공간정보 */}
      <div className="flex gap-3">
        <StepNo n={2} />
        <div className="flex-1">
          <Field n={2} label="공간정보" required>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                className={inputCls}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                aria-label="평형 선택"
              >
                <option value="">평형 선택</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <select
                className={inputCls}
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                aria-label="공간유형 선택"
              >
                <option value="">공간유형 선택</option>
                {SPACE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>
      </div>

      {/* Step 3: 희망예산 */}
      <div className="flex gap-3">
        <StepNo n={3} />
        <div className="flex-1">
          <Field n={3} label="희망예산 (만원)" required>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="최소"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                aria-label="희망예산 최소"
              />
              <span className="text-muted-foreground">~</span>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="최대"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                aria-label="희망예산 최대"
              />
            </div>
            {budgetError && (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-destructive">
                <span aria-hidden>⚠</span> 최소 예산이 최대 예산보다 클 수 없습니다
              </p>
            )}
          </Field>
        </div>
      </div>

      {/* Step 4: 희망일정 */}
      <div className="flex gap-3">
        <StepNo n={4} />
        <div className="flex-1">
          <Field n={4} label="희망일정" required>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className={inputCls}
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                aria-label="희망일정 시작일"
              />
              <span className="text-muted-foreground">~</span>
              <input
                type="date"
                className={inputCls}
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                aria-label="희망일정 종료일"
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Step 5: 상세 요청사항 */}
      <div className="flex gap-3">
        <StepNo n={5} />
        <div className="flex-1">
          <Field n={5} label="상세 요청사항">
            <textarea
              className={`${inputCls} min-h-24 resize-y`}
              placeholder="요청사항을 입력해주세요 (선택)"
              maxLength={500}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              aria-label="상세 요청사항"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">{detail.length} / 500</div>
          </Field>
        </div>
      </div>

      {/* Step 6: 첨부파일 */}
      <div className="flex gap-3">
        <StepNo n={6} />
        <div className="flex-1">
          <Field n={6} label="첨부파일 (평면도/참고사진)">
            <div
              className={`flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-6 text-center ${
                dragging ? "border-foreground bg-muted" : "border-foreground/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleFiles(e.dataTransfer.files)
              }}
            >
              <p className="text-sm text-foreground">파일을 드래그하거나 클릭하여 업로드</p>
              <button
                className="rounded-sm border border-foreground/40 px-3 py-1.5 text-xs text-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </button>
              <p className="text-[11px] text-muted-foreground">
                jpg / png / pdf만 허용 · 파일당 최대 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files)
                  e.target.value = ""
                }}
              />
            </div>

            {files.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-2 rounded-sm border border-foreground/30 px-3 py-2 text-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-foreground/30 text-[10px] text-muted-foreground">
                      IMG
                    </span>
                    <span className="flex-1 truncate text-foreground">{f.name}</span>
                    {f.error ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                        <span aria-hidden>⚠</span> 형식/용량을 확인해주세요
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {(f.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    )}
                    <button
                      className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-foreground/40 text-xs text-foreground"
                      onClick={() => removeFile(f.id)}
                      aria-label={`${f.name} 삭제`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
        </div>
      </div>

      {/* Step 7: 등록 버튼 */}
      <div className="flex gap-3">
        <StepNo n={7} />
        <div className="relative flex-1">
          <Marker n={7} />
          <button
            className={`w-full rounded-sm border px-4 py-3 text-sm font-bold transition-colors ${
              isValid && !submitting
                ? "border-foreground bg-foreground text-background"
                : "cursor-not-allowed border-foreground/30 bg-muted text-muted-foreground"
            }`}
            disabled={!isValid || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "접수 중..." : "문의 등록"}
          </button>
          {!isValid && (
            <p className="mt-1 text-center text-[11px] text-muted-foreground">
              필수 항목 ①②③④를 모두 입력하면 활성화됩니다
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// 세로 스텝 번호 (좌측 타임라인)
function StepNo({ n }: { n: number }) {
  return (
    <div className="flex flex-col items-center pt-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground text-xs font-bold text-foreground">
        {n}
      </span>
      <span className="mt-1 w-px flex-1 bg-foreground/20" />
    </div>
  )
}
