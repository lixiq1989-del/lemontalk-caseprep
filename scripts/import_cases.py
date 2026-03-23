"""
Parse 84 casebook docx files into structured JSON for case-partner platform.
Output: lib/cases_data.ts
"""
import os
import json
import re
from docx import Document

CASES_DIR = os.path.expanduser("~/Desktop/AI/casebooks/cases/")

# Map filename patterns to types
TYPE_KEYWORDS = {
    "Profitability": ["profit", "margin", "revenue decline", "cost", "利润", "盈利", "turnaround", "attrition", "efficiency", "labor", "wait_time"],
    "Market Entry": ["market entry", "enter", "expansion", "进入", "launch"],
    "Pricing": ["pricing", "price", "定价"],
    "M&A": ["acquisition", "merger", "m&a", "并购", "买"],
    "Market Sizing": ["market size", "sizing", "estimate", "估算", "how many"],
    "Growth Strategy": ["growth", "digital", "增长", "expand", "scale"],
    "Operations": ["operations", "efficiency", "supply chain", "logistics", "warehouse", "turnaround time"],
}

# Map to industries
INDUSTRY_KEYWORDS = {
    "Technology": ["saas", "tech", "software", "cloud", "digital", "ai", "cyber", "smart"],
    "Healthcare": ["pharma", "drug", "hospital", "medical", "health", "mental", "vaccine", "cancer", "dental", "telehealth", "telemedicine", "wearable"],
    "Consumer Goods": ["food", "coffee", "burger", "meat", "milk", "skincare", "pet", "luxury", "retail", "brand", "organic", "plant"],
    "Financial Services": ["bank", "insurance", "fintech", "credit", "payment", "pe ", "private equity"],
    "Transportation": ["airline", "aviation", "ev ", "electric vehicle", "scooter", "rideshare", "logistics"],
    "Energy": ["renewable", "energy", "battery", "solar", "charging"],
    "Real Estate": ["hotel", "coworking", "senior living", "theme park", "gym", "fitness"],
    "Media": ["streaming", "newspaper", "media", "sports"],
    "Education": ["edtech", "tutoring", "university", "enrollment"],
    "Agriculture": ["farming", "vertical farm"],
}

def detect_type(title, prompt):
    text = (title + " " + prompt).lower()
    for t, keywords in TYPE_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return t
    return "Profitability"  # default

def detect_industry(title, prompt):
    text = (title + " " + prompt).lower()
    for ind, keywords in INDUSTRY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return ind
    return "General"

def detect_difficulty(content_len):
    if content_len < 2000:
        return "Easy"
    elif content_len < 4000:
        return "Medium"
    return "Hard"

