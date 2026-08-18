"use client"

import type React from "react"
import { useMemo, useRef, useState } from "react"
import { Eye, EyeOff, Loader2, ImageIcon, X } from "lucide-react"

type Mode = "desktop" | "mobile"
type Step = "form" | "sending" | "emailSent" | "approvalWaiting"

/* ---------- small wireframe primitives ---------- */

// numbered badge shown at the top-left of every interactive element
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
  return <span className="mt-1 block text-[10px] font-medium text-neutral-900 underline decoration-neutral-900">⚠ {children}</span>
}

/* ---------- formatting helpers ---------- */

function formatBiz(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ---------- main flow ---------- */

export function SignupFlow({ mode }: { mode: Mode }) {
  const [step, setStep] = useState<Step>("form")

  const [companyName, setCompanyName] = useState("")
  const [biz, setBiz] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [pw2, setPw2] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const [intro, setIntro] = useState("")

  const [bizError, setBizError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  const bizDigits = biz.replace(/\D/g, "")
  const phoneDigits = phone.replace(/\D/g, "")

  const formValid = useMemo(() => {
    return (
      companyName.trim().length > 0 &&
      bizDigits.length === 10 &&
      phoneDigits.length >= 10 &&
      emailRe.test(email) &&
      pw.length >= 1 &&
      pw === pw2
    )
  }, [companyName, bizDigits, phoneDigits, email, pw, pw2])

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3000)
  }

  function handleBizBlur() {
    if (biz.length > 0 && bizDigits.length !== 10) {
      setBizError("사업자등록번호는 10자리 숫자여야 합니다 (000-00-00000)")
    } else {
      setBizError(null)
    }
  }

  function handleSubmit() {
    if (!formValid) return
    setBizError(null)
    setEmailError(null)
    setStep("sending")

    window.setTimeout(() => {
      // mock exception handling
      if (email.includes("error")) {
        setStep("form")
        showToast("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
        return
      }
      const dupEmail = email.trim().toLowerCase() === "dup@test.com"
      const dupBiz = biz === "123-45-67890"
      if (dupEmail || dupBiz) {
        if (dupEmail) setEmailError("이미 등록된 정보입니다")
        if (dupBiz) setBizError("이미 등록된 정보입니다")
        setStep("form")
        return
      }
      setStep("emailSent")
    }, 1500)
  }

  const compact = mode === "mobile"

  /* ----- non-form step screens ----- */
  if (step === "sending") {
    return (
      <StepScreen>
        <Loader2 className="h-8 w-8 animate-spin text-neutral-700" strokeWidth={1.5} />
        <p className="text-sm font-medium text-neutral-800">가입 처리 중...</p>
        <p className="text-[11px] text-neutral-500">잠시만 기다려 주세요</p>
      </StepScreen>
    )
  }

  if (step === "emailSent") {
    return (
      <StepScreen>
        <WireIconBox label="MAIL" />
        <p className="text-center text-sm font-semibold text-neutral-900">이메일 인증 메일을 발송했습니다</p>
        <p className="max-w-[260px] text-center text-[11px] leading-relaxed text-neutral-500">
          {email || "가입 이메일"} 주소로 발송된 메일의 인증 링크를 클릭해 주세요.
        </p>
        <div className="relative w-full max-w-[260px]">
          <Num n="9" />
          <button
            onClick={() => setStep("approvalWaiting")}
            className="w-full rounded-none border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
          >
            이메일 인증 완료 (목업)
          </button>
        </div>
      </StepScreen>
    )
  }

  if (step === "approvalWaiting") {
    return (
      <StepScreen>
        <WireIconBox label="WAIT" />
        <p className="text-center text-sm font-semibold text-neutral-900">플랫폼 관리자 승인 대기 중</p>
        <div className="w-full max-w-[280px] rounded-none border border-dashed border-neutral-400 bg-neutral-50 p-3">
          <p className="text-center text-[11px] leading-relaxed text-neutral-600">
            관리자 승인이 완료되기 전까지는 로그인할 수 없습니다. 승인 결과는 가입하신 이메일로 안내됩니다.
          </p>
        </div>
        <div className="relative w-full max-w-[280px]">
          <Num n="10" />
          <button
            onClick={() => {
              setStep("form")
              showToast("로그인 화면(SCR-AUTH-003)으로 이동 (목업)")
            }}
            className="w-full rounded-none border border-neutral-900 bg-white px-4 py-2 text-xs font-semibold text-neutral-900"
          >
            로그인 화면으로 이동 (SCR-AUTH-003)
          </button>
        </div>
        <Toast toast={toast} />
      </StepScreen>
    )
  }

  /* ----- form step ----- */
  return (
    <div className="relative flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-neutral-900">업체 관리자 회원가입</h2>
        <p className="mt-0.5 text-[11px] text-neutral-500">필수 항목(*)을 모두 입력하면 가입하기 버튼이 활성화됩니다.</p>
      </div>

      <div className={compact ? "flex flex-col gap-4" : "grid grid-cols-2 gap-x-6 gap-y-4"}>
        {/* ① 상호명 */}
        <div className="relative">
          <Num n="1" />
          <FieldLabel required>상호명</FieldLabel>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="상호명을 입력하세요"
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        {/* ② 사업자등록번호 */}
        <div className="relative">
          <Num n="2" />
          <FieldLabel required>사업자등록번호</FieldLabel>
          <input
            value={biz}
            inputMode="numeric"
            onChange={(e) => {
              setBiz(formatBiz(e.target.value))
              if (bizError) setBizError(null)
            }}
            onBlur={handleBizBlur}
            placeholder="000-00-00000"
            className={`w-full rounded-none border bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
              bizError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
            }`}
          />
          {bizError && <ErrorText>{bizError}</ErrorText>}
        </div>

        {/* ③ 담당자 연락처 */}
        <div className="relative">
          <Num n="3" />
          <FieldLabel required>담당자 연락처</FieldLabel>
          <input
            value={phone}
            inputMode="numeric"
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            className="w-full rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        {/* ④ 이메일 */}
        <div className="relative">
          <Num n="4" />
          <FieldLabel required>이메일</FieldLabel>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            placeholder="manager@company.com"
            className={`w-full rounded-none border bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none ${
              emailError ? "border-neutral-900 bg-neutral-100" : "border-neutral-400 focus:border-neutral-900"
            }`}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}
        </div>

        {/* ⑤ 비밀번호 / 비밀번호 확인 */}
        <div className="relative col-span-2">
          <Num n="5" />
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

        {/* ⑥ 업체 로고 업로드 */}
        <div className="relative">
          <Num n="6" />
          <FieldLabel>업체 로고 업로드</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none border border-dashed border-neutral-400 bg-neutral-50">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo || "/placeholder.svg"} alt="로고 미리보기" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-neutral-400" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-none border border-neutral-400 bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-800"
              >
                이미지 선택
              </button>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="flex items-center gap-1 text-[10px] text-neutral-500"
                >
                  <X className="h-3 w-3" /> 제거
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setLogo(URL.createObjectURL(f))
              }}
            />
          </div>
        </div>

        {/* ⑦ 업체 소개글 */}
        <div className="relative">
          <Num n="7" />
          <FieldLabel>업체 소개글</FieldLabel>
          <textarea
            value={intro}
            maxLength={300}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            placeholder="업체 소개글을 입력하세요 (최대 300자)"
            className="w-full resize-none rounded-none border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          />
          <span className="mt-0.5 block text-right text-[10px] text-neutral-500">{intro.length} / 300</span>
        </div>
      </div>

      {/* ⑧ 가입하기 */}
      <div className="relative mt-1">
        <Num n="8" />
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
            필수 항목(①~⑤)을 유효하게 입력하면 활성화됩니다
          </span>
        )}
      </div>

      <p className="rounded-none border border-dashed border-neutral-300 bg-neutral-50 p-2 text-[10px] leading-relaxed text-neutral-500">
        목업 테스트: 이메일 <b>dup@test.com</b> 또는 사업자번호 <b>123-45-67890</b> → 중복 에러 / 이메일에 <b>error</b> 포함 → 네트워크 오류 토스트
      </p>

      <Toast toast={toast} />
    </div>
  )
}

/* ---------- shared sub-views ---------- */

function StepScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 py-8">{children}</div>
}

function WireIconBox({ label }: { label: string }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-none border-2 border-neutral-900 bg-white">
      <span className="text-[10px] font-bold tracking-widest text-neutral-900">{label}</span>
    </div>
  )
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
