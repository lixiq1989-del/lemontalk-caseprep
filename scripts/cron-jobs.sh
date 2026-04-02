#!/bin/bash
# Local cron: fetch jobs + intel, push to Supabase
# Runs daily on Mac, no timeout limits
# Add to crontab: 0 10 * * * /Users/simon/case-partner/scripts/cron-jobs.sh >> /tmp/cron-jobs.log 2>&1

cd /Users/simon/case-partner
export NODE_TLS_REJECT_UNAUTHORIZED=0
source .env.local 2>/dev/null

echo "===== $(date) ====="

# 1. Jobs cron (all sources)
echo "[1/3] Fetching jobs..."
node -e "
const DEEPSEEK_KEY = '$DEEPSEEK_API_KEY';
const SUPABASE_URL = '$NEXT_PUBLIC_SUPABASE_URL';
const SUPABASE_KEY = '$SUPABASE_SERVICE_ROLE_KEY';

async function fetchPage(url, timeout=15000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeout);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8' } });
    clearTimeout(t);
    return await r.text();
  } catch { clearTimeout(t); return ''; }
}

async function fetchLinkedIn(kw, loc) {
  const html = await fetchPage('https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=' + encodeURIComponent(kw) + '&location=' + encodeURIComponent(loc) + '&start=0&f_TPR=r604800');
  const urls = [...html.matchAll(/href=\"(https:\\/\\/[a-z]{2}\\.linkedin\\.com\\/jobs\\/view\\/[^\"]+)\"/g)].map(m=>m[1]);
  return urls.length > 0 ? html + '\\n--- VERIFIED URLS ---\\n' + urls.join('\\n') : html;
}

async function parseJobs(content, source, region, instructions='') {
  if (!content || content.length < 100) return [];
  const prompt = 'Extract consulting/finance/strategy jobs. Return JSON array.\\nEach: title, company, location, type(实习/校招/Internship/Graduate/Full-time), deadline(YYYY-MM-DD or empty), link(MUST be real URL starting with http), description(1-2 sentences), tags(array)\\nlink is REQUIRED - skip jobs without a real clickable URL.\\nMax 15. Only JSON array.\\n' + instructions + '\\nSource: ' + source + '\\nContent:\\n' + content.slice(0, 10000);
  try {
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + DEEPSEEK_KEY },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{role:'user',content:prompt}], temperature: 0.1, max_tokens: 3000 })
    });
    const d = await r.json();
    const m = (d.choices?.[0]?.message?.content||'[]').match(/\\[[\\s\\S]*\\]/);
    if (!m) return [];
    return JSON.parse(m[0]).filter(j => j.link && j.link.startsWith('http')).map(j => ({...j, region, source}));
  } catch { return []; }
}

async function googleSearch(q) { return fetchPage('https://www.google.com/search?q=' + encodeURIComponent(q) + '&num=20&tbs=qdr:w'); }
async function sogouWeixin(q) { return fetchPage('https://weixin.sogou.com/weixin?type=2&query=' + encodeURIComponent(q) + '&ie=utf8'); }

async function upsertJobs(jobs) {
  if (!jobs.length) return;
  const rows = jobs.map(j => ({ title:j.title||'', company:j.company||'', location:j.location||'', type:j.type||'Full-time', deadline:j.deadline||'', link:j.link||'', description:j.description||'', tags:j.tags||[], region:j.region||'CN', source:j.source||'', active:true }));
  const r = await fetch(SUPABASE_URL + '/rest/v1/jobs', {
    method: 'POST', headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows)
  });
  console.log('  Upserted', rows.length, 'jobs, status:', r.status);
}

