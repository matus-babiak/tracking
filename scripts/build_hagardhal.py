#!/usr/bin/env python3
"""Build src/data/hagardhal.js from reportyHH PDFs."""
import json
import os
import re

from pypdf import PdfReader

ROOT = os.path.join(os.path.dirname(__file__), "..")
PDF_DIR = os.path.join(ROOT, "reportyHH")
OUT = os.path.join(ROOT, "src", "data", "hagardhal.js")

FILE_MAP = {
    "Hagard_hal_1_2025.pdf": (2025, 1),
    "Hagard_hal_2_2025-1.pdf": (2025, 2),
    "Hagard_hal_3_2025.pdf": (2025, 3),
    "Hagard_hal_4_2025.pdf": (2025, 4),
    "HAGARD_HAL report 5.pdf": (2025, 5),
    "HAGARD_HAL report 6.pdf": (2025, 6),
    "HAGARD_HAL report 7.pdf": (2025, 7),
    "HAGARD_HAL report 8.pdf": (2025, 8),
    "HAGARD_HAL report 9.pdf": (2025, 9),
    "HAGARD_HAL report 10.pdf": (2025, 10),
    "HAGARD_HAL report 11.pdf": (2025, 11),
    "HAGARD_HAL report 12.pdf": (2025, 12),
    "HAGARD_HAL report 1.pdf": (2026, 1),
    "HAGARD_HAL report 2.pdf": (2026, 2),
    "HAGARD_HAL report 3.pdf": (2026, 3),
    "HAGARD_HAL report 4.pdf": (2026, 4),
}


def read_pdf(name):
    path = os.path.join(PDF_DIR, name)
    return "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)


def parse_num(raw):
    if raw is None:
        return None
    s = re.sub(r"\s+[-−]?\d+[\d.,]*%", "", str(raw).strip())
    s = s.replace("€", "").replace("%", "").strip().replace(" ", "")
    if not s:
        return None
    if re.match(r"^\d{1,3}(\.\d{3})+(,\d+)?$", s):
        s = s.replace(".", "").replace(",", ".")
    elif re.match(r"^\d{1,3}(,\d{3})+(\.\d+)?$", s):
        s = s.replace(",", "")
    elif "," in s and "." not in s:
        parts = s.split(",")
        s = ".".join(parts) if len(parts[-1]) <= 2 else s.replace(",", "")
    elif s.count(".") > 1:
        parts = s.split(".")
        s = "".join(parts[:-1]) + "." + parts[-1]
    try:
        return float(s) if "." in s else int(s)
    except ValueError:
        return None


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
    out = {
        "meta_spend": g(r"Meta Ads sme investovali budget\s*([\d\s.,]+)"),
        "meta_value": g(r"Hodnota objednávok z Meta Ads:\s*([\d\s.,]+)"),
        "google_spend": g(r"Google Ads sme investovali budget\s*([\d\s.,]+)"),
        "google_value": g(r"Hodnota objednávok z Google Ads:\s*([\d\s.,]+)"),
        "registrations": int(reg.group(1).replace(" ", "")) if reg else None,
    }
    if out["meta_value"] is None:
        m = re.search(
            r"Meta priniesli dokopy\s+(\d+)\s+objednávok s celkovou hodnotou\s+([\d\s]+)\s*€",
            text,
            re.I,
        )
        if m:
            out["meta_purchases"] = int(m.group(1))
            out["meta_value"] = parse_num(m.group(2))
    if out["google_value"] is None:
        for pat in [
            r"Google je na úrovni\s+([\d\s]+)\s*€",
            r"hodnotu nákupov \(([\d\s.,]+)\s*€\)",
            r"google sa urovnala na pribli ž ne\s+([\d\s]+)\s*€",
        ]:
            m = re.search(pat, text, re.I)
            if m:
                out["google_value"] = parse_num(m.group(1))
                break
        if re.search(r"google stúpla na takmer pol milióna", text, re.I):
            out["google_value"] = 500000
    return out


