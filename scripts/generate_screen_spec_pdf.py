from pathlib import Path
from datetime import date

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/pdf/interior-platform-screen-spec-v1.1.pdf"
SHOTS = Path("/tmp/interior-platform-screens")
FONT = "/System/Library/Fonts/Supplemental/AppleGothic.ttf"
PAGE_W, PAGE_H = landscape(A4)
M = 15 * mm

pdfmetrics.registerFont(TTFont("Korean", FONT))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="KTitle", fontName="Korean", fontSize=26, leading=34, textColor=colors.HexColor("#111111")))
styles.add(ParagraphStyle(name="H1K", fontName="Korean", fontSize=17, leading=22, textColor=colors.HexColor("#111111")))
styles.add(ParagraphStyle(name="H2K", fontName="Korean", fontSize=10, leading=14, textColor=colors.HexColor("#111111")))
styles.add(ParagraphStyle(name="BodyK", fontName="Korean", fontSize=8.2, leading=11.5, textColor=colors.HexColor("#222222")))
styles.add(ParagraphStyle(name="SmallK", fontName="Korean", fontSize=7.2, leading=9.2, textColor=colors.HexColor("#303030")))
styles.add(ParagraphStyle(name="TinyK", fontName="Korean", fontSize=6.3, leading=7.7, textColor=colors.HexColor("#303030")))
styles.add(ParagraphStyle(name="CenterK", parent=styles["BodyK"], alignment=TA_CENTER))