(async () => {
  const allJobs = [];

  // LinkedIn - CN
  for (const [name, kw] of [['MBB','McKinsey BCG Bain'],['Big4','Deloitte PwC EY KPMG consulting'],['IB','investment banking Goldman CICC'],['Internet','strategy analyst ByteDance Tencent Alibaba'],['Consulting','consulting analyst'],['Finance','investment banking analyst'],['Strategy','strategy analyst']]) {
    console.log('  LinkedIn-CN-' + name);
    const html = await fetchLinkedIn(kw, 'China');
    const jobs = await parseJobs(html, 'LinkedIn', 'CN', 'location必须在中国境内。');
    allJobs.push(...jobs);
    await new Promise(r => setTimeout(r, 2000));
  }

  // LinkedIn - UK/US/HK/SG
  for (const [region, loc] of [['UK','United Kingdom'],['US','United States'],['HK','Hong Kong'],['SG','Singapore']]) {
    for (const kw of ['consulting analyst','investment banking analyst','strategy consultant']) {
      console.log('  LinkedIn-' + region + '-' + kw.split(' ')[0]);
      const html = await fetchLinkedIn(kw, loc);
      const jobs = await parseJobs(html, 'LinkedIn', region, 'location必须在' + loc + '。');
      allJobs.push(...jobs);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Bain career page
  console.log('  Bain careers');
  const bainHtml = await fetchPage('https://www.bain.com/careers/find-a-role/');
  const bainJobs = await parseJobs(bainHtml, 'Bain官网', 'CN', 'link必须以bain.com开头。');
  allJobs.push(...bainJobs);

  // EY career page
  console.log('  EY careers');
  const eyHtml = await fetchPage('https://careers.ey.com/ey/search/?q=consulting&locationsearch=china');
  const eyJobs = await parseJobs(eyHtml, 'EY官网', 'CN', 'link必须以careers.ey.com开头。');
  allJobs.push(...eyJobs);

  console.log('Total jobs:', allJobs.length);
  await upsertJobs(allJobs);
})();
" 2>&1

# 2. Intel cron (all regions, no timeout)
echo "[2/3] Fetching intel..."
node -e "
const DEEPSEEK_KEY = '$DEEPSEEK_API_KEY';
const SUPABASE_URL = '$NEXT_PUBLIC_SUPABASE_URL';
const SUPABASE_KEY = '$SUPABASE_SERVICE_ROLE_KEY';

async function fetchPage(url) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 15000);
  try { const r = await fetch(url, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'zh-CN,zh;q=0.9' } }); clearTimeout(t); return await r.text(); } catch { clearTimeout(t); return ''; }
}

