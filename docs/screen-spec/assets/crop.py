import sys
from PIL import Image, ImageChops

SLUGS = "scr-auth-001 scr-auth-002 scr-auth-003 scr-auth-004 scr-auth-005 scr-comp-001 scr-comp-002 scr-inq-001 scr-inq-002 scr-quote-001 scr-quote-002 scr-cont-001 scr-proc-001 scr-proc-002 scr-pay-001 scr-pay-002 scr-noti-001 scr-dash-001 scr-dash-002 scr-ext-001".split()

LEFT_CROP = 300   # strip the app's own left nav sidebar
TOP_CROP = 55     # strip the app's own top black header bar
PAD = 16

for slug in SLUGS:
    src = f"raw-{slug}.png"
    im = Image.open(src).convert("RGB")
    w, h = im.size
    im2 = im.crop((LEFT_CROP, TOP_CROP, w, h))
    bg = Image.new("RGB", im2.size, (252, 252, 252))
    diff = ImageChops.difference(im2, bg).convert("L")
    diff = diff.point(lambda p: 255 if p > 12 else 0)
    bbox = diff.getbbox()
    if bbox:
        l, t, r, b = bbox
        l = max(0, l - PAD)
        t = max(0, t - PAD)
        r = min(im2.width, r + PAD)
        b = min(im2.height, b + PAD)
        im2 = im2.crop((l, t, r, b))
    out = f"scr-{slug[4:]}.png" if slug.startswith("scr-") else f"{slug}.png"
    out = f"{slug}.png"
    im2.save(out)
    print(slug, im2.size)
