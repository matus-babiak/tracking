#!/usr/bin/env python3
"""Extract metrics from HAGARD:HAL PDF reports."""
import glob
import json
import os
import re
import sys

from pypdf import PdfReader

FOLDER = os.path.join(os.path.dirname(__file__), "..", "reportyHH")
SKIP = {"HAGARD_HAL report 5 - kópia.pdf", "HAGARD_HAL report 5 - kópia.pdf"}
MONTHS = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
}


def read_pdf(path):
    return "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)


def parse_num(raw):
    if raw is None:
        return None
    s = re.sub(r"\s+[-−]?\d+[\d.,]*%", "", str(raw).strip())
    s = s.replace("€", "").replace("%", "").strip().replace(" ", "")
    if not s:
        return None
    if s.count(",") == 1 and s.count(".") == 0:
        s = s.replace(",", ".")
    elif s.count(".") > 1 and "," not in s:
        parts = s.split(".")
        s = "".join(parts[:-1]) + "." + parts[-1]
    elif "," in s and "." in s:
        s = s.replace(",", "")
    try:
        return float(s) if "." in s else int(s)
    except ValueError:
        return None


def period(text, fname):
    m = re.search(r"1\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s*-\s*31", text)
    if m:
        return int(m.group(2)), MONTHS[m.group(1)]
    m = re.search(r"Hagard_hal_(\d+)_(\d{4})", fname, re.I)
    if m:
        return int(m.group(2)), int(m.group(1))
    return None, None


def after_label(block, label):
    lines = block.split("\n")
    for i, line in enumerate(lines):
        if line.strip() == label and i + 1 < len(lines):
            return parse_num(lines[i + 1])
    return None


def summary(text):
    def g(pat):
        m = re.search(pat, text)
        return parse_num(m.group(1)) if m else None

    reg = re.search(r"registrovalo\s+([\d\s]+)\s*pou", text)
    return {
        "meta_spend": g(r"Meta Ads sme investovali budget\s*([\d\s.,]+)"),
        "meta_value": g(r"Hodnota objednávok z Meta Ads:\s*([\d\s.,]+)"),
        "google_spend": g(r"Google Ads sme investovali budget\s*([\d\s.,]+)"),
        "google_value": g(r"Hodnota objednávok z Google Ads:\s*([\d\s.,]+)"),
        "registrations": int(reg.group(1).replace(" ", "")) if reg else None,
    }


def meta_overall(text):
    idx = text.find("Facebook Ads - overall")
    if idx < 0:
        return {}
    block = text[max(0, idx - 1500):idx]
    keys = [
        "Clicks", "Reach", "Impressions", "Amount Spent", "CPC", "CTR",
        "Purchase", "Cost per Purchase", "Add to Cart", "Purchase Conversion Value",
        "CPM (Cost per 1,000 Impr.)",
    ]
    return {k: after_label(block, k) for k in keys if after_label(block, k) is not None}


def google_overall(text):
    end = text.find("Predaje GA4")
    if end < 0:
        end = len(text)
    start = text.rfind("Avg. CPC", 0, end)
    if start < 0:
        return {}
    block = text[start:start + 500]
    keys = [
        "Avg. CPC", "Clicks", "CTR", "Impressions", "Conv. rate",
        "Avg. CPM", "Purchase", "Cost per purchase", "Cost",
    ]
    out = {k: after_label(block, k) for k in keys if after_label(block, k) is not None}
    reg = re.search(r"Registration\n(\d+)", block)
    if reg:
        out["Registration"] = int(reg.group(1))
    return out


def boosting(text):
    idx = text.find("Facebook Ads - boosting\n")
    if idx < 0:
        return None
    block = text[max(0, idx - 500):idx + 800]
    sub = text[idx:idx + 1500]
    vm = re.search(r"Purchase Conversion Value\n([\d\s.,]+)", sub)
    pm = re.search(r"Purchase\n(\d+)", sub)
    out = {
        "spend": after_label(block, "Amount Spent"),
        "interactions": after_label(block, "Post Engagement"),
        "purchases": parse_num(pm.group(1)) if pm else None,
        "value": parse_num(vm.group(1)) if vm else None,
    }
    return out if out.get("spend") else None


def traffic_campaigns(text):
    start = text.find("Facebook Ads - traffic")
    if start < 0:
        return []
    chunk = text[start:start + 2500]
    hdr = chunk.find("Campaign Name Impressions Reach Clicks")
    if hdr < 0:
        return []
    body = chunk[hdr:].split("\n▼")[0]
    camps = []
    for line in body.split("\n"):
        if not line.startswith("Hagard_"):
            continue
        mm = re.match(
            r"(\S+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d.,]+)\s*€\s+([\d.,]+)%\s+([\d.,]+)\s+([\d.,]+)\s*€\s+(\d+)\s+([\d.,]+)",
            line,
        )
        if mm:
            spend = float(mm.group(8).replace(",", "."))
            roas = float(mm.group(10).replace(",", "."))
            camps.append({
                "name": mm.group(1),
                "spend": spend,
                "clicks": int(mm.group(4).replace(",", "")),
                "purchases": int(mm.group(9)),
                "value": round(spend * roas, 2),
                "roas": roas,
            })
    return camps