async function extractIntel(content, context, region) {
  if (!content || content.length < 100) return [];
  const prompt = '你是招聘情报分析师。从搜索结果中提取咨询/金融/战略相关的招聘情报。\\n\\n严格规则：\\n- 只提取原文中明确写到的信息，绝对不要推测、补充或编造任何内容\\n- content字段必须是原文的忠实摘要，不要添加原文没有的信息\\n- 如果原文只是提到了公司名但没有具体招聘信息，不要提取\\n- 如果不确定某条信息是否真实，降低confidence或直接跳过\\n- raw_snippet必须是原文的直接引用\\n\\n返回JSON数组。每条: type(job_posting/hiring_news/process_update/timeline/interview_exp/referral), company, role, location, region, content(原文忠实摘要), source_url, source_platform(小红书/公众号/脉脉/牛客/LinkedIn/新闻), apply_email(原文中的投递邮箱), apply_link(原文中的申请链接), deadline, confidence(0-100), tags, raw_snippet(原文直接引用20-50字), process_stage, process_date\\n最多15条。只返回JSON。\\n搜索:' + context + '\\n' + content.slice(0,10000);
  try {
    const r = await fetch('https://api.deepseek.com/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+DEEPSEEK_KEY}, body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:prompt}],temperature:0.2,max_tokens:4000}) });
    const d = await r.json();
    const m = (d.choices?.[0]?.message?.content||'[]').match(/\\[[\\s\\S]*\\]/);
    if (!m) return [];
    return JSON.parse(m[0]).filter(s=>s.company&&s.confidence>=40).map(s=>({...s,region}));
  } catch { return []; }
}

async function upsertIntel(signals) {
  if (!signals.length) return;
  const rows = signals.map(s => ({ type:s.type, company:s.company, role:s.role||'', location:s.location||'', region:s.region, content:s.content||'', source_url:s.source_url||'', source_platform:s.source_platform||'', deadline:s.deadline||'', confidence:s.confidence||50, tags:s.tags||[], raw_snippet:s.raw_snippet||'', process_stage:s.process_stage||'', process_date:s.process_date||'' }));
  const r = await fetch(SUPABASE_URL + '/rest/v1/job_intel', { method:'POST', headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'}, body:JSON.stringify(rows) });
  console.log('  Upserted', rows.length, 'intel signals, status:', r.status);

  // Also upsert job_postings with links/emails to jobs table
  const jobRows = signals.filter(s => s.type==='job_posting' && s.confidence>=70 && (s.apply_link||s.apply_email||s.source_url))
    .map(s => { let link = s.apply_link||s.source_url||''; if (s.apply_email && !link) link='mailto:'+s.apply_email; let desc=s.content; if(s.apply_email) desc+='\\n投递邮箱: '+s.apply_email;
      return { title:s.role||'Unknown', company:s.company, location:s.location||'', type:s.tags?.includes('实习')?'实习':'Graduate', deadline:s.deadline||'', link, description:desc, tags:s.tags||[], region:s.region, source:'AI情报:'+s.source_platform, active:true };
    });
  if (jobRows.length) {
    await fetch(SUPABASE_URL+'/rest/v1/jobs', { method:'POST', headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'}, body:JSON.stringify(jobRows) });
    console.log('  Also upserted', jobRows.length, 'job postings from intel');
  }
}

(async () => {
  const queries = [
    // CN
    {name:'CN-MBB', region:'CN', searches:[
      {type:'google',q:'McKinsey BCG Bain 2026 春招 实习 site:xiaohongshu.com OR site:nowcoder.com'},
      {type:'sogou',q:'MBB 咨询 2026 春招'},
      {type:'sogou',q:'麦肯锡 BCG 贝恩 招聘 2026'},
    ]},
    {name:'CN-投行', region:'CN', searches:[
      {type:'google',q:'投行 校招 2026 Goldman CICC site:xiaohongshu.com OR site:nowcoder.com'},
      {type:'sogou',q:'投行 校招 春招 2026'},
    ]},
    {name:'CN-进度', region:'CN', searches:[
      {type:'google',q:'2026 春招 笔试 面试 offer 咨询 投行 site:xiaohongshu.com OR site:nowcoder.com'},
      {type:'sogou',q:'2026 春招 笔试 面试 进度'},
    ]},
    {name:'CN-面经', region:'CN', searches:[
      {type:'google',q:'2026 咨询 case面试 真题 site:xiaohongshu.com OR site:nowcoder.com'},
      {type:'sogou',q:'咨询面试 case 真题 2026'},
    ]},
    {name:'CN-日常实习', region:'CN', searches:[
      {type:'sogou',q:'咨询 日常实习 招聘 投递邮箱 2026'},
      {type:'sogou',q:'投行 日常实习 内推 邮箱 2026'},
      {type:'sogou',q:'互联网 战略 商业分析 实习 招聘 2026'},
    ]},
    // UK
    {name:'UK', region:'UK', searches:[
      {type:'google',q:'consulting graduate 2026 UK McKinsey BCG application deadline'},
      {type:'google',q:'investment banking graduate London 2026 application'},
    ]},
    // US
    {name:'US', region:'US', searches:[
      {type:'google',q:'consulting recruiting 2026 McKinsey BCG Bain hiring'},
    ]},
    // HK
    {name:'HK', region:'HK', searches:[
      {type:'google',q:'Hong Kong consulting finance graduate 2026 hiring'},
    ]},
  ];

  const allSignals = [];
  for (const q of queries) {
    console.log('  Intel:', q.name);
    let combined = '';
    for (const s of q.searches) {
      let content = '';
      if (s.type === 'google') content = await fetchPage('https://www.google.com/search?q=' + encodeURIComponent(s.q) + '&num=15&tbs=qdr:w');
      else if (s.type === 'sogou') content = await fetchPage('https://weixin.sogou.com/weixin?type=2&query=' + encodeURIComponent(s.q) + '&ie=utf8');
      combined += '\\n--- ' + s.type + ': ' + s.q + ' ---\\n' + content.slice(0,5000) + '\\n';
      await new Promise(r => setTimeout(r, 1500));
    }
    const signals = await extractIntel(combined, q.name, q.region);
    allSignals.push(...signals);
    await new Promise(r => setTimeout(r, 2000));
  }

  // Deduplicate
  const seen = new Set();
  const unique = allSignals.filter(s => { const k=(s.company+'|'+s.role+'|'+s.region).toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true; });
  unique.sort((a,b) => b.confidence - a.confidence);
  console.log('Total intel signals:', unique.length);
  await upsertIntel(unique);
})();
" 2>&1

echo "[3/3] Done!"
echo "===== Finished $(date) ====="