SCREENS = [
    ("SCR-AUTH-001", "scr-auth-001", "업체 관리자 회원가입", "REQ-AUTH-001", "비로그인", "메인 > 회원가입 > 업체", "사업자 정보와 이메일 인증을 받아 가입 신청을 생성하고 승인 대기 상태로 전환한다.", "사업자등록번호 형식 오류, 이메일 중복, 필수 약관 미동의, 인증 만료 시 필드 하단 오류와 재인증 동작을 제공한다."),
    ("SCR-AUTH-002", "scr-auth-002", "고객 회원가입", "REQ-AUTH-001", "비로그인", "메인 > 회원가입 > 고객", "이메일 또는 휴대폰 인증과 필수 약관 동의 후 고객 계정을 즉시 활성화한다.", "인증번호 불일치 또는 만료, 중복 이메일, 미동의 필수 약관은 가입 버튼을 비활성화하고 원인별 안내를 표시한다."),
    ("SCR-AUTH-003", "scr-auth-003", "로그인 / 로그아웃", "REQ-AUTH-002", "전체 사용자", "메인 > 로그인", "이메일과 비밀번호를 검증한 후 JWT 기반 세션을 발급하고 역할별 기본 화면으로 이동한다.", "자격 증명 불일치, 잠금 계정, 네트워크 실패는 비밀번호 노출 없이 오류 메시지를 표시한다. 로그아웃은 토큰 폐기 후 로그인 화면으로 이동한다."),
    ("SCR-AUTH-004", "scr-auth-004", "비밀번호 재설정 / 변경", "REQ-AUTH-003", "전체 사용자", "메인 > 로그인 > 비밀번호 찾기 / 마이페이지 > 비밀번호 변경", "비로그인 사용자는 이메일로 재설정 링크를 받고, 로그인 사용자는 현재 비밀번호를 확인 후 신규 비밀번호를 저장한다.", "재설정 링크는 30분 후 만료된다. 만료 링크, 현재 비밀번호 불일치, 신규 비밀번호 규칙 미충족은 저장을 차단한다."),
    ("SCR-AUTH-005", "scr-auth-005", "역할기반 접근권한(RBAC) 관리", "REQ-AUTH-004", "플랫폼 관리자", "메인 > 시스템관리 > 권한관리", "역할별 메뉴 및 API 접근 범위를 조회하고 허용 상태를 관리한다.", "플랫폼 관리자 기본 권한은 보호한다. 권한 저장 실패는 변경 전 상태로 복원하며, 서버는 JWT 클레임을 다시 검증해야 한다."),
    ("SCR-COMP-001", "scr-comp-001", "업체 등록 및 승인 관리", "REQ-COMP-001", "플랫폼 관리자", "메인 > 업체관리 > 승인관리", "승인 대기 업체 목록을 검토하고 승인 또는 반려 처리한다.", "반려 처리에는 사유 입력이 필수이며 이력으로 보관한다. 이미 처리된 요청은 중복 승인 또는 반려를 막는다."),
    ("SCR-COMP-002", "scr-comp-002", "소속 직원(현장담당자) 관리", "REQ-COMP-002", "업체 관리자", "메인 > 업체관리 > 직원관리", "직원 이메일 초대를 발송하고 프로젝트별 현장 담당자를 배정한다.", "이메일 형식 오류, 이미 초대된 직원, 배정 대상 미선택은 저장을 제한하고 안내한다."),
    ("SCR-INQ-001", "scr-inq-001", "시공 문의 등록", "REQ-INQ-001", "인테리어 고객", "메인 > 문의관리", "업체, 공간 정보, 희망 예산과 일정을 입력해 시공 문의를 접수한다.", "필수값 누락과 첨부파일 형식 또는 용량 초과를 검증한다. 등록 실패 시 입력값을 유지하고 재시도하도록 한다."),
    ("SCR-INQ-002", "scr-inq-002", "문의 처리 관리", "REQ-INQ-002", "업체 관리자", "메인 > 문의관리", "문의 목록을 상태별로 조회하고 담당자를 배정하며 견적 작성 흐름으로 연결한다.", "담당자 없이 상담중 전환은 차단한다. 종료된 문의의 변경과 중복 상태 전환은 확인 절차 또는 제한을 적용한다."),
    ("SCR-QUOTE-001", "scr-quote-001", "견적서 작성", "REQ-QUOTE-001", "업체 관리자", "메인 > 견적관리 > 작성", "자재비, 인건비, 부대비용을 항목 단위로 입력하고 합계를 계산해 견적서를 발송한다.", "수량 또는 단가 오류, 빈 견적 항목, 발송 API 실패를 검증한다. 성공 시 문의 상태와 알림을 함께 갱신한다."),
    ("SCR-QUOTE-002", "scr-quote-002", "견적 승인 프로세스", "REQ-QUOTE-002", "고객 / 업체 관리자", "메인 > 견적관리", "고객은 견적을 승인 또는 거절하고, 업체 관리자는 수정 이력을 읽기 전용으로 조회한다.", "거절 시 사유 입력을 요구한다. 이미 결정된 견적의 중복 승인은 막고 계약 생성은 승인 상태에서만 허용한다."),
    ("SCR-CONT-001", "scr-cont-001", "계약서 생성/관리", "REQ-CONT-001", "업체 관리자", "메인 > 계약관리", "승인된 견적을 기반으로 계약서 초안을 생성하고 계약대기, 체결, 완료 상태를 관리한다.", "전자서명은 목업 범위이며 실제 연동 전에는 서명 완료 검증이 필요하다. 계약대기에서 완료로의 건너뛰기 전환은 차단한다."),
    ("SCR-PROC-001", "scr-proc-001", "공정 관리", "REQ-PROC-001", "현장 담당자", "메인 > 시공관리 > 공정관리", "공정 템플릿을 프로젝트에 적용하고 진행률, 완료일, 지연 이슈를 기록한다.", "완료 전환 전 필수 증빙을 확인하고, 지연 사유나 예정일 누락 시 저장을 제한한다."),
    ("SCR-PROC-002", "scr-proc-002", "시공 사진 관리", "REQ-PROC-002", "현장 담당자 / 인테리어 고객", "메인 > 시공관리 > 사진관리", "현장 담당자는 공정 단계별 사진과 메모를 업로드하고 고객은 자신의 프로젝트 사진을 조회한다.", "허용하지 않은 파일 형식, 업로드 용량 초과, 권한 없는 프로젝트 접근은 차단한다."),
    ("SCR-PAY-001", "scr-pay-001", "결제 단계 등록 및 상태 관리", "REQ-PAY-001", "업체 관리자", "메인 > 결제관리", "계약금, 중도금, 잔금 단계를 계약에 연결하고 입금 확인으로 상태를 완료로 전환한다.", "PG 자동 연동 전에는 수동 확인만 허용한다. 완료된 결제의 되돌리기와 금액 또는 기한 누락은 제한한다."),
    ("SCR-PAY-002", "scr-pay-002", "결제 이력 조회", "REQ-PAY-002", "인테리어 고객 / 업체 관리자", "메인 > 결제관리", "프로젝트별 결제 단계, 금액, 상태, 완료일을 읽기 전용으로 조회한다.", "결제 정보가 없는 경우 빈 상태를 보여주며, 접근 역할과 프로젝트 소유권을 서버에서 재검증한다."),
    ("SCR-NOTI-001", "scr-noti-001", "알림 발송 관리", "REQ-NOTI-001", "플랫폼 관리자 / 업체 관리자", "메인 > 알림관리", "견적, 계약, 공정, 결제 이벤트의 알림 발송 이력을 필터링하고 실패 건을 재발송한다.", "외부 API 실패, 수신 거부, 잘못된 연락처는 실패 사유를 기록한다. 재발송은 중복 전송 방지 규칙을 적용한다."),
    ("SCR-DASH-001", "scr-dash-001", "업체 대시보드", "REQ-DASH-001", "업체 관리자", "메인 > 대시보드", "진행 프로젝트, 신규 문의, 견적, 결제 현황과 공정 단계 분포를 요약한다.", "데이터가 없으면 문의관리 이동을 제안한다. 필터 결과가 없을 때는 빈 목록과 필터 해제 동작을 제공한다."),
    ("SCR-DASH-002", "scr-dash-002", "고객 마이페이지", "REQ-DASH-002", "인테리어 고객", "메인 > 마이페이지", "본인 프로젝트의 견적, 계약, 공정, 결제, 사진 정보를 탭으로 통합 조회한다.", "프로젝트 또는 결제 정보가 없는 경우 빈 상태를 보여준다. 탭 상태는 유지하고 타인 프로젝트 접근은 차단한다."),
    ("SCR-EXT-001", "scr-ext-001", "문의 자동 분류 보조", "REQ-EXT-001", "업체 관리자", "메인 > 문의관리 > 자동분류 결과", "키워드와 통계 규칙으로 공간 유형과 예산대를 보조 분류하고 담당자가 수동 정정한다.", "AI/LLM 판단이 아닌 참고 결과임을 표시한다. 낮은 확신도와 미분류는 담당자 확인을 요구한다."),
]


