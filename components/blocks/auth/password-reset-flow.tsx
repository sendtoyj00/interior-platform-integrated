"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Eye, EyeOff, Loader2, MailCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"

type Mode = "desktop" | "mobile"
type ResetState = "find" | "change"

/* ---------- shared wireframe primitives (match other flows) ---------- */

function Num({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-none border border-neutral-900 bg-white text-[9px] font-bold leading-none text-neutral-900"
    >
      {n}
    </span>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-neutral-700">{children}</span>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 block text-[10px] font-medium text-neutral-900 underline decoration-neutral-900">
      ⚠ {children}
    </span>
  )
}

function GoToLogin() {
  return (
    <div className="mt-4 flex items-center justify-center gap-2 rounded-none border border-dashed border-neutral-400 bg-neutral-50 px-4 py-3">
      <span className="text-xs font-semibold text-neutral-900">로그인 화면</span>
      <ArrowRight className="h-4 w-4 text-neutral-500" />
      <span className="rounded-none border border-neutral-400 bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-700">
        SCR-AUTH-003
      </span>
    </div>
  )
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// REQ-NFR-001: 최소 8자, 영문/숫자/특수문자 조합
const hasLen = (v: string) => v.length >= 8
const hasLetter = (v: string) => /[a-zA-Z]/.test(v)
const hasNumber = (v: string) => /[0-9]/.test(v)
const hasSpecial = (v: string) => /[^a-zA-Z0-9]/.test(v)
const pwValid = (v: string) => hasLen(v) && hasLetter(v) && hasNumber(v) && hasSpecial(v)

const CURRENT_PW = "1234" // 목업: 로그인 상태 사용자의 현재 비밀번호

/* ---------- main flow ---------- */

export function PasswordResetFlow({
  mode,
  loggedIn,
  userName,
}: {
  mode: Mode
  loggedIn: boolean
  userName?: string
}) {
  // 진입 경로/세션에 따라 상태 자동 결정: 로그인 상태 → 변경(B), 비로그인 → 찾기(A)
  const derivedState: ResetState = loggedIn ? "change" : "find"

  return (
    <div className="relative mx-auto flex w-full max-w-[360px] flex-col gap-5 py-4">
      <div className="text-center">
        <h2 className="text-base font-bold text-neutral-900">
          {derivedState === "find" ? "비밀번호 찾기" : "비밀번호 변경"}
        </h2>
        <p className="mt-0.5 text-[11px] text-neutral-500">SCR-AUTH-004 · REQ-NFR-001</p>
      </div>

      {/* 상태 표시 탭 (진입 경로에 따라 자동 결정 — 읽기 전용 안내) */}
      <div className="flex rounded-none border border-neutral-400">
        <div
          className={`flex-1 px-2 py-1.5 text-center text-[10px] font-semibold ${
            derivedState === "find" ? "bg-neutral-900 text-white" : "bg-white text-neutral-400"
          }`}
        >
          상태 A · 비밀번호 찾기
          <span className="mt-0.5 block text-[8px] font-normal opacity-80">비로그인</span>
        </div>
        <div
          className={`flex-1 border-l border-neutral-400 px-2 py-1.5 text-center text-[10px] font-semibold ${
            derivedState === "change" ? "bg-neutral-900 text-white" : "bg-white text-neutral-400"
          }`}
        >
          상태 B · 비밀번호 변경
          <span className="mt-0.5 block text-[8px] font-normal opacity-80">로그인 상태</span>
        </div>
      </div>
      <p className="-mt-2 text-center text-[9px] text-neutral-400">
        진입 경로/세션에 따라 상태가 자동 결정됩니다 (탭은 읽기 전용)
      </p>

      {derivedState === "find" ? <FindState mode={mode} /> : <ChangeState userName={userName} />}
    </div>
  )
}

/* ==================== 상태 A: 비밀번호 찾기 (비로그인) ==================== */

function FindState({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"form" | "sent" | "expired">("form")

  const valid = useMemo(() => emailRe.test(email), [email])

  function requestLink() {
    if (!valid || loading) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      // 보안상 계정 존재 여부와 무관하게 동일 안내
      setStep("sent")
    }, 1300)
  }

  if (step === "sent") {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
        <MailCheck className="h-9 w-9 text-neutral-900" strokeWidth={1.5} />
        <p className="text-sm font-semibold text-neutral-900">재설정 링크를 이메일로 발송했습니다</p>
        <p className="max-w-[280px] text-[11px] leading-relaxed text-neutral-600">
          30분 이내에 <span className="font-semibold">{email || "입력하신 이메일"}</span> 로 전송된 링크를 확인해주세요.
        </p>
        <p className="max-w-[280px] rounded-none border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-[9px] leading-relaxed text-neutral-500">
          보안을 위해 가입되지 않은 이메일이라도 동일한 안내가 표시됩니다 (계정 존재 여부 비노출).
        </p>
        {/* 목업: 링크 만료 상황 재현 */}
        <button
          onClick={() => setStep("expired")}
          className="mt-2 rounded-none border border-neutral-400 bg-white px-3 py-1.5 text-[10px] font-semibold text-neutral-700"
        >
          [데모] 30분 경과 후 링크 클릭
        </button>
      </div>
    )
  }

  if (step === "expired") {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
        <AlertTriangle className="h-9 w-9 text-neutral-900" strokeWidth={1.5} />
        <p className="text-sm font-semibold text-neutral-900">만료된 링크입니다</p>
        <p className="max-w-[280px] text-[11px] leading-relaxed text-neutral-600">
          재설정 링크는 발송 후 30분간만 유효합니다. 다시 요청해주세요.
        </p>
        <button
          onClick={() => {
            setStep("form")
            setEmail("")
          }}
          className="mt-1 flex items-center gap-2 rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
        >
          다시 요청하기
        </button>
      </div>
    )
  }

  // form
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] leading-relaxed text-neutral-600">
        가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      {/* ① 가입 이메일 */}
      <div className="relative">
        <Num n="1" />
        <FieldLabel>가입 이메일</FieldLabel>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) requestLink()
          }}
          placeholder="you@example.com"
          className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />
      </div>

      {/* ② 재설정 링크 받기 */}
      <div className="relative">
        <Num n="2" />
        <button
          type="button"
          disabled={!valid || loading}
          onClick={requestLink}
          className="flex w-full items-center justify-center gap-2 rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? "발송 중..." : "재설정 링크 받기"}
        </button>
        {!valid && (
          <span className="mt-1 block text-center text-[10px] text-neutral-400">
            유효한 이메일 형식 입력 시 활성화됩니다
          </span>
        )}
      </div>
    </div>
  )
}

