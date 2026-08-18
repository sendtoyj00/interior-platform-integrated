// 목업 데이터 (실제 API 연동 없음) — 업체 가입 승인 관리

export type VendorStatus = "pending" | "approved" | "rejected"

export interface Vendor {
  id: string
  name: string // 상호명
  bizNo: string // 사업자등록번호
  contact: string // 담당자 연락처
  managerName: string // 담당자명
  appliedAt: string // 가입신청일
  status: VendorStatus
  // 사업자정보 전체
  ceo: string // 대표자명
  bizType: string // 업태/종목
  address: string // 사업장 주소
  email: string // 이메일
  intro: string // 소개글
  logoLabel: string // 업로드된 로고 파일명 (미리보기 placeholder)
  // 처리 이력 (반려 사유 등, 영구 보관)
  processedAt?: string
  processedBy?: string
  rejectReason?: string
}

export const STATUS_LABEL: Record<VendorStatus, string> = {
  pending: "승인대기",
  approved: "승인완료",
  rejected: "반려",
}

export const VENDORS: Vendor[] = [
  {
    id: "V-20260818-001",
    name: "다온인테리어",
    bizNo: "214-88-01234",
    contact: "010-2345-6789",
    managerName: "김다온",
    appliedAt: "2026-08-18 09:12",
    status: "pending",
    ceo: "김다온",
    bizType: "건설업 / 실내건축공사업",
    address: "서울특별시 마포구 월드컵북로 120, 3층",
    email: "contact@daon-interior.co.kr",
    intro:
      "주거·상업 공간 리모델링 전문 업체입니다. 15년간 2,000여 건의 시공 경험을 보유하고 있으며, 친환경 자재 사용을 원칙으로 합니다.",
    logoLabel: "daon_logo.png",
  },
  {
    id: "V-20260818-002",
    name: "스튜디오 여백",
    bizNo: "119-86-45678",
    contact: "010-8765-4321",
    managerName: "이여백",
    appliedAt: "2026-08-18 11:47",
    status: "pending",
    ceo: "이여백",
    bizType: "서비스업 / 인테리어 디자인",
    address: "경기도 성남시 분당구 판교역로 231, 5층",
    email: "hello@yeobaek.studio",
    intro:
      "미니멀 디자인 기반의 공간 컨설팅 스튜디오입니다. 소형 주거공간 최적화 설계에 강점이 있습니다.",
    logoLabel: "yeobaek_ci.svg",
  },
  {
    id: "V-20260817-014",
    name: "한빛종합건설",
    bizNo: "220-81-99887",
    contact: "02-555-0110",
    managerName: "박한빛",
    appliedAt: "2026-08-17 15:30",
    status: "pending",
    ceo: "박한빛",
    bizType: "건설업 / 종합건설",
    address: "부산광역시 해운대구 센텀중앙로 90, 12층",
    email: "biz@hanbit-const.com",
    intro:
      "대형 상업시설 및 오피스 인테리어 시공 전문. 자체 시공팀 40명 보유, 전국 시공 가능.",
    logoLabel: "hanbit_logo.jpg",
  },
  {
    id: "V-20260816-008",
    name: "오브제디자인",
    bizNo: "312-25-33445",
    contact: "010-1122-3344",
    managerName: "최오브",
    appliedAt: "2026-08-16 10:05",
    status: "approved",
    ceo: "최오브제",
    bizType: "서비스업 / 인테리어 디자인",
    address: "서울특별시 강남구 논현로 145길 22",
    email: "studio@objet.design",
    intro: "가구·조명 커스텀 제작을 포함한 토탈 인테리어 솔루션 제공.",
    logoLabel: "objet_mark.png",
    processedAt: "2026-08-16 14:20",
    processedBy: "admin@platform.co",
  },
  {
    id: "V-20260815-003",
    name: "빠른시공",
    bizNo: "101-99-00000",
    contact: "010-0000-0000",
    managerName: "장빠름",
    appliedAt: "2026-08-15 08:41",
    status: "rejected",
    ceo: "장빠름",
    bizType: "건설업 / 실내건축공사업",
    address: "인천광역시 남동구 인주대로 590",
    email: "fast@quickbuild.kr",
    intro: "저가 시공 전문.",
    logoLabel: "(로고 미첨부)",
    processedAt: "2026-08-15 16:12",
    processedBy: "admin@platform.co",
    rejectReason:
      "사업자등록번호 진위 확인 불가 및 제출 서류(면허증) 누락. 서류 보완 후 재신청 요망.",
  },
]
