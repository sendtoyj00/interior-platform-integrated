"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Eye, EyeOff, Loader2, X, AlertTriangle, ArrowRight } from "lucide-react"

type Mode = "desktop" | "mobile"

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

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ---------- mock accounts (더미 계정) ---------- */

type Role = "company" | "field" | "customer" | "platform"

const ACCOUNTS: Record<string, { pw: string; role: Role; name: string; pending?: boolean }> = {
  "company@test.com": { pw: "1234", role: "company", name: "김업체" },
  "field@test.com": { pw: "1234", role: "field", name: "박현장" },
  "customer@test.com": { pw: "1234", role: "customer", name: "이고객" },
  "admin@test.com": { pw: "1234", role: "platform", name: "최관리" },
  "pending@test.com": { pw: "1234", role: "company", name: "승인대기업체", pending: true },
}

const ROUTE: Record<Role, { scr: string; label: string }> = {
  company: { scr: "SCR-DASH-001", label: "업체 대시보드" },
  field: { scr: "SCR-PROC-001", label: "공정관리 화면" },
  customer: { scr: "SCR-DASH-002", label: "고객 마이페이지" },
  platform: { scr: "SCR-COMP-001", label: "업체 승인관리 화면" },
}

/* ---------- session shared with shell via callback ---------- */

export type Session = { name: string; role: Role } | null

/* ---------- main flow ---------- */

