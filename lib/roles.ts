export type RoleKey = "guest" | "company_admin" | "field_staff" | "customer" | "platform_admin"

export const ROLE_LABEL: Record<RoleKey, string> = {
  guest: "비로그인",
  company_admin: "업체 관리자",
  field_staff: "현장 담당자",
  customer: "인테리어 고객",
  platform_admin: "플랫폼 관리자",
}

export const ROLE_ORDER: RoleKey[] = ["guest", "company_admin", "field_staff", "customer", "platform_admin"]

/** 로그인 성공 시 역할별 기본 진입 화면 (SCR-AUTH-003 로그인 화면 로직과 동일한 매핑) */
export const ROLE_HOME_SLUG: Record<Exclude<RoleKey, "guest">, string> = {
  company_admin: "scr-dash-001",
  field_staff: "scr-proc-001",
  customer: "scr-dash-002",
  platform_admin: "scr-comp-001",
}

export type CategoryKey = "AUTH" | "COMP" | "INQ" | "QUOTE" | "CONT" | "PROC" | "PAY" | "NOTI" | "DASH" | "EXT"

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  AUTH: "인증/계정관리",
  COMP: "업체관리",
  INQ: "고객문의관리",
  QUOTE: "견적관리",
  CONT: "계약관리",
  PROC: "시공관리",
  PAY: "결제관리",
  NOTI: "알림관리",
  DASH: "대시보드",
  EXT: "확장검토(AI연계)",
}

export const CATEGORY_ORDER: CategoryKey[] = [
  "AUTH",
  "COMP",
  "INQ",
  "QUOTE",
  "CONT",
  "PROC",
  "PAY",
  "NOTI",
  "DASH",
  "EXT",
]
