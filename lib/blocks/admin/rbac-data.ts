// 목업 데이터 (실제 API 연동 없음)

export type RoleKey = "company_admin" | "site_manager" | "customer" | "platform_admin"

export interface RoleDef {
  key: RoleKey
  label: string
  locked?: boolean // 플랫폼관리자: 수정 불가
}

export const ROLES: RoleDef[] = [
  { key: "company_admin", label: "업체관리자" },
  { key: "site_manager", label: "현장담당자" },
  { key: "customer", label: "고객" },
  { key: "platform_admin", label: "플랫폼관리자", locked: true },
]

export interface MenuAccess {
  menu: string
  screenId: string
  allowed: boolean
}

export interface ApiScope {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  allowed: boolean
}

export const MENU_ACCESS: Record<RoleKey, MenuAccess[]> = {
  company_admin: [
    { menu: "대시보드", screenId: "SCR-DASH-001", allowed: true },
    { menu: "시공관리", screenId: "SCR-PROC-001", allowed: true },
    { menu: "견적관리", screenId: "SCR-QUOTE-001", allowed: true },
    { menu: "직원관리", screenId: "SCR-COMP-002", allowed: true },
    { menu: "결제관리", screenId: "SCR-PAY-001", allowed: false },
    { menu: "사용자 관리", screenId: "SCR-USER-001", allowed: true },
  ],
  site_manager: [
    { menu: "대시보드", screenId: "SCR-DASH-001", allowed: true },
    { menu: "시공관리", screenId: "SCR-PROC-001", allowed: true },
    { menu: "현장 일정", screenId: "SCR-SCHE-001", allowed: true },
    { menu: "작업 보고", screenId: "SCR-RPT-001", allowed: true },
    { menu: "견적관리", screenId: "SCR-QUOTE-001", allowed: false },
    { menu: "정산 관리", screenId: "SCR-PAY-001", allowed: false },
  ],
  customer: [
    { menu: "내 프로젝트", screenId: "SCR-MYPJ-001", allowed: true },
    { menu: "견적관리", screenId: "SCR-QUOTE-002", allowed: true },
    { menu: "진행 현황", screenId: "SCR-PROG-001", allowed: true },
    { menu: "메시지", screenId: "SCR-MSG-001", allowed: true },
    { menu: "결제관리", screenId: "SCR-PAY-002", allowed: false },
  ],
  platform_admin: [
    { menu: "대시보드", screenId: "SCR-DASH-001", allowed: true },
    { menu: "사용자 관리", screenId: "SCR-USER-001", allowed: true },
    { menu: "권한 관리", screenId: "SCR-RBAC-001", allowed: true },
    { menu: "업체 심사", screenId: "SCR-VET-001", allowed: true },
    { menu: "정산 관리", screenId: "SCR-PAY-001", allowed: true },
    { menu: "시스템 설정", screenId: "SCR-SYS-001", allowed: true },
  ],
}

export const API_SCOPE: Record<RoleKey, ApiScope[]> = {
  company_admin: [
    { path: "/api/v1/projects", method: "GET", allowed: true },
    { path: "/api/v1/projects", method: "POST", allowed: true },
    { path: "/api/v1/estimates", method: "GET", allowed: true },
    { path: "/api/v1/payments", method: "GET", allowed: false },
    { path: "/api/v1/users", method: "PUT", allowed: true },
  ],
  site_manager: [
    { path: "/api/v1/projects", method: "GET", allowed: true },
    { path: "/api/v1/schedules", method: "GET", allowed: true },
    { path: "/api/v1/reports", method: "POST", allowed: true },
    { path: "/api/v1/estimates", method: "GET", allowed: false },
  ],
  customer: [
    { path: "/api/v1/my-projects", method: "GET", allowed: true },
    { path: "/api/v1/estimates", method: "GET", allowed: true },
    { path: "/api/v1/messages", method: "POST", allowed: true },
    { path: "/api/v1/payments", method: "GET", allowed: false },
  ],
  platform_admin: [
    { path: "/api/v1/**", method: "GET", allowed: true },
    { path: "/api/v1/**", method: "POST", allowed: true },
    { path: "/api/v1/**", method: "PUT", allowed: true },
    { path: "/api/v1/**", method: "DELETE", allowed: true },
  ],
}

export interface AuditLog {
  actor: string
  at: string
  change: string
}

export const AUDIT_LOGS: AuditLog[] = [
  { actor: "admin@platform.co", at: "2026-08-18 14:22:10", change: "업체 관리자 · 결제관리(SCR-PAY-001) 접근 허용 → 차단" },
  { actor: "admin@platform.co", at: "2026-08-17 09:05:41", change: "현장담당자 · 작업 보고(SCR-RPT-001) 접근 차단 → 허용" },
  { actor: "root@platform.co", at: "2026-08-15 18:47:03", change: "고객 · 결제관리(SCR-PAY-002) 접근 허용 → 차단" },
]
