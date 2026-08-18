"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, Loader2, ChevronDown, Check } from "lucide-react"

type Mode = "desktop" | "mobile"
type Step = "form" | "sending" | "verifying" | "done"
type Channel = "email" | "phone"

/* ---------- shared wireframe primitives (match SignupFlow) ---------- */

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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-neutral-700">
      {children}
      {required && <span className="ml-0.5 text-neutral-900">*</span>}
      {!required && <span className="ml-1 font-normal text-neutral-400">(선택)</span>}
    </span>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 block text-[10px] font-medium text-neutral-900 underline decoration-neutral-900">
      ⚠ {children}
    </span>
  )
}

/* ---------- helpers ---------- */

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TERMS = [
  { key: "age", label: "[필수] 만 14세 이상입니다", required: true, body: "본 서비스는 만 14세 이상만 가입할 수 있습니다." },
  { key: "tos", label: "[필수] 서비스 이용약관 동의", required: true, body: "서비스 이용약관 전문... (와이어프레임 더미 텍스트)" },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의", required: true, body: "개인정보 수집 항목 및 이용 목적... (와이어프레임 더미 텍스트)" },
  { key: "marketing", label: "[선택] 마케팅 정보 수신 동의", required: false, body: "이벤트/혜택 정보를 이메일·문자로 받아봅니다." },
] as const

type TermKey = (typeof TERMS)[number]["key"]

/* ---------- main flow ---------- */