def reach_campaign(text):
    start = text.find("Facebook Ads - reach")
    if start < 0:
        return None
    chunk = text[start:start + 800]
    mm = re.search(
        r"(Hagard_brand_reach[^\n]+)\s+([\d,]+)\s+([\d,]+)\s+(\d+)\s+([\d.,]+)\s*€",
        chunk,
    )
    if not mm:
        return None
    return {
        "name": mm.group(1).strip(),
        "impressions": int(mm.group(2).replace(",", "")),
        "reach": int(mm.group(3).replace(",", "")),
        "clicks": int(mm.group(4)),
        "spend": float(mm.group(5).replace(",", ".")),
    }


def ga_channels(text):
    out = {"paid": {}, "organic": {}}
    # Common GA4 table labels in Slovak reports
    paid = re.search(
        r"Platená[^\n]*\nRelácie\s+([\d\s,]+)\nPoužívatelia\s+([\d\s,]+)\nMiera interakcie\s+([\d.,]+)%\nPriemerná dĺžka relácie\s+([\d:]+)",
        text,
        re.I,
    )
    org = re.search(
        r"Organická[^\n]*\nRelácie\s+([\d\s,]+)\nPoužívatelia\s+([\d\s,]+)\nMiera interakcie\s+([\d.,]+)%\nPriemerná dĺžka relácie\s+([\d:]+)",
        text,
        re.I,
    )

    def pack(m):
        if not m:
            return {}
        return {
            "sessions": int(m.group(1).replace(" ", "").replace(",", "")),
            "users": int(m.group(2).replace(" ", "").replace(",", "")),
            "engagementRate": float(m.group(3).replace(",", ".")),
            "avgDuration": m.group(4),
        }

    out["paid"] = pack(paid)
    out["organic"] = pack(org)
    return out


def email_metrics(text):
    if not re.search(r"Mailchimp|e-mail marketing|Email marketing", text, re.I):
        return None
    fields = {
        "sent": r"Odoslaných e-mailov\s+([\d\s.,]+)",
        "openRate": r"Open rate\s+([\d.,]+)\s*%",
        "clickRate": r"Click rate\s+([\d.,]+)\s*%",
        "uniqueClicks": r"Unikátnych kliknutí\s+([\d\s.,]+)",
        "unsubRate": r"Unsubscribe rate\s+([\d.,]+)\s*%",
        "orders": r"Počet objednávok\s+([\d\s.,]+)",
        "revenue": r"Tržby\s+([\d\s.,]+)\s*€",
        "campaignsCount": r"Počet kampaní\s+([\d\s.,]+)",
    }
    out = {}
    for key, pat in fields.items():
        m = re.search(pat, text, re.I)
        if m:
            out[key] = parse_num(m.group(1))
    return out if out else None


def eshop_metrics(text):
    out = {}
    for key, pat in {
        "revenue": r"Celkové tržby\s+([\d\s.,]+)\s*€",
        "netRevenue": r"Čisté predaje\s+([\d\s.,]+)\s*€",
        "items": r"Predané položky\s+([\d\s.,]+)",
        "orders": r"Počet objednávok\s+([\d\s.,]+)",
    }.items():
        m = re.search(pat, text, re.I)
        if m:
            out[key] = parse_num(m.group(1))
    return out if out else None


def main():
    rows = []
    for path in sorted(glob.glob(os.path.join(FOLDER, "*.pdf"))):
        base = os.path.basename(path)
        if base in SKIP:
            continue
        text = read_pdf(path)
        year, month = period(text, base)
        rows.append({
            "file": base,
            "year": year,
            "month": month,
            "summary": summary(text),
            "meta": meta_overall(text),
            "google": google_overall(text),
            "boosting": boosting(text),
            "traffic_campaigns": traffic_campaigns(text),
            "reach_campaign": reach_campaign(text),
            "ga": ga_channels(text),
            "email": email_metrics(text),
            "eshop": eshop_metrics(text),
        })

    out = os.path.join(FOLDER, "_extracted.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print(f"Wrote {out} ({len(rows)} files)")
    for r in sorted(rows, key=lambda x: (x["year"] or 9999, x["month"] or 99)):
        s = r["summary"]
        print(
            f"{r['year']}-{r['month']:02d} {r['file']}: "
            f"meta {s.get('meta_spend')}→{s.get('meta_value')} | "
            f"google {s.get('google_spend')}→{s.get('google_value')}"
        )


if __name__ == "__main__":
    main()
