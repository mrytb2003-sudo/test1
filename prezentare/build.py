#!/usr/bin/env python3
"""Construiește index.html autonom: încorporează fonturile (woff2, base64) și GSAP în src/deck.html."""
import base64
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
V = ROOT / "vendor"

LATIN = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,"
         "U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD")
LATIN_EXT = ("U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,"
             "U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF")


def face(family, file, rng, extra):
    data = base64.b64encode((V / file).read_bytes()).decode()
    return (f"@font-face{{font-family:'{family}';font-style:normal;font-display:block;{extra}"
            f"src:url(data:font/woff2;base64,{data}) format('woff2');unicode-range:{rng};}}\n")


fonts = "".join([
    face("Archivo", "archivo-latin-ext-wdth-normal.woff2", LATIN_EXT, "font-weight:100 900;font-stretch:62% 125%;"),
    face("Archivo", "archivo-latin-wdth-normal.woff2", LATIN, "font-weight:100 900;font-stretch:62% 125%;"),
    face("Inter", "inter-latin-ext-wght-normal.woff2", LATIN_EXT, "font-weight:100 900;"),
    face("Inter", "inter-latin-wght-normal.woff2", LATIN, "font-weight:100 900;"),
])
gsap = (V / "gsap.min.js").read_text(encoding="utf-8")
assert "</script" not in gsap.lower()

src = (ROOT / "src" / "deck.html").read_text(encoding="utf-8")
out = src.replace("/*@FONTS@*/", fonts).replace("/*@GSAP@*/", gsap)
assert "/*@" not in out
(ROOT / "index.html").write_text(out, encoding="utf-8")
print(f"index.html: {len(out.encode()) / 1024:.0f} KB")