export function CustomerSignupFlow({ mode }: { mode: Mode }) {
  const compact = mode === "mobile"
  const [step, setStep] = useState<Step>("form")

  const [name, setName] = useState("")
  const [channel, setChannel] = useState<Channel>("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [pw, setPw] = useState("")
  const [pw2, setPw2] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [addr, setAddr] = useState("")
  const [addrLater, setAddrLater] = useState(false)

  // email verification
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [verified, setVerified] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)

  // terms
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    age: false,
    tos: false,
    privacy: false,
    marketing: false,
  })
  const [openTerm, setOpenTerm] = useState<TermKey | null>(null)

  // field errors
  const [emailError, setEmailError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const phoneDigits = phone.replace(/\D/g, "")

  // countdown
  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearInterval(t)
  }, [secondsLeft])

  const requiredTermsOk = TERMS.filter((t) => t.required).every((t) => agreed[t.key])
  const allChecked = TERMS.every((t) => agreed[t.key])

  const contactOk =
    channel === "email"
      ? emailRe.test(email) && verified
      : phoneDigits.length >= 10

  const formValid = useMemo(() => {
    return name.trim().length > 0 && contactOk && pw.length >= 1 && pw === pw2 && requiredTermsOk
  }, [name, contactOk, pw, pw2, requiredTermsOk])

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3000)
  }

  function toggleAll(v: boolean) {
    setAgreed({ age: v, tos: v, privacy: v, marketing: v })
  }

  function sendCode() {
    setEmailError(null)
    if (!emailRe.test(email)) {
      setEmailError("올바른 이메일 형식을 입력하세요")
      return
    }
    if (email.trim().toLowerCase() === "dup@test.com") {
      setEmailError("이미 등록된 정보입니다")
      return
    }
    setCodeSent(true)
    setSecondsLeft(180)
    setAttempts(0)
    setVerified(false)
    setCode("")
    setCodeError(null)
    showToast("인증번호를 발송했습니다 (목업: 123456)")
  }

  function verifyCode() {
    if (verified) return
    if (code === "123456") {
      setVerified(true)
      setCodeError(null)
      setSecondsLeft(0)
      return
    }
    const next = attempts + 1
    setAttempts(next)
    if (next >= 3) {
      setCodeError("인증번호를 3회 잘못 입력했습니다. [재발송] 후 다시 시도해 주세요.")
    } else {
      setCodeError(`인증번호가 일치하지 않습니다 (${next}/3회)`)
    }
  }

  function handleSubmit() {
    if (!formValid) return
    setPhoneError(null)
    setStep("sending")
    window.setTimeout(() => {
      // duplicate phone exception (phone channel)
      if (channel === "phone" && phone === "010-1234-5678") {
        setPhoneError("이미 등록된 정보입니다")
        setStep("form")
        return
      }
      // email already verified above → immediate activation
      setStep("done")
      window.setTimeout(() => {
        showToast("계정이 활성화되었습니다. 로그인 화면(SCR-AUTH-003)으로 이동합니다.")
      }, 400)
    }, 1500)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0")
  const ss = String(secondsLeft % 60).padStart(2, "0")

  /* ----- step screens ----- */
  if (step === "sending") {
    return (
      <StepScreen>
        <Loader2 className="h-8 w-8 animate-spin text-neutral-700" strokeWidth={1.5} />
        <p className="text-sm font-medium text-neutral-800">가입 처리 중...</p>
        <p className="text-[11px] text-neutral-500">잠시만 기다려 주세요</p>
      </StepScreen>
    )
  }

  if (step === "done") {
    return (
      <StepScreen>
        <div className="flex h-14 w-14 items-center justify-center rounded-none border-2 border-neutral-900 bg-white">
          <Check className="h-7 w-7 text-neutral-900" strokeWidth={2.5} />
        </div>
        <p className="text-center text-sm font-semibold text-neutral-900">가입이 완료되었습니다</p>
        <p className="max-w-[260px] text-center text-[11px] leading-relaxed text-neutral-500">
          별도 승인 절차 없이 계정이 즉시 활성화되었습니다. 잠시 후 로그인 화면으로 자동 이동합니다.
        </p>
        <div className="relative w-full max-w-[260px]">
          <Num n="9" />
          <button
            onClick={() => {
              setStep("form")
              showToast("로그인 화면(SCR-AUTH-003)으로 이동 (목업)")
            }}
            className="w-full rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
          >
            로그인 화면으로 이동 (SCR-AUTH-003)
          </button>
        </div>
        <Toast toast={toast} />
      </StepScreen>
    )
  }

  /* ----- form ----- */
  return (
    <div className="relative flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-neutral-900">고객 간편 회원가입</h2>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          필수 항목(①②③⑤)을 완료하면 가입하기 버튼이 활성화됩니다.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ① 이름 */}
        <div className="relative">
          <Num n="1" />
          <FieldLabel required>이름</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        {/* ② 이메일 또는 휴대폰번호 (탭) */}
        <div className="relative">
          <Num n="2" />
          <FieldLabel required>이메일 또는 휴대폰번호</FieldLabel>

          {/* channel tabs */}
          <div className="mb-2 flex">
            {(["email", "phone"] as Channel[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setChannel(c)
                  setEmailError(null)
                  setPhoneError(null)
                }}
                className={`flex-1 rounded-none border px-3 py-1.5 text-[11px] font-semibold ${
                  channel === c
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-400 bg-white text-neutral-500"
                } ${c === "phone" ? "-ml-px" : ""}`}
              >
                {c === "email" ? "이메일" : "휴대폰번호"}
              </button>
            ))}
          </div>

          {channel === "email" ? (
            <div className="flex flex-col gap-2">
              <div className={compact ? "flex flex-col gap-2" : "flex items-start gap-2"}>
                <div className="flex-1">
                  <input
                    value={email}
                    disabled={verified}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError(null)
                    }}
                    placeholder="you@example.com"
                    className={`w-full rounded-none border bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:bg-neutral-100 ${
                      emailError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
                    }`}
                  />
                </div>
                {/* ⑦ 인증번호 발송 */}
                <div className="relative shrink-0">
                  <Num n="7" />
                  <button
                    type="button"
                    disabled={verified}
                    onClick={sendCode}
                    className="whitespace-nowrap rounded-none border border-neutral-900 bg-white px-3 py-2 text-[11px] font-semibold text-neutral-900 disabled:border-neutral-300 disabled:text-neutral-400"
                  >
                    {codeSent ? "재발송" : "인증번호 발송"}
                  </button>
                </div>
              </div>
              {emailError && <ErrorText>{emailError}</ErrorText>}

              {/* ⑧ 인증번호 입력 + 타이머 */}
              {codeSent && !verified && (
                <div className="relative rounded-none border border-dashed border-neutral-400 bg-neutral-50 p-2">
                  <Num n="8" />
                  <div className="flex items-center gap-2">
                    <input
                      value={code}
                      inputMode="numeric"
                      maxLength={6}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, ""))
                        if (codeError) setCodeError(null)
                      }}
                      placeholder="인증번호 6자리"
                      className="flex-1 rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                    />
                    <span className="w-12 shrink-0 text-center text-[11px] font-bold tabular-nums text-neutral-700">
                      {secondsLeft > 0 ? `${mm}:${ss}` : "00:00"}
                    </span>
                    <button
                      type="button"
                      onClick={verifyCode}
                      disabled={attempts >= 3 || secondsLeft <= 0}
                      className="shrink-0 rounded-none border border-neutral-900 bg-neutral-900 px-3 py-2 text-[11px] font-semibold text-white disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400"
                    >
                      확인
                    </button>
                  </div>
                  {secondsLeft <= 0 && attempts < 3 && (
                    <span className="mt-1 block text-[10px] text-neutral-500">인증 시간이 만료되었습니다. [재발송] 해주세요.</span>
                  )}
                  {codeError && <ErrorText>{codeError}</ErrorText>}
                  <span className="mt-1 block text-[10px] text-neutral-400">목업 인증번호: 123456</span>
                </div>
              )}

              {verified && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-900">
                  <Check className="h-3.5 w-3.5" /> 이메일 인증 완료
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                value={phone}
                inputMode="numeric"
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value))
                  if (phoneError) setPhoneError(null)
                }}
                placeholder="010-0000-0000"
                className={`w-full rounded-none border bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
                  phoneError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
                }`}
              />
              {phoneError && <ErrorText>{phoneError}</ErrorText>}
            </div>
          )}
        </div>

        {/* ③ 비밀번호 / 비밀번호 확인 */}
        <div className="relative">
          <Num n="3" />
          <FieldLabel required>비밀번호 / 비밀번호 확인</FieldLabel>
          <div className={compact ? "flex flex-col gap-3" : "grid grid-cols-2 gap-4"}>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value)
                  setPwError(null)
                }}
                placeholder="비밀번호"
                className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
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
            <div className="relative">
              <input
                type={showPw2 ? "text" : "password"}
                value={pw2}
                onChange={(e) => {
                  setPw2(e.target.value)
                  setPwError(null)
                }}
                onBlur={() => {
                  if (pw2 && pw !== pw2) setPwError("비밀번호가 일치하지 않습니다")
                }}
                placeholder="비밀번호 확인"
                className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
              <button
                type="button"
                aria-label="비밀번호 확인 표시 전환"
                onClick={() => setShowPw2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {pwError && <ErrorText>{pwError}</ErrorText>}
        </div>

        {/* ④ 주소 (선택) */}
        <div className="relative">
          <Num n="4" />
          <div className="mb-1 flex items-center justify-between">
            <FieldLabel>주소</FieldLabel>
            <button
              type="button"
              onClick={() => {
                setAddrLater((v) => !v)
                if (!addrLater) setAddr("")
              }}
              className="text-[10px] font-medium text-neutral-500 underline decoration-neutral-400"
            >
              {addrLater ? "지금 입력하기" : "나중에 입력하기"}
            </button>
          </div>
          <input
            value={addr}
            disabled={addrLater}
            onChange={(e) => setAddr(e.target.value)}
            placeholder={addrLater ? "가입 후 마이페이지에서 입력할 수 있습니다" : "주소를 입력하세요"}
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
          />
        </div>

        {/* ⑤ 약관 동의 */}
        <div className="relative">
          <Num n="5" />
          <FieldLabel required>약관 동의</FieldLabel>
          <div className="rounded-none border border-neutral-400 bg-white">
            {/* 전체 동의 */}
            <label className="flex cursor-pointer items-center gap-2 border-b border-neutral-300 bg-neutral-50 px-3 py-2">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-none border ${
                  allChecked ? "border-neutral-900 bg-neutral-900" : "border-neutral-500 bg-white"
                }`}
              >
                {allChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              <input type="checkbox" className="sr-only" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} />
              <span className="text-[11px] font-bold text-neutral-900">전체 동의</span>
            </label>

            {/* 개별 항목 아코디언 */}
            <ul>
              {TERMS.map((t) => {
                const open = openTerm === t.key
                return (
                  <li key={t.key} className="border-b border-neutral-200 last:border-b-0">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <label className="flex flex-1 cursor-pointer items-center gap-2">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-none border ${
                            agreed[t.key] ? "border-neutral-900 bg-neutral-900" : "border-neutral-500 bg-white"
                          }`}
                        >
                          {agreed[t.key] && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={agreed[t.key]}
                          onChange={(e) => setAgreed((prev) => ({ ...prev, [t.key]: e.target.checked }))}
                        />
                        <span className="text-[11px] text-neutral-800">{t.label}</span>
                      </label>
                      <button
                        type="button"
                        aria-label="약관 상세 보기"
                        onClick={() => setOpenTerm(open ? null : t.key)}
                        className="text-neutral-500"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {open && (
                      <p className="border-t border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-[10px] leading-relaxed text-neutral-500">
                        {t.body}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          {!requiredTermsOk && (
            <span className="mt-1 block text-[10px] text-neutral-400">[필수] 약관에 모두 동의해야 가입할 수 있습니다</span>
          )}
        </div>
      </div>

      {/* ⑥ 가입하기 */}
      <div className="relative mt-1">
        <Num n="6" />
        <button
          disabled={!formValid}
          onClick={handleSubmit}
          className={`w-full rounded-none border px-4 py-2.5 text-sm font-semibold ${
            formValid
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400"
          }`}
        >
          가입하기
        </button>
        {!formValid && (
          <span className="mt-1 block text-center text-[10px] text-neutral-400">
            필수 항목(①②③⑤)을 완료하면 활성화됩니다 {channel === "email" && "· 이메일 인증 필요"}
          </span>
        )}
      </div>

      <p className="rounded-none border border-dashed border-neutral-300 bg-neutral-50 p-2 text-[10px] leading-relaxed text-neutral-500">
        목업 테스트: 인증번호 <b>123456</b> · 이메일 <b>dup@test.com</b> → 중복 에러 · 휴대폰 <b>010-1234-5678</b> → 중복 에러 · 인증번호 3회 오입력 → 재발송 유도
      </p>

      <Toast toast={toast} />
    </div>
  )
}

/* ---------- shared sub-views ---------- */

function StepScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 py-8">{children}</div>
}

function Toast({ toast }: { toast: string | null }) {
  if (!toast) return null
  return (
    <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
      <div className="relative rounded-none border border-neutral-900 bg-neutral-900 px-3 py-2 text-[11px] font-medium text-white shadow">
        <span className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-none border border-white bg-neutral-900 text-[9px] font-bold">
          T
        </span>
        {toast}
      </div>
    </div>
  )
}