def p(text, style="BodyK"):
    return Paragraph(text, styles[style])


def header(c, section, page):
    c.setStrokeColor(colors.HexColor("#161616"))
    c.setLineWidth(0.5)
    c.line(M, PAGE_H - 12 * mm, PAGE_W - M, PAGE_H - 12 * mm)
    c.setFont("Korean", 7.5)
    c.setFillColor(colors.HexColor("#444444"))
    c.drawString(M, PAGE_H - 8 * mm, "인테리어 견적·시공관리 플랫폼 | 화면 설계서 v1.1")
    c.drawRightString(PAGE_W - M, PAGE_H - 8 * mm, section)
    c.setFillColor(colors.HexColor("#666666"))
    c.drawRightString(PAGE_W - M, 8 * mm, str(page))


def table(c, data, x, y_top, col_widths, font=7.2, row_height=19):
    rows = []
    for row in data:
        rows.append([cell if isinstance(cell, Paragraph) else p(str(cell), "SmallK") for cell in row])
    t = Table(rows, colWidths=col_widths, rowHeights=[row_height] * len(rows))
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Korean"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#8A8A8A")),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E6E6E6")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    w, h = t.wrapOn(c, 0, 0)
    t.drawOn(c, x, y_top - h)
    return y_top - h


def cover(c):
    c.setFillColor(colors.HexColor("#151515"))
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setStrokeColor(colors.white)
    c.setLineWidth(1)
    c.rect(M, M, PAGE_W - 2 * M, PAGE_H - 2 * M, fill=0, stroke=1)
    c.setFillColor(colors.white)
    c.setFont("Korean", 11)
    c.drawString(28 * mm, PAGE_H - 42 * mm, "SCREEN DESIGN SPECIFICATION")
    c.setFont("Korean", 29)
    c.drawString(28 * mm, PAGE_H - 64 * mm, "인테리어 견적·시공관리 플랫폼")
    c.setFont("Korean", 18)
    c.drawString(28 * mm, PAGE_H - 78 * mm, "화면 설계서 / 와이어프레임 명세")
    c.setFont("Korean", 9)
    c.setFillColor(colors.HexColor("#CFCFCF"))
    c.drawString(28 * mm, PAGE_H - 100 * mm, "요구사항 정의서 v1.1 기반 | 실행 화면 캡처 포함 | 20개 화면")
    c.drawString(28 * mm, PAGE_H - 108 * mm, "작성일 2026-08-18 | 문서 버전 v1.1 | 상태: 화면 설계 검토용")
    c.setFillColor(colors.white)
    c.setFont("Korean", 10)
    c.drawString(28 * mm, 38 * mm, "본 문서는 기능 정의와 UI 동작 조건을 교차 추적하기 위한 화면 설계 산출물입니다.")
    c.drawString(28 * mm, 29 * mm, "캡처 이미지는 현재 실행 중인 와이어프레임의 데스크톱 상태를 기준으로 합니다.")
    c.showPage()