export function LoginFlow({
  mode,
  session,
  onLogin,
  onRouted,
}: {
  mode: Mode
  session: Session
  onLogin: (s: Session) => void
  /** 역할별 자동 분기 이동 대상이 확정되었을 때 호출(실제 라우팅 연결용) */
  onRouted?: (route: { scr: string; label: string }) => void
}) {
  const compact = mode === "mobile"

  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [keepLogin, setKeepLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [failCount, setFailCount] = useState(0)

  // modals
  const [pendingModal, setPendingModal] = useState(false)
  const [captchaModal, setCaptchaModal] = useState(false)
  const [captchaChecked, setCaptchaChecked] = useState(false)

  // post-login routing banner
  const [routed, setRouted] = useState<{ scr: string; label: string } | null>(null)

  const formValid = useMemo(() => emailRe.test(email) && pw.length > 0, [email, pw])

  function attemptLogin() {
    if (!formValid || loading) return
    // 5회 이상 실패 → 캡차 우선
    if (failCount >= 5 && !captchaChecked) {
      setCaptchaModal(true)
      return
    }
    setError(null)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      const acct = ACCOUNTS[email.trim().toLowerCase()]
      if (!acct || acct.pw !== pw) {
        const next = failCount + 1
        setFailCount(next)
        setError("이메일 또는 비밀번호가 올바르지 않습니다")
        if (next >= 5) setCaptchaModal(true)
        return
      }
      if (acct.pending) {
        setPendingModal(true)
        return
      }
      // success → JWT 발급(목업) → 역할별 분기
      setFailCount(0)
      setCaptchaChecked(false)
      onLogin({ name: acct.name, role: acct.role })
      setRouted(ROUTE[acct.role])
      onRouted?.(ROUTE[acct.role])
    }, 1400)
  }

  /* ----- logged-in state: routing result ----- */
  if (session && routed) {
    return (
      <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 text-center">
        <span className="rounded-none border border-neutral-900 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
          JWT 발급 완료 (목업)
        </span>
        <p className="text-sm font-semibold text-neutral-900">
          {session.name}님, 로그인되었습니다
        </p>
        <div className="flex items-center gap-2 text-[11px] text-neutral-600">
          <span>역할에 따라 자동 이동:</span>
        </div>
        <div className="flex items-center gap-2 rounded-none border border-dashed border-neutral-400 bg-neutral-50 px-4 py-3">
          <span className="text-xs font-semibold text-neutral-900">{routed.label}</span>
          <ArrowRight className="h-4 w-4 text-neutral-500" />
          <span className="rounded-none border border-neutral-400 bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-700">
            {routed.scr}
          </span>
        </div>
        <p className="max-w-[280px] text-[10px] leading-relaxed text-neutral-400">
          헤더 우측에 사용자명과 로그아웃 버튼(⑥)이 노출됩니다. 로그아웃 시 확인 모달 후 로그인 화면으로 돌아옵니다.
        </p>
      </div>
    )
  }

  /* ----- login form ----- */
  return (
    <div className="relative mx-auto flex w-full max-w-[360px] flex-col gap-5 py-4">
      <div className="text-center">
        <h2 className="text-base font-bold text-neutral-900">로그인</h2>
        <p className="mt-0.5 text-[11px] text-neutral-500">전체 사용자 공용 · SCR-AUTH-003</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ① 이메일 */}
        <div className="relative">
          <Num n="1" />
          <FieldLabel>이메일</FieldLabel>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            placeholder="you@example.com"
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        {/* ② 비밀번호 */}
        <div className="relative">
          <Num n="2" />
          <FieldLabel>비밀번호</FieldLabel>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) attemptLogin()
              }}
              placeholder="비밀번호"
              className={`w-full rounded-none border bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
                error ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
              }`}
            />
            <button
              type="button"
              aria-label="비밀번호 표시 전환"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          {failCount > 0 && failCount < 5 && (
            <span className="mt-1 block text-[10px] text-neutral-400">로그인 실패 {failCount}/5회 (5회 시 캡차 인증)</span>
          )}
        </div>

        {/* ③ 로그인 상태 유지 */}
        <div className="relative">
          <Num n="3" />
          <label className="flex cursor-pointer items-center gap-2 pl-1">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-none border ${
                keepLogin ? "border-neutral-900 bg-neutral-900" : "border-neutral-500 bg-white"
              }`}
            >
              {keepLogin && <span className="text-[9px] font-bold leading-none text-white">✓</span>}
            </span>
            <input type="checkbox" className="sr-only" checked={keepLogin} onChange={(e) => setKeepLogin(e.target.checked)} />
            <span className="text-[11px] text-neutral-700">로그인 상태 유지</span>
          </label>
        </div>

        {/* ④ 로그인 버튼 */}
        <div className="relative">
          <Num n="4" />
          <button
            type="button"
            disabled={!formValid || loading}
            onClick={attemptLogin}
            className="flex w-full items-center justify-center gap-2 rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? "인증 중..." : "로그인"}
          </button>
          {!formValid && (
            <span className="mt-1 block text-center text-[10px] text-neutral-400">
              ①② 유효 형식 입력 시 활성화됩니다
            </span>
          )}
        </div>

        {/* ⑤ 하단 링크 */}
        <div className="relative flex items-center justify-center gap-3 pt-1">
          <Num n="5" />
          <button
            type="button"
            className="text-[11px] text-neutral-600 underline decoration-neutral-400"
          >
            비밀번호를 잊으셨나요?
          </button>
          <span className="text-neutral-300">|</span>
          <button
            type="button"
            className="text-[11px] font-semibold text-neutral-900 underline decoration-neutral-900"
          >
            회원가입
          </button>
        </div>
        <p className="text-center text-[9px] text-neutral-400">
          → SCR-AUTH-004(비밀번호 재설정) · SCR-AUTH-001/002(회원가입)
        </p>
      </div>

      {/* 목업 계정 안내 */}
      <div className="rounded-none border border-dashed border-neutral-300 bg-neutral-50 p-2 text-[9px] leading-relaxed text-neutral-500">
        <p className="mb-1 font-bold text-neutral-600">목업 계정 (pw: 1234)</p>
        <p>company@test.com · field@test.com · customer@test.com · admin@test.com</p>
        <p>pending@test.com → 승인 대기 · 오답 5회 → 캡차</p>
      </div>

      {/* 승인 대기 모달 */}
      {pendingModal && (
        <ModalOverlay compact={compact}>
          <div className="relative">
            <Num n="6" />
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-neutral-900" />
              <h3 className="text-sm font-bold text-neutral-900">승인 대기 중</h3>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-neutral-600">
              플랫폼 관리자 승인 후 이용 가능합니다. 승인이 완료되면 등록하신 이메일로 안내드립니다.
            </p>
            <button
              onClick={() => setPendingModal(false)}
              className="w-full rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
            >
              확인
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* 캡차 모달 */}
      {captchaModal && (
        <ModalOverlay compact={compact}>
          <div className="relative">
            <Num n="7" />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">보안 인증 (CAPTCHA)</h3>
              <button aria-label="닫기" onClick={() => setCaptchaModal(false)} className="text-neutral-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-[11px] leading-relaxed text-neutral-600">
              로그인 5회 이상 실패했습니다. 자동 로그인 방지를 위해 아래 인증을 완료해 주세요.
            </p>
            <div className="mb-3 flex items-center gap-2 rounded-none border border-neutral-400 bg-white px-3 py-3">
              <label className="flex cursor-pointer items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-none border ${
                    captchaChecked ? "border-neutral-900 bg-neutral-900" : "border-neutral-500 bg-white"
                  }`}
                >
                  {captchaChecked && <span className="text-[10px] font-bold leading-none text-white">✓</span>}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={captchaChecked}
                  onChange={(e) => setCaptchaChecked(e.target.checked)}
                />
                <span className="text-[11px] text-neutral-800">로봇이 아닙니다</span>
              </label>
              <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 text-[8px] text-neutral-400">
                CAPTCHA
              </span>
            </div>
            <button
              disabled={!captchaChecked}
              onClick={() => {
                setCaptchaModal(false)
                setFailCount(0)
              }}
              className="w-full rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400"
            >
              인증 완료
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

/* ---------- modal overlay ---------- */
function ModalOverlay({ children, compact }: { children: React.ReactNode; compact: boolean }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 p-4">
      <div className={`w-full rounded-none border-2 border-neutral-900 bg-white p-4 shadow-lg ${compact ? "" : "max-w-[300px]"}`}>
        {children}
      </div>
    </div>
  )
}