def meta_overall(text):
    idx = text.find("Facebook Ads - overall")
    if idx < 0:
        return {}
    block = text[idx:idx + 1500]
    keys = [
        "Clicks", "Reach", "Impressions", "Amount Spent", "CPC", "CTR",
        "Purchase", "Cost per Purchase", "Add to Cart", "Purchase Conversion Value",
        "CPM (Cost per 1,000 Impr.)",
    ]
    return {k: after_label(block, k) for k in keys if after_label(block, k) is not None}


def google_prehlad(text):
    end = text.find("Predaje GA4")
    if end < 0:
        end = len(text)
    best = {}
    for m in re.finditer(r"Avg\. CPC", text[:end]):
        block = text[m.start():m.start() + 600]
        cost = after_label(block, "Cost")
        if cost and (not best or cost > best.get("Cost", 0)):
            best = {
                "Avg. CPC": after_label(block, "Avg. CPC"),
                "Clicks": after_label(block, "Clicks"),
                "CTR": after_label(block, "CTR"),
                "Impressions": after_label(block, "Impressions"),
                "Purchase": after_label(block, "Purchase"),
                "Cost": cost,
                "Conv. value": after_label(block, "Conv. value"),
                "Registration": after_label(block, "Registration"),
            }
    return {k: v for k, v in best.items() if v is not None}


def ga_channels(text):
    start = text.find("Google Analytics")
    if start < 0:
        return {"paid": {}, "organic": {}}
    # Súhrnné Sessions bloky sú v reportoch HH pred aj za nadpisom Google Analytics
    chunk = text[max(0, start - 4000):start + 4000]
    pattern = (
        r"Sessions\n([\d,]+)\n\s*[-−]?[\d.,]+%\n"
        r"Total users\n([\d,]+)\n\s*[-−]?[\d.,]+%\n"
        r"Engagement rate\n([\d.,]+)%?\n\s*[-−]?[\d.,]+%\n"
        r"Avg\. Engagement time\n([\d:]+)"
    )
    blocks = list(re.finditer(pattern, chunk, re.S))
    organic, paid = {}, {}
    if blocks:
        m = blocks[0]
        organic = {
            "sessions": int(m.group(1).replace(",", "")),
            "users": int(m.group(2).replace(",", "")),
            "engagementRate": float(m.group(3).replace(",", ".")),
            "avgDuration": m.group(4),
        }
    if len(blocks) > 1:
        m = blocks[1]
        paid = {
            "sessions": int(m.group(1).replace(",", "")),
            "users": int(m.group(2).replace(",", "")),
            "engagementRate": float(m.group(3).replace(",", ".")),
            "avgDuration": m.group(4),
        }
    return {"organic": organic, "paid": paid}


def eshop(text):
    start = text.find("Google Analytics")
    if start < 0:
        return {}
    chunk = text[start:start + 3000]
    ip = re.search(r"Items purchased\n([\d,]+)", chunk)
    ir = re.search(r"Item revenue\n([\d\s.,]+)\s*€", chunk)
    out = {}
    if ip:
        out["items"] = int(ip.group(1).replace(",", ""))
    if ir:
        out["revenue"] = parse_num(ir.group(1))
    return out


def traffic_campaigns(text):
    start = text.find("Facebook Ads - traffic")
    if start < 0:
        return []
    chunk = text[start:start + 3000]
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


def google_campaigns(text):
    camps = []
    seen = set()
    for line in text.split("\n"):
        if not line.startswith("SK-"):
            continue
        mm = re.match(
            r"(SK-[^\n]+?)\s+([\d,]+)\s+([\d,]+)\s+([\d.,]+)\s*€\s+([\d.,]+)%\s+([\d.,]+)\s+([\d.,]+)\s*€\s+([\d.,]+)\s*€\s+([\d.,]+)",
            line,
        )
        if not mm:
            continue
        name = mm.group(1).strip()
        if name in seen:
            continue
        seen.add(name)
        camps.append({
            "name": name,
            "impressions": int(mm.group(2).replace(",", "")),
            "clicks": int(mm.group(3).replace(",", "")),
            "spend": parse_num(mm.group(7)),
            "purchases": parse_num(mm.group(6)),
            "value": parse_num(mm.group(9)),
        })
    return camps[:10]


