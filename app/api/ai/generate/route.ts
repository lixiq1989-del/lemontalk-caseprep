import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是一位拥有10年+经验的求职面试辅导专家，同时具备商业分析师的行业洞察力。
你的受众是正在求职的商科应届生，求职方向覆盖咨询、互联网、金融、大厂非技术岗（商业分析/产品/运营/战略/战投）。

输出要求：
- 全中文，语气专业凝练但有人味，像资深师兄一对一辅导
- 行业/公司知识要降低技术门槛，用通俗语言解释专业概念
- 面试题答案要详细到可以直接用，不能只给"思路框架"——要给完整的答题示例
- STAR故事必须基于简历真实经历，不编造；无简历则给填空模板
- 每道面试题都要标注"面试官真正考察什么"+"出彩的回答会长什么样"
- 公司分析要说清楚：商业模式（怎么赚钱）、核心业务线、当前战略重点、护城河`;

const CHEATSHEET_PROMPT = `根据候选人的简历和目标岗位，生成一份精准的面试准备小抄。

目标岗位：
公司：{company}
岗位：{role}
职位描述：
{jd}

{resume_section}

请严格按以下 JSON 格式返回（只返回 JSON，不要 markdown 代码块，不要其他说明）：

{
  "industry_brief": {
    "what": "这个行业/赛道是什么（1-2句通俗定义，降低技术门槛）",
    "market_size": "市场规模和增速（一句话带数字）",
    "key_players": "头部玩家3-5家及各自定位",
    "trends": "当前2-3个最重要的行业趋势",
    "why_matters": "为什么面试官会考这个行业（和岗位的关系）"
  },
  "company_analysis": {
    "positioning": "公司核心定位一句话（例：中国最大的本地生活服务平台）",
    "business_model": "怎么赚钱（收入来源+成本结构，2-3句话讲清楚）",
    "revenue_structure": "收入结构（各业务线占比，如有）",
    "moat": "护城河是什么（网络效应/规模效应/数据壁垒/品牌等）",
    "core_businesses": [
      {"name": "业务线1", "role": "现金牛/增长引擎/战略卡位", "brief": "一句话说清这个业务干嘛的"},
      {"name": "业务线2", "role": "...", "brief": "..."}
    ],
    "current_strategy": "当前战略重点（最近1年在押注什么方向）",
    "culture_keywords": ["企业文化关键词1", "关键词2", "关键词3"],
    "interview_style": "这家公司的面试风格特点"
  },
  "opening_pitch": "为这个岗位定制的30秒自我介绍，直接可用，口语化，像跟面试官自然聊天。",
  "job_core_requirements": [
    {"req": "核心要求1", "detail": "面试中怎么考察", "weight": "高/中"},
    {"req": "核心要求2", "detail": "...", "weight": "高/中"},
    {"req": "核心要求3", "detail": "...", "weight": "高/中"}
  ],
  "match_points": [
    {"your_bg": "简历中的具体经历", "connects_to": "如何对应岗位需求", "gap": "差距及弥补方案"},
    {"your_bg": "...", "connects_to": "...", "gap": ""},
    {"your_bg": "...", "connects_to": "...", "gap": ""}
  ],
  "key_questions": [
    {
      "q": "预测问题1",
      "type": "Behavioral/Case/Business/Motivational",
      "angle": "面试官真正考察什么",
      "good_answer": "出彩的完整回答示例（150-200字，不是框架而是可以直接说的答案）",
      "scoring_tips": "面试官给高分的关键：什么样的回答会脱颖而出"
    },
    {"q": "预测问题2", "type": "...", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题3（行业/业务相关题）", "type": "Business", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题4（Case/商业分析题）", "type": "Case", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题5", "type": "...", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题6", "type": "...", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题7（公司战略相关）", "type": "Business", "angle": "...", "good_answer": "...", "scoring_tips": "..."},
    {"q": "预测问题8", "type": "...", "angle": "...", "good_answer": "...", "scoring_tips": "..."}
  ],
  "star_stories": [
    {
      "title": "故事标题（来自简历的具体经历）",
      "s": "背景（1句话）",
      "t": "任务/挑战（1句话）",
      "a": "你做了什么（2-3句，重点说行动和决策）",
      "r": "结果（尽量量化）",
      "use_for": ["适合回答的问题类型1", "类型2"]
    },
    {
      "title": "故事标题2",
      "s": "...", "t": "...", "a": "...", "r": "...",
      "use_for": ["..."]
    },
    {
      "title": "故事标题3",
      "s": "...", "t": "...", "a": "...", "r": "...",
      "use_for": ["..."]
    }
  ],
  "questions_to_ask": [
    {"q": "你问面试官的问题", "why": "为什么问这个（展示了什么）", "timing": "适合在哪轮问"},
    {"q": "问题2", "why": "...", "timing": "..."},
    {"q": "问题3", "why": "...", "timing": "..."}
  ],
  "danger_zones": [
    {"zone": "可能的雷区/陷阱", "how_to_handle": "应对策略"}
  ],
  "custom_tips": [
    "针对这个公司/岗位的专属提醒1",
    "提醒2",
    "提醒3"
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { company, role, jd, resumeText } = await req.json();

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!anthropicKey && !deepseekKey) {
      return NextResponse.json({ error: "服务端未配置 API Key" }, { status: 500 });
    }

    const resumeSection = resumeText?.trim()
      ? `候选人简历：\n${resumeText.trim()}`
      : "（未提供简历。STAR 故事部分请给出通用模板框架，标注[请填入你的经历]。其他部分正常生成。）";

    const prompt = CHEATSHEET_PROMPT
      .replace("{company}", company || "未知公司")
      .replace("{role}", role || "未知岗位")
      .replace("{jd}", (jd?.trim() || "（未提供详细JD）").slice(0, 3000))
      .replace("{resume_section}", (resumeSection || "").slice(0, 3000));

    let response: Response;
    if (anthropicKey) {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt + "\n\n只返回JSON，不要markdown代码块。" }],
          max_tokens: 5000,
        }),
      });
    } else {
      response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${deepseekKey}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
          max_tokens: 5000, temperature: 0.7, response_format: { type: "json_object" },
        }),
      });
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI API error: ${response.status} ${err}`);
    }

    const result = await response.json();
    let raw = (result.content?.[0]?.text || result.choices?.[0]?.message?.content || "").trim();

    // Strip markdown code block if present
    if (raw.startsWith("```")) {
      const lines = raw.split("\n");
      raw = lines.slice(1, -1).join("\n");
    }

    // Extract JSON from response - find first { to last }
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      raw = raw.slice(jsonStart, jsonEnd + 1);
    }

    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
