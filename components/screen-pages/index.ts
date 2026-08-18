import type { ComponentType } from "react"

import ScrAuth001 from "@/components/screen-pages/scr-auth-001"
import ScrAuth002 from "@/components/screen-pages/scr-auth-002"
import ScrAuth003 from "@/components/screen-pages/scr-auth-003"
import ScrAuth004 from "@/components/screen-pages/scr-auth-004"
import ScrAuth005 from "@/components/screen-pages/scr-auth-005"
import ScrComp001 from "@/components/screen-pages/scr-comp-001"
import ScrComp002 from "@/components/screen-pages/scr-comp-002"
import ScrInq001 from "@/components/screen-pages/scr-inq-001"
import ScrInq002 from "@/components/screen-pages/scr-inq-002"
import ScrQuote001 from "@/components/screen-pages/scr-quote-001"
import ScrQuote002 from "@/components/screen-pages/scr-quote-002"
import ScrCont001 from "@/components/screen-pages/scr-cont-001"
import ScrProc001 from "@/components/screen-pages/scr-proc-001"
import ScrProc002 from "@/components/screen-pages/scr-proc-002"
import ScrPay001 from "@/components/screen-pages/scr-pay-001"
import ScrPay002 from "@/components/screen-pages/scr-pay-002"
import ScrNoti001 from "@/components/screen-pages/scr-noti-001"
import ScrDash001 from "@/components/screen-pages/scr-dash-001"
import ScrDash002 from "@/components/screen-pages/scr-dash-002"
import ScrExt001 from "@/components/screen-pages/scr-ext-001"

export const SCREEN_COMPONENTS: Record<string, ComponentType> = {
  "scr-auth-001": ScrAuth001,
  "scr-auth-002": ScrAuth002,
  "scr-auth-003": ScrAuth003,
  "scr-auth-004": ScrAuth004,
  "scr-auth-005": ScrAuth005,
  "scr-comp-001": ScrComp001,
  "scr-comp-002": ScrComp002,
  "scr-inq-001": ScrInq001,
  "scr-inq-002": ScrInq002,
  "scr-quote-001": ScrQuote001,
  "scr-quote-002": ScrQuote002,
  "scr-cont-001": ScrCont001,
  "scr-proc-001": ScrProc001,
  "scr-proc-002": ScrProc002,
  "scr-pay-001": ScrPay001,
  "scr-pay-002": ScrPay002,
  "scr-noti-001": ScrNoti001,
  "scr-dash-001": ScrDash001,
  "scr-dash-002": ScrDash002,
  "scr-ext-001": ScrExt001,
}
