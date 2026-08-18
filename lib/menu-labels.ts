/**
 * 화면, 역할별 내비게이션, 권한 표에서 함께 쓰는 단일 메뉴 명칭입니다.
 * 기능이 같으면 이 값을 재사용해 화면마다 다른 이름이 생기지 않게 합니다.
 */
export const MENU_LABEL = {
  dashboard: "대시보드",
  company: "업체관리",
  staff: "직원관리",
  inquiry: "문의관리",
  quote: "견적관리",
  contract: "계약관리",
  process: "시공관리",
  payment: "결제관리",
  notification: "알림관리",
  permission: "권한관리",
  mypage: "마이페이지",
  photo: "사진관리",
  settings: "설정",
} as const

export const COMPANY_MENU = [
  MENU_LABEL.dashboard,
  MENU_LABEL.inquiry,
  MENU_LABEL.quote,
  MENU_LABEL.contract,
  MENU_LABEL.process,
  MENU_LABEL.payment,
  MENU_LABEL.notification,
  MENU_LABEL.company,
] as const

export const CUSTOMER_MENU = [
  MENU_LABEL.mypage,
  MENU_LABEL.inquiry,
  MENU_LABEL.quote,
  MENU_LABEL.contract,
  MENU_LABEL.process,
  MENU_LABEL.payment,
  MENU_LABEL.photo,
] as const