def intro_pages(c):
    page = 2
    header(c, "1. 문서 정보", page)
    c.drawString(M, PAGE_H - 28 * mm, "1. 표지 및 문서 정보")
    table(c, [["항목", "내용"], ["문서명", "인테리어 견적·시공관리 플랫폼 화면 설계서"], ["기준 문서", "요구사항 정의서 v1.1"], ["화면 범위", "SCR-AUTH-001부터 SCR-EXT-001까지 20개 화면"], ["표현 방식", "그레이스케일 와이어프레임, 실행 화면 캡처, UI 디스크립션"], ["추적 기준", "요구사항 ID와 화면 ID를 1:1 또는 다대일로 교차 참조"]], M, PAGE_H - 38 * mm, [42 * mm, 210 * mm], row_height=23)
    c.showPage()

    page += 1
    header(c, "2. 개정 이력", page)
    c.setFont("Korean", 17); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 28 * mm, "2. 개정 이력")
    table(c, [["버전", "개정일", "대상", "변경 내용", "사유"], ["v1.0", "2026-08-18", "전체", "최초 요구사항 및 화면 설계 작성", "초기 서비스 범위 정의"], ["v1.1", "2026-08-18", "REQ-DASH-002", "고객 마이페이지를 SCR-DASH-002로 분리", "업체 대시보드와 고객 화면의 추적성 분리"], ["v1.1", "2026-08-18", "전 화면", "메뉴 명칭과 와이어프레임 표기 통일", "동일 기능의 용어와 위치 일관성 확보"]], M, PAGE_H - 38 * mm, [22 * mm, 30 * mm, 38 * mm, 74 * mm, 88 * mm], row_height=31)
    c.showPage()

    page += 1
    header(c, "3. 서비스 개요 및 정보 구조도", page)
    c.setFont("Korean", 17); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 28 * mm, "3. 서비스 개요 및 정보 구조도")
    c.setFont("Korean", 9); c.drawString(M, PAGE_H - 39 * mm, "고객의 시공 문의부터 업체 견적·계약·시공·결제까지의 업무를 역할별로 연결하고 플랫폼 관리자가 승인·권한·알림을 관리한다.")
    nodes = [("고객", "회원가입\n문의등록\n견적승인\n마이페이지"), ("업체 관리자", "직원관리\n문의처리\n견적·계약·결제"), ("현장 담당자", "공정관리\n사진관리"), ("플랫폼 관리자", "업체승인\n권한관리\n알림관리")]
    x = M
    for label, body in nodes:
        c.setFillColor(colors.HexColor("#F1F1F1")); c.setStrokeColor(colors.HexColor("#333333")); c.rect(x, PAGE_H - 102 * mm, 58 * mm, 45 * mm, fill=1, stroke=1)
        c.setFillColor(colors.HexColor("#111111")); c.setFont("Korean", 10); c.drawCentredString(x + 29 * mm, PAGE_H - 67 * mm, label)
        c.setFont("Korean", 8); yy=PAGE_H-76*mm
        for line in body.split("\n"):
            c.drawCentredString(x + 29 * mm, yy, line); yy -= 6 * mm
        x += 65 * mm
    c.setFont("Korean", 9); c.drawString(M, PAGE_H - 122 * mm, "핵심 해피 패스: 고객 문의 등록 -> 업체 문의 처리·견적 발송 -> 고객 견적 승인 -> 계약 생성 -> 공정·사진 공유 -> 결제 확인")
    c.setFillColor(colors.HexColor("#EFEFEF")); c.rect(M, PAGE_H - 173 * mm, PAGE_W - 2*M, 38 * mm, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#111111")); c.setFont("Korean", 10); c.drawString(M + 6*mm, PAGE_H - 145*mm, "정보 구조")
    c.setFont("Korean", 8.2); c.drawString(M + 6*mm, PAGE_H - 154*mm, "인증/계정관리 | 업체관리 | 문의관리 | 견적관리 | 계약관리 | 시공관리 | 결제관리 | 알림관리 | 대시보드 | 확장검토")
    c.drawString(M + 6*mm, PAGE_H - 163*mm, "공통 메뉴: 대시보드, 문의관리, 견적관리, 계약관리, 시공관리, 결제관리, 알림관리, 업체관리")
    c.showPage()

    page += 1
    header(c, "4. 공통 정책 및 규칙", page)
    c.setFont("Korean", 17); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 28 * mm, "4. 공통 정책 및 규칙")
    policies = [
        ["접근 제어", "역할별 화면·버튼 노출은 UI에서 안내하고, API는 JWT 클레임을 서버에서 최종 검증한다. (REQ-AUTH-004, REQ-NFR-002)"],
        ["입력 검증", "필수 항목, 이메일·사업자번호 형식, 금액·날짜 범위는 제출 전 검증하고 오류를 입력 필드 가까이에 표시한다."],
        ["상태 전이", "문의, 계약, 공정, 결제의 상태 변경은 정의된 순서를 따른다. 완료 또는 확정 상태의 임의 되돌리기는 제한한다."],
        ["개인정보", "연락처와 주소는 최소 표시·마스킹하고, 프로젝트·업체 단위 데이터 격리를 적용한다. (REQ-NFR-003, 007)"],
        ["감사·재현", "견적·계약·공정·결제의 주요 변경은 변경자·시각·내용을 기록한다. (REQ-NFR-004)"],
        ["반응형·가시성", "데스크톱과 모바일 프리뷰를 제공하며, 와이어프레임의 모든 조작 버튼은 뚜렷한 테두리와 포커스를 갖는다. (REQ-NFR-006)"],
    ]
    table(c, [["정책", "적용 규칙"]] + policies, M, PAGE_H - 38 * mm, [42 * mm, 210 * mm], row_height=35)
    c.showPage()
    return page