/* ==================== 상태 B: 비밀번호 변경 (로그인 상태) ==================== */

function ChangeState({ userName }: { userName?: string }) {
  const [curPw, setCurPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [curError, setCurError] = useState<string | null>(null)

  const rules = useMemo(
    () => [
      { label: "8자 이상", ok: hasLen(newPw) },
      { label: "영문 포함", ok: hasLetter(newPw) },
      { label: "숫자 포함", ok: hasNumber(newPw) },
      { label: "특수문자 포함", ok: hasSpecial(newPw) },
    ],
    [newPw],
  )

  const newValid = pwValid(newPw)
  const matchError = confirmPw.length > 0 && newPw !== confirmPw
  const formValid = curPw.length > 0 && newValid && confirmPw.length > 0 && newPw === confirmPw

  function submit() {
    if (!formValid || loading) return
    setCurError(null)
    if (curPw !== CURRENT_PW) {
      setCurError("현재 비밀번호가 올바르지 않습니다")
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 1300)
  }

  if (done) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
        <CheckCircle2 className="h-9 w-9 text-neutral-900" strokeWidth={1.5} />
        <p className="text-sm font-semibold text-neutral-900">비밀번호가 변경되었습니다</p>
        <p className="max-w-[280px] text-[11px] leading-relaxed text-neutral-600">
          보안을 위해 다시 로그인해주세요. 로그인 화면으로 이동합니다.
        </p>
        <GoToLogin />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] leading-relaxed text-neutral-600">
        {userName ? `${userName}님, ` : ""}현재 비밀번호 확인 후 새 비밀번호로 변경할 수 있습니다.
      </p>

      {/* ③ 현재 비밀번호 */}
      <div className="relative">
        <Num n="3" />
        <FieldLabel>현재 비밀번호</FieldLabel>
        <div className="relative">
          <input
            type={showCur ? "text" : "password"}
            value={curPw}
            onChange={(e) => {
              setCurPw(e.target.value)
              if (curError) setCurError(null)
            }}
            placeholder="현재 비밀번호 (목업: 1234)"
            className={`w-full rounded-none border bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
              curError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
            }`}
          />
          <button
            type="button"
            aria-label="현재 비밀번호 표시 전환"
            onClick={() => setShowCur((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {curError && <ErrorText>{curError}</ErrorText>}
      </div>

      {/* ④ 신규 비밀번호 */}
      <div className="relative">
        <Num n="4" />
        <FieldLabel>신규 비밀번호</FieldLabel>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="새 비밀번호"
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
          <button
            type="button"
            aria-label="신규 비밀번호 표시 전환"
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {/* REQ-NFR-001: 규칙 실시간 안내 */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {rules.map((r) => (
            <span
              key={r.label}
              className={`rounded-none border px-1.5 py-0.5 text-[9px] font-medium ${
                r.ok ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-400 bg-white text-neutral-500"
              }`}
            >
              {r.ok ? "✓ " : "○ "}
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* ⑤ 신규 비밀번호 확인 */}
      <div className="relative">
        <Num n="5" />
        <FieldLabel>신규 비밀번호 확인</FieldLabel>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="새 비밀번호 확인"
            className={`w-full rounded-none border bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
              matchError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
            }`}
          />
          <button
            type="button"
            aria-label="비밀번호 확인 표시 전환"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {matchError && <ErrorText>비밀번호가 일치하지 않습니다</ErrorText>}
      </div>

      {/* ⑥ 변경하기 */}
      <div className="relative">
        <Num n="6" />
        <button
          type="button"
          disabled={!formValid || loading}
          onClick={submit}
          className="flex w-full items-center justify-center gap-2 rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? "변경 중..." : "변경하기"}
        </button>
        {!formValid && (
          <span className="mt-1 block text-center text-[10px] text-neutral-400">
            ③④⑤ 유효 시 활성화됩니다
          </span>
        )}
      </div>
    </div>
  )
}