def build_month(year, month, text):
    s = summary(text)
    meta = meta_overall(text)
    google = google_prehlad(text)
    ga = ga_channels(text)
    es = eshop(text)

    spend = s.get("meta_spend") or meta.get("Amount Spent")
    value = s.get("meta_value") or meta.get("Purchase Conversion Value")
    purchases = meta.get("Purchase") or s.get("meta_purchases")
    roas = round(value / spend, 2) if spend and value else None

    g_spend = s.get("google_spend") or google.get("Cost")
    g_value = s.get("google_value") or google.get("Conv. value")
    g_purchases = google.get("Purchase")

    month_obj = {"year": year, "month": month}

    if spend or meta:
        month_obj["meta"] = {
            "spend": spend,
            "impressions": meta.get("Impressions"),
            "reach": meta.get("Reach"),
            "clicks": meta.get("Clicks"),
            "purchases": purchases,
            "purchaseValue": value,
            "roas": roas,
            "addToCart": meta.get("Add to Cart"),
            "cpc": meta.get("CPC"),
            "costPerPurchase": meta.get("Cost per Purchase"),
            "campaigns": traffic_campaigns(text) or None,
        }
        if month_obj["meta"]["campaigns"] is None:
            del month_obj["meta"]["campaigns"]

    if g_spend or g_value:
        g_camps = google_campaigns(text)
        month_obj["google"] = {
            "spend": g_spend,
            "impressions": google.get("Impressions"),
            "clicks": google.get("Clicks"),
            "cpc": google.get("Avg. CPC"),
            "ctr": google.get("CTR"),
            "purchases": int(g_purchases) if g_purchases else None,
            "purchaseValue": g_value,
            "conversions": g_purchases,
            "campaigns": g_camps or None,
        }
        if month_obj["google"]["campaigns"] is None:
            del month_obj["google"]["campaigns"]

    has_ga_traffic = bool(ga.get("paid") or ga.get("organic"))
    if has_ga_traffic:
        month_obj["ga"] = ga
    elif es:
        month_obj["ga"] = {"paid": {}, "organic": {}}

    if es:
        month_obj["eshop"] = es

    return month_obj


def js_val(v):
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, float):
        return repr(round(v, 2)) if abs(v) < 1e10 else repr(v)
    return str(v)


def js_obj(obj, indent=2):
    sp = " " * indent
    if isinstance(obj, list):
        if not obj:
            return "[]"
        lines = ["["]
        for item in obj:
            lines.append(f"{sp}{js_obj(item, indent + 2)},")
        lines.append(" " * (indent - 2) + "]")
        return "\n".join(lines)
    if isinstance(obj, dict):
        if not obj:
            return "{}"
        lines = ["{"]
        for k, v in obj.items():
            if v is None:
                continue
            lines.append(f"{sp}{k}: {js_obj(v, indent + 2)},")
        lines.append(" " * (indent - 2) + "}")
        return "\n".join(lines)
    return js_val(obj)


def main():
    months = []
    for fname, (year, month) in sorted(FILE_MAP.items(), key=lambda x: (x[1][0], x[1][1])):
        months.append(build_month(year, month, read_pdf(fname)))

    notes = [
        "Dáta z mesačných reportov HAGARD:HAL (1/2025 – 4/2026). E-mail marketing v reportoch nie je.",
        "Tržby e-shopu = Item revenue z GA4 (súčet riadkov produktov, B2B katalóg — nie je to rovnaké ako celkový obrat objednávok).",
        "Február 2025: Meta kampane väčšinu mesiaca nebežali kvôli problému s platobnou kartou.",
        "Marec 2025: hodnota objednávok z Google obsahuje anomáliu (objednávka ~200 tis. € 26. 3.).",
        "Meta spend v reporte je celkový (traffic + reach + boosting); boosting nie je účtovaný zvlášť, aby sa neduplikoval.",
    ]

    content = f"""// Klient: HAGARD:HAL — dáta z mesačných reportov 1/2025 – 4/2026.
// Vygenerované zo súborov v reportyHH/

const hagardhal = {{
  id: 'hagard-hal',
  name: 'HAGARD:HAL',
  currency: '€',
  notes: {js_obj(notes, 4)},
  months: {js_obj(months, 4)},
}}

export default hagardhal
"""

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {OUT} ({len(months)} months)")


if __name__ == "__main__":
    main()