def screen_page(c, index, item):
    sid, slug, title, req, role, path, happy, edge = item
    header(c, "5. 상세 화면 설계", index)
    c.setFont("Korean", 16); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 27 * mm, f"5.{index - 5:02d} {sid} | {title}")
    y = PAGE_H - 35 * mm
    y = table(c, [["요구사항 ID", "대상 역할", "메뉴 경로"], [req, role, path]], M, y, [40 * mm, 44 * mm, 168 * mm], row_height=22)

    # The executed page capture contains the full app. Crop its content column so the desktop wireframe remains readable.
    shot_path = SHOTS / f"{slug}-full.png"
    img = Image.open(shot_path)
    crop = img.crop((300, 175, min(img.width, 1280), min(img.height, 850)))
    crop_path = ROOT / "tmp/pdfs" / f"{slug}-desktop.png"
    crop.save(crop_path)
    img_w, img_h = crop.size
    left_w, left_h = 158 * mm, 107 * mm
    x_img, y_img = M, 33 * mm
    c.setFillColor(colors.HexColor("#F2F2F2")); c.setStrokeColor(colors.HexColor("#333333")); c.rect(x_img, y_img, left_w, left_h, fill=1, stroke=1)
    scale = min((left_w - 3 * mm) / img_w, (left_h - 3 * mm) / img_h)
    dw, dh = img_w * scale, img_h * scale
    c.drawImage(ImageReader(crop_path), x_img + (left_w - dw) / 2, y_img + (left_h - dh) / 2, dw, dh)
    c.setFont("Korean", 7); c.setFillColor(colors.HexColor("#444444")); c.drawString(x_img, y_img - 5 * mm, "실행 화면 캡처 - 데스크톱 와이어프레임 (번호 표시는 조작 요소 식별용)")

    x_desc = M + left_w + 7 * mm
    desc_w = PAGE_W - M - x_desc
    c.setFillColor(colors.HexColor("#E6E6E6")); c.rect(x_desc, 33 * mm, desc_w, 107 * mm, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#111111")); c.setFont("Korean", 10); c.drawString(x_desc + 4 * mm, 132 * mm, "디스크립션")
    blocks = [
        ("초기 상태", "역할과 화면 ID가 표시되며, 화면 데이터 또는 입력 폼의 기본값이 로드된다."),
        ("해피 패스", happy),
        ("주요 UI 요소", "① 화면 헤더와 현재 역할  ② 핵심 입력·필터·목록  ③ 주요 실행 버튼  ④ 상태·결과 메시지  ⑤ 관련 화면 이동"),
        ("상태·피드백", "로딩 중에는 중복 실행을 막고, 성공은 토스트 또는 상태 영역으로 알린다. 저장된 변경은 화면에 즉시 반영한다."),
        ("예외(Edge Case)", edge),
        ("추적성", f"{req} ↔ {sid}. 상세 기능과 예외 규칙은 요구사항 정의서 v1.1의 해당 기능 행을 기준으로 한다."),
    ]
    yy = 124 * mm
    for heading, content in blocks:
        c.setFont("Korean", 8.1); c.setFillColor(colors.HexColor("#111111")); c.drawString(x_desc + 4 * mm, yy, heading)
        para = p(content, "TinyK")
        w, h = para.wrap(desc_w - 8 * mm, 40 * mm)
        para.drawOn(c, x_desc + 4 * mm, yy - h - 2 * mm)
        yy -= h + 8 * mm
    c.showPage()


def appendix(c, start_page):
    page = start_page
    header(c, "6. 부록 및 예외 케이스", page)
    c.setFont("Korean", 17); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 28 * mm, "6. 부록 및 예외 케이스")
    cases = [
        ["인증", "로그인 실패 5회 이상", "재시도 제한, CAPTCHA 또는 계정 잠금 안내, 상세 실패 사유 비노출"],
        ["권한", "URL 직접 접근 또는 역할 변경", "프론트 안내와 별개로 API에서 JWT·역할·소유권 재검증"],
        ["데이터", "타 업체 또는 타 고객 프로젝트 조회", "company_id·프로젝트 소유권 기준으로 격리하고 권한 없음 응답"],
        ["첨부", "형식·용량 초과 또는 업로드 실패", "파일 제한 사전 안내, 실패 파일 식별, 기존 입력값 유지, 재시도 제공"],
        ["상태", "확정·완료 상태의 중복 변경", "전이 규칙 검증, 확인 다이얼로그, 감사로그 기록"],
        ["외부 연동", "알림·전자서명·PG API 실패", "재시도 가능 여부, 실패 사유, 보류 상태와 운영자 확인 경로를 제공"],
    ]
    table(c, [["영역", "예외 상황", "처리 기준"]] + cases, M, PAGE_H - 39 * mm, [35 * mm, 68 * mm, 149 * mm], row_height=33)
    c.setFont("Korean", 9); c.drawString(M, 38 * mm, "검토 체크: 해피 패스 완주, 필수 입력 검증, 권한 검증, 빈 상태, 네트워크 실패, 중복 실행, 감사로그 기록")
    c.showPage()

    header(c, "부록 - 요구사항 추적성", page + 1)
    c.setFont("Korean", 17); c.setFillColor(colors.HexColor("#111111")); c.drawString(M, PAGE_H - 28 * mm, "부록 A. 요구사항 - 화면 ID 추적성")
    rows = [["요구사항 ID", "화면 ID", "화면명"]] + [[s[3], s[0], s[2]] for s in SCREENS]
    table(c, rows, M, PAGE_H - 39 * mm, [54 * mm, 54 * mm, 144 * mm], row_height=18)
    c.showPage()


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    (ROOT / "tmp/pdfs").mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=landscape(A4), pageCompression=1)
    c.setTitle("인테리어 견적·시공관리 플랫폼 화면 설계서 v1.1")
    c.setAuthor("정예지")
    cover(c)
    last_intro = intro_pages(c)
    page = last_intro + 1
    for item in SCREENS:
        screen_page(c, page, item)
        page += 1
    appendix(c, page)
    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
