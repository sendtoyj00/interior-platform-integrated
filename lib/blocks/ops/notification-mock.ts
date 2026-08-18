export type NotifEventType =
  | "quote" // 견적발송
  | "contract" // 계약승인요청
  | "progress" // 공정업데이트
  | "payment" // 결제상태변경

export type NotifStatus = "success" | "fail"

export type NotifLog = {
  id: string
  phone: string // 원본 (마스킹 전) — 화면에서는 항상 마스킹해서 표시
  template: string
  eventType: NotifEventType
  sentAt: string // ISO
  status: NotifStatus
  body: string // 발송 요청 본문
  failReason?: string // 실패 건일 때만
}

export const EVENT_LABEL: Record<NotifEventType, string> = {
  quote: "견적발송",
  contract: "계약승인요청",
  progress: "공정업데이트",
  payment: "결제상태변경",
}

/**
 * 개인정보 보호(REQ-NFR-007): 휴대폰 번호 가운데 자리 마스킹.
 * 010-1234-5678 -> 010-****-5678
 */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 7) return "***"
  const head = digits.slice(0, 3)
  const tail = digits.slice(-4)
  return `${head}-****-${tail}`
}

export function formatSentAt(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export const INITIAL_LOGS: NotifLog[] = [
  {
    id: "n-1001",
    phone: "010-2841-9930",
    template: "견적서 발송 안내",
    eventType: "quote",
    sentAt: "2026-08-18T09:12:00",
    status: "success",
    body: "[인테리어 플랫폼] 요청하신 견적서가 발송되었습니다. 앱에서 상세 내역을 확인해 주세요. https://itr.pf/q/8f3a",
  },
  {
    id: "n-1002",
    phone: "010-7712-0045",
    template: "계약 승인 요청",
    eventType: "contract",
    sentAt: "2026-08-18T10:03:00",
    status: "success",
    body: "[인테리어 플랫폼] 계약서 검토 및 승인이 요청되었습니다. 기한: 2026-08-22. https://itr.pf/c/aa19",
  },
  {
    id: "n-1003",
    phone: "010-3390-1188",
    template: "공정 진행 업데이트",
    eventType: "progress",
    sentAt: "2026-08-18T11:47:00",
    status: "fail",
    body: "[인테리어 플랫폼] '타일 시공' 공정이 업데이트되었습니다. 사진 3건이 추가되었습니다.",
    failReason: "수신자 번호 결번(무효 번호) — 통신사 반송코드 302",
  },
  {
    id: "n-1004",
    phone: "010-5567-8821",
    template: "결제 상태 변경 안내",
    eventType: "payment",
    sentAt: "2026-08-18T13:20:00",
    status: "success",
    body: "[인테리어 플랫폼] '중도금' 결제가 완료 처리되었습니다. 금액: 12,000,000원.",
  },
  {
    id: "n-1005",
    phone: "010-9021-4470",
    template: "견적서 발송 안내",
    eventType: "quote",
    sentAt: "2026-08-18T14:05:00",
    status: "fail",
    body: "[인테리어 플랫폼] 요청하신 견적서가 발송되었습니다. https://itr.pf/q/1c7d",
    failReason: "발송 게이트웨이 타임아웃 — 재시도 권장",
  },
  {
    id: "n-1006",
    phone: "010-1123-6654",
    template: "공정 진행 업데이트",
    eventType: "progress",
    sentAt: "2026-08-18T15:38:00",
    status: "success",
    body: "[인테리어 플랫폼] '도배' 공정이 완료되었습니다.",
  },
  {
    id: "n-1007",
    phone: "010-4480-2213",
    template: "계약 승인 요청",
    eventType: "contract",
    sentAt: "2026-08-18T16:52:00",
    status: "fail",
    body: "[인테리어 플랫폼] 계약서 승인이 요청되었습니다. https://itr.pf/c/ff02",
    failReason: "스팸 차단(수신 거부 설정) — 080 수신거부 이력",
  },
  {
    id: "n-1008",
    phone: "010-6634-7789",
    template: "결제 상태 변경 안내",
    eventType: "payment",
    sentAt: "2026-08-18T17:26:00",
    status: "success",
    body: "[인테리어 플랫폼] '잔금' 입금이 확인되었습니다. 감사합니다.",
  },
]