def parse_case(filepath):
    doc = Document(filepath)
    texts = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

    title = texts[0] if texts else os.path.basename(filepath)

    # Extract sections
    prompt_en = ""
    prompt_cn = ""
    clarifying = []
    framework_lines = []
    exhibit1_lines = []
    exhibit2_lines = []
    qa_lines = []
    recommendation_lines = []
    tips_lines = []
    deep_analysis_lines = []

    section = "intro"
    for i, t in enumerate(texts):
        # Skip separators
        if t.startswith("──") or t == "---":
            continue

        # Detect sections
        if "English" in t and "原文" in t:
            section = "prompt_en"
            continue
        elif "中文翻译" in t:
            section = "prompt_cn"
            continue
        elif "澄清信息" in t or "Clarifying" in t:
            section = "clarifying"
            continue
        elif t == "Framework" or t.startswith("本Case的分析框架"):
            section = "framework"
            continue
        elif "以下是框架的详细文字拆解" in t:
            section = "framework_detail"
            continue
        elif "Exhibit #1" in t:
            section = "exhibit1"
            continue
        elif "Exhibit #2" in t:
            section = "exhibit2"
            continue
        elif t.startswith("Q1:") or t.startswith("Q2:") or t.startswith("Q3:") or "问题 & 回答" in t:
            section = "qa"
        elif "Recommendation" in t and section != "qa":
            section = "recommendation"
            continue
        elif "面试技巧" in t or "得分亮点" in t or "得分技巧" in t:
            section = "tips"
        elif "深度分析" in t or "深度问答" in t:
            section = "deep_analysis"
        elif "分析思路补充" in t:
            section = "analysis_supplement"
        elif t == "总结":
            section = "summary"
            continue
        elif t == "Prompt" or t == "简要信息":
            continue

        # Collect content
        if section == "prompt_en" and not prompt_en:
            prompt_en = t
        elif section == "prompt_cn" and not prompt_cn:
            # Remove trailing separator
            prompt_cn = re.sub(r'\s*─+\s*$', '', t)
        elif section == "clarifying":
            if not t.startswith("面试提示") and not t.startswith("如果面试"):
                clarifying.append(t)
        elif section in ("framework", "framework_detail"):
            framework_lines.append(t)
        elif section == "exhibit1":
            exhibit1_lines.append(t)
        elif section == "exhibit2":
            exhibit2_lines.append(t)
        elif section == "qa":
            qa_lines.append(t)
        elif section == "recommendation":
            recommendation_lines.append(t)
        elif section in ("tips", "summary"):
            tips_lines.append(t)
        elif section in ("deep_analysis", "analysis_supplement"):
            deep_analysis_lines.append(t)

    # Clean up framework - remove duplicate headers
    seen_framework = []
    prev = ""
    for line in framework_lines:
        if line != prev:
            seen_framework.append(line)
        prev = line

    full_content = "\n".join(texts)

    # Detect metadata
    case_type = detect_type(title, prompt_en + " " + prompt_cn)
    industry = detect_industry(title, prompt_en + " " + prompt_cn)
    difficulty = detect_difficulty(len(full_content))

    # Build structured sections
    sections = {}
    if clarifying:
        sections["clarifying"] = "\n".join(clarifying)
    if seen_framework:
        sections["framework"] = "\n".join(seen_framework)
    if exhibit1_lines:
        sections["exhibit1"] = "\n".join(exhibit1_lines)
    if exhibit2_lines:
        sections["exhibit2"] = "\n".join(exhibit2_lines)
    if qa_lines:
        sections["qa"] = "\n".join(qa_lines)
    if recommendation_lines:
        sections["recommendation"] = "\n".join(recommendation_lines)
    if tips_lines:
        sections["tips"] = "\n".join(tips_lines)
    if deep_analysis_lines:
        sections["deep_analysis"] = "\n".join(deep_analysis_lines)

    # Extract tags from type and keywords
    tags = [case_type, industry]
    if "profit" in (title + prompt_en).lower():
        tags.append("profit")
    if "cost" in (title + prompt_en).lower():
        tags.append("cost analysis")

    return {
        "title": title.split("—")[0].split("——")[0].strip() if "—" in title or "——" in title else title,
        "title_cn": title.split("—")[1].strip() if "—" in title else (title.split("——")[1].strip() if "——" in title else ""),
        "type": case_type,
        "difficulty": difficulty,
        "industry": industry,
        "source": "LemonTalk CaseBook 2026",
        "prompt_en": prompt_en,
        "prompt_cn": prompt_cn,
        "sections": sections,
        "tags": list(set(tags)),
    }

# Parse all cases
cases = []
for f in sorted(os.listdir(CASES_DIR)):
    if not f.endswith(".docx"):
        continue
    try:
        case = parse_case(os.path.join(CASES_DIR, f))
        cases.append(case)
    except Exception as e:
        print(f"Error parsing {f}: {e}")

print(f"Parsed {len(cases)} cases")

# Output as TypeScript
ts_output = """// Auto-generated from LemonTalk CaseBook 2026
// 84 structured cases with sections

export interface CaseSection {
  clarifying?: string;
  framework?: string;
  exhibit1?: string;
  exhibit2?: string;
  qa?: string;
  recommendation?: string;
  tips?: string;
  deep_analysis?: string;
}

export interface CaseData {
  title: string;
  title_cn: string;
  type: string;
  difficulty: string;
  industry: string;
  source: string;
  prompt_en: string;
  prompt_cn: string;
  sections: CaseSection;
  tags: string[];
}

export const CASES_DATA: CaseData[] = """

ts_output += json.dumps(cases, ensure_ascii=False, indent=2)
ts_output += ";\n"

output_path = os.path.expanduser("~/case-partner/lib/cases_data.ts")
with open(output_path, "w") as f:
    f.write(ts_output)

print(f"Written to {output_path}")

# Stats
types = {}
industries = {}
for c in cases:
    types[c["type"]] = types.get(c["type"], 0) + 1
    industries[c["industry"]] = industries.get(c["industry"], 0) + 1

print("\nBy type:")
for t, n in sorted(types.items(), key=lambda x: -x[1]):
    print(f"  {t}: {n}")

print("\nBy industry:")
for i, n in sorted(industries.items(), key=lambda x: -x[1]):
    print(f"  {i}: {n}")
