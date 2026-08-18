import type { CategoryKey, RoleKey } from "./roles"

export interface ScreenMeta {
  /** 라우트 슬러그: /screens/{slug} */
  slug: string
  /** 화면 설계서 SCR ID */
  scrId: string
  /** 화면명 */
  title: string
  /** 대분류 카테고리 */
  category: CategoryKey
  /** 대상 역할 */
  roles: RoleKey[]
  /** 관련 요구사항 ID */
  reqId: string
  /** 화면 경로(브레드크럼) */
  screenPath: string
  /** 한 줄 설명 */
  summary: string
  /** 이동 화면(제안) — 관련 SCR ID 목록 */
  related: string[]
}

export const SCREENS: ScreenMeta[] = [
  {
    slug: "scr-auth-001",
    scrId: "SCR-AUTH-001",
    title: "업체 관리자 회원가입",
    category: "AUTH",
    roles: ["guest"],
    reqId: "REQ-AUTH-001",
    screenPath: "메인 > 회원가입 > 업체",
    summary: "상호명·사업자등록번호 등 업체 정보를 입력해 가입 후 플랫폼 관리자 승인을 기다리는 화면",
    related: ["SCR-AUTH-003"],
  },
  {
    slug: "scr-auth-002",
    scrId: "SCR-AUTH-002",
    title: "고객 회원가입",
    category: "AUTH",
    roles: ["guest"],
    reqId: "REQ-AUTH-001",
    screenPath: "메인 > 회원가입 > 고객",
    summary: "이메일/휴대폰 인증만으로 즉시 가입이 완료되는 고객용 간편가입 화면",
    related: ["SCR-AUTH-003"],
  },
  {
    slug: "scr-auth-003",
    scrId: "SCR-AUTH-003",
    title: "로그인 / 로그아웃",
    category: "AUTH",
    roles: ["guest", "company_admin", "field_staff", "customer", "platform_admin"],
    reqId: "REQ-AUTH-002",
    screenPath: "메인 > 로그인",
    summary: "전체 사용자 공용 로그인 화면. 인증 성공 시 역할에 따라 기본 화면으로 자동 분기 이동",
    related: ["SCR-DASH-001", "SCR-PROC-001", "SCR-DASH-002", "SCR-COMP-001", "SCR-AUTH-004", "SCR-AUTH-001", "SCR-AUTH-002"],
  },
  {
    slug: "scr-auth-004",
    scrId: "SCR-AUTH-004",
    title: "비밀번호 재설정 / 변경",
    category: "AUTH",
    roles: ["guest", "company_admin", "field_staff", "customer", "platform_admin"],
    reqId: "REQ-AUTH-003",
    screenPath: "메인 > 로그인 > 비밀번호 찾기 (비로그인) / 마이페이지 > 비밀번호 변경 (로그인)",
    summary: "비로그인 상태의 '비밀번호 찾기'와 로그인 상태의 '비밀번호 변경' 두 상태를 전환 가능",
    related: ["SCR-AUTH-003"],
  },
  {
    slug: "scr-auth-005",
    scrId: "SCR-AUTH-005",
    title: "역할기반 접근권한(RBAC) 관리",
    category: "AUTH",
    roles: ["platform_admin"],
    reqId: "REQ-AUTH-004",
    screenPath: "메인 > 시스템관리 > 권한관리",
    summary: "역할별 메뉴 접근권한 토글 및 API 접근범위(읽기전용)·감사로그를 관리하는 화면",
    related: ["SCR-COMP-001"],
  },
  {
    slug: "scr-comp-001",
    scrId: "SCR-COMP-001",
    title: "업체 등록 및 승인 관리",
    category: "COMP",
    roles: ["platform_admin"],
    reqId: "REQ-COMP-001",
    screenPath: "메인 > 업체관리 > 승인관리",
    summary: "가입 신청한 업체를 검토해 승인/반려 처리하는 플랫폼 관리자 화면",
    related: ["SCR-NOTI-001"],
  },
  {
    slug: "scr-comp-002",
    scrId: "SCR-COMP-002",
    title: "소속 직원(현장담당자) 관리",
    category: "COMP",
    roles: ["company_admin"],
    reqId: "REQ-COMP-002",
    screenPath: "메인 > 업체관리 > 직원관리",
    summary: "현장담당자를 초대하고 프로젝트를 배정하는 업체 관리자 화면",
    related: ["SCR-PROC-001"],
  },
  {
    slug: "scr-inq-001",
    scrId: "SCR-INQ-001",
    title: "시공 문의 등록",
    category: "INQ",
    roles: ["customer"],
    reqId: "REQ-INQ-001",
    screenPath: "메인 > 문의하기",
    summary: "업체 선택 후 공간정보·예산·일정을 입력해 시공 문의를 등록하는 고객용 화면",
    related: ["SCR-DASH-002", "SCR-INQ-002"],
  },
  {
    slug: "scr-inq-002",
    scrId: "SCR-INQ-002",
    title: "문의 처리 관리",
    category: "INQ",
    roles: ["company_admin"],
    reqId: "REQ-INQ-002",
    screenPath: "메인 > 문의관리",
    summary: "접수된 문의를 상태별로 관리하고 담당자를 배정하는 업체 관리자 화면",
    related: ["SCR-QUOTE-001"],
  },
  {
    slug: "scr-quote-001",
    scrId: "SCR-QUOTE-001",
    title: "견적서 작성",
    category: "QUOTE",
    roles: ["company_admin"],
    reqId: "REQ-QUOTE-001",
    screenPath: "메인 > 견적관리 > 작성",
    summary: "견적 항목을 구성하고 할인·합계를 실시간 계산해 고객에게 발송하는 화면",
    related: ["SCR-INQ-002", "SCR-QUOTE-002", "SCR-NOTI-001"],
  },
  {
    slug: "scr-quote-002",
    scrId: "SCR-QUOTE-002",
    title: "견적 승인 프로세스",
    category: "QUOTE",
    roles: ["customer", "company_admin"],
    reqId: "REQ-QUOTE-002",
    screenPath: "메인 > 견적확인",
    summary: "고객이 견적을 승인/거절하는 화면. 업체 관리자는 수정이력만 조회 가능한 읽기전용 모드",
    related: ["SCR-CONT-001"],
  },
  {
    slug: "scr-cont-001",
    scrId: "SCR-CONT-001",
    title: "계약서 생성/관리",
    category: "CONT",
    roles: ["company_admin"],
    reqId: "REQ-CONT-001",
    screenPath: "메인 > 계약관리",
    summary: "승인된 견적을 기반으로 계약서를 생성하고 전자서명·상태를 관리하는 화면",
    related: ["SCR-PAY-001"],
  },
  {
    slug: "scr-proc-001",
    scrId: "SCR-PROC-001",
    title: "공정 관리",
    category: "PROC",
    roles: ["field_staff"],
    reqId: "REQ-PROC-001",
    screenPath: "메인 > 시공관리 > 공정관리",
    summary: "세로 타임라인/체크리스트 형태로 공정 단계별 진행률과 지연 이슈를 관리하는 화면",
    related: ["SCR-PROC-002"],
  },
  {
    slug: "scr-proc-002",
    scrId: "SCR-PROC-002",
    title: "시공 사진 관리",
    category: "PROC",
    roles: ["field_staff", "customer"],
    reqId: "REQ-PROC-002",
    screenPath: "메인 > 시공관리 > 사진관리 (현장담당자) / 메인 > 마이페이지 > 사진갤러리 (고객)",
    summary: "현장담당자 업로드 모드와 고객 읽기전용 갤러리 모드를 전환할 수 있는 화면",
    related: ["SCR-PROC-001"],
  },
  {
    slug: "scr-pay-001",
    scrId: "SCR-PAY-001",
    title: "결제 단계 등록 및 상태 관리",
    category: "PAY",
    roles: ["company_admin"],
    reqId: "REQ-PAY-001",
    screenPath: "메인 > 결제관리",
    summary: "계약금/중도금/잔금 등 결제 마일스톤을 등록하고 입금을 확인하는 화면",
    related: ["SCR-NOTI-001", "SCR-PAY-002"],
  },
  {
    slug: "scr-pay-002",
    scrId: "SCR-PAY-002",
    title: "결제 이력 조회",
    category: "PAY",
    roles: ["customer", "company_admin"],
    reqId: "REQ-PAY-002",
    screenPath: "메인 > 마이페이지 > 결제내역 (고객) / 메인 > 대시보드 > 결제현황 (업체)",
    summary: "결제 단계별 타임라인과 진행률을 보여주는 읽기전용 컴포넌트 (고객/업체 양쪽 임베드)",
    related: ["SCR-PAY-001", "SCR-DASH-002"],
  },
  {
    slug: "scr-noti-001",
    scrId: "SCR-NOTI-001",
    title: "알림 발송 관리",
    category: "NOTI",
    roles: ["platform_admin", "company_admin"],
    reqId: "REQ-NOTI-001",
    screenPath: "메인 > 알림관리",
    summary: "이벤트 기반 자동 발송된 알림의 발송이력을 조회/모니터링하고 실패 건을 재발송하는 화면",
    related: ["SCR-COMP-001", "SCR-QUOTE-001", "SCR-PAY-001"],
  },
  {
    slug: "scr-dash-001",
    scrId: "SCR-DASH-001",
    title: "업체 대시보드",
    category: "DASH",
    roles: ["company_admin"],
    reqId: "REQ-DASH-001",
    screenPath: "메인 > 대시보드 (업체관리자 로그인 시 기본 진입 화면)",
    summary: "진행중 프로젝트·신규 문의·결제 현황 요약과 공정단계별 분포 차트를 보여주는 화면",
    related: ["SCR-PROC-001", "SCR-INQ-002"],
  },
  {
    slug: "scr-dash-002",
    scrId: "SCR-DASH-002",
    title: "고객 마이페이지",
    category: "DASH",
    roles: ["customer"],
    reqId: "REQ-DASH-002",
    screenPath: "메인 > 마이페이지 (고객 로그인 시 기본 진입 화면)",
    summary: "견적·계약·공정·결제·사진을 탭으로 구분해 한 화면에서 조회하는 프로젝트 통합 조회 화면",
    related: ["SCR-QUOTE-002", "SCR-CONT-001", "SCR-PROC-001", "SCR-PAY-002", "SCR-PROC-002"],
  },
  {
    slug: "scr-ext-001",
    scrId: "SCR-EXT-001",
    title: "문의 자동 분류 보조 (확장검토)",
    category: "EXT",
    roles: ["company_admin"],
    reqId: "REQ-EXT-001",
    screenPath: "메인 > 문의관리 > 자동분류 결과",
    summary: "규칙/통계 기반(LLM 아님) 자동분류 결과를 확인하고 담당자가 수동 정정할 수 있는 화면",
    related: ["SCR-INQ-002"],
  },
]

export function getScreenBySlug(slug: string): ScreenMeta | undefined {
  return SCREENS.find((s) => s.slug === slug)
}

export function getScreenByScrId(scrId: string): ScreenMeta | undefined {
  return SCREENS.find((s) => s.scrId === scrId)
}

export function slugFromScrId(scrId: string): string {
  return scrId.toLowerCase()
}
