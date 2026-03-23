// In-memory store for Vercel serverless deployment
// Data resets on each cold start - fine for MVP demo

function now() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export interface Student {
  id: number;
  name: string;
  wechat: string;
  avatar: string;
  school: string;
  target_firms: string[];
  case_types: string[];
  availability: string[];
  level: string;
  language: string;
  bio: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface CaseSections {
  clarifying?: string;
  framework?: string;
  exhibit1?: string;
  exhibit2?: string;
  qa?: string;
  recommendation?: string;
  tips?: string;
  deep_analysis?: string;
}

export interface Case {
  id: number;
  title: string;
  title_cn: string;
  type: string;
  difficulty: string;
  industry: string;
  source: string;
  prompt_en: string;
  prompt_cn: string;
  content: string;
  sections: CaseSections;
  tags: string[];
  created_at: string;
}

export interface Post {
  id: number;
  author_id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  pinned: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  likes: number;
  created_at: string;
}

export interface MatchRequest {
  id: number;
  from_id: number;
  to_id: number;
  message: string;
  status: string;
  created_at: string;
}

interface PostLike {
  post_id: number;
  student_id: number;
}

// ========== Store ==========
const store = {
  students: [] as Student[],
  cases: [] as Case[],
  posts: [] as Post[],
  comments: [] as Comment[],
  matchRequests: [] as MatchRequest[],
  postLikes: [] as PostLike[],
  _nextId: {
    students: 1,
    cases: 1,
    posts: 1,
    comments: 1,
    matchRequests: 1,
  },
};

// ========== Seed Data ==========

// Demo student
store.students.push({
  id: 1,
  name: "Demo用户",
  wechat: "demo_user",
  avatar: "",
  school: "示例大学",
  target_firms: [],
  case_types: [],
  availability: [],
  level: "beginner",
  language: "both",
  bio: "",
  active: 1,
  created_at: now(),
  updated_at: now(),
});
store._nextId.students = 2;

// Import 84 real cases from LemonTalk CaseBook 2026
import { CASES_DATA } from "./cases_data";

for (const c of CASES_DATA) {
  store.cases.push({
    id: store._nextId.cases++,
    title: c.title,
    title_cn: c.title_cn,
    type: c.type,
    difficulty: c.difficulty,
    industry: c.industry,
    source: c.source,
    prompt_en: c.prompt_en,
    prompt_cn: c.prompt_cn,
    content: c.sections.framework || "",
    sections: c.sections,
    tags: c.tags,
    created_at: now(),
  });
}

// Seed students (realistic demo data with weekly availability grids)
const SEED_STUDENTS_DATA: Omit<Student, "id" | "created_at" | "updated_at" | "active" | "avatar">[] = [
  {
    name: "Alice Wang",
    wechat: "alice_w2026",
    school: "北京大学光华",
    target_firms: ["MBB", "Big4"],
    case_types: ["Profitability", "Market Entry", "M&A"],
    availability: ["mon_evening", "wed_evening", "fri_evening", "sat_morning", "sat_afternoon", "sun_morning"],
    level: "advanced",
    language: "Both",
    bio: "光华金融本科，已拿到McKinsey superday。练了50+个case，擅长profitability和M&A。希望找高级水平的partner一起冲刺。",
  },
  {
    name: "Kevin Chen",
    wechat: "kevin_c_case",
    school: "清华经管",
    target_firms: ["MBB", "Boutique"],
    case_types: ["Market Sizing", "Profitability", "Growth Strategy"],
    availability: ["tue_evening", "thu_evening", "sat_morning", "sat_afternoon", "sat_evening", "sun_afternoon"],
    level: "intermediate",
    language: "中文",
    bio: "经管大三，目标McKinsey暑期实习。已练30个case，market sizing比较强，想多练profit和growth。",
  },
  {
    name: "Sophie Li",
    wechat: "sophie_consulting",
    school: "LSE",
    target_firms: ["MBB", "Big4"],
    case_types: ["Market Entry", "Pricing", "Growth Strategy"],
    availability: ["mon_morning", "tue_morning", "wed_morning", "thu_morning", "fri_morning", "sun_evening"],
    level: "intermediate",
    language: "English",
    bio: "LSE Management硕士在读，伦敦时间上午比较自由。偏好英文case练习，可以模拟London office风格。",
  },
  {
    name: "张明",
    wechat: "zhangming_biz",
    school: "复旦管院",
    target_firms: ["Big4", "Internal Strategy"],
    case_types: ["Profitability", "Operations", "Market Sizing"],
    availability: ["mon_evening", "tue_evening", "wed_evening", "thu_evening", "sat_morning", "sun_morning", "sun_afternoon"],
    level: "beginner",
    language: "中文",
    bio: "刚开始准备case interview，已经看完了Victor Cheng的书。希望找一个耐心的partner从基础开始练起，每周2-3次。",
  },
  {
    name: "Emily Zhang",
    wechat: "emily_z_mbb",
    school: "INSEAD",
    target_firms: ["MBB"],
    case_types: ["M&A", "Market Entry", "Pricing", "Growth Strategy"],
    availability: ["mon_afternoon", "wed_afternoon", "fri_afternoon", "sat_evening", "sun_morning", "sun_afternoon"],
    level: "advanced",
    language: "Both",
    bio: "INSEAD MBA在读，之前在PE工作3年。Case基础扎实，尤其擅长M&A估值和market entry。寻找同样高强度备战的partner。",
  },
  {
    name: "Ryan Liu",
    wechat: "ryan_case2026",
    school: "上海交大安泰",
    target_firms: ["MBB", "Boutique"],
    case_types: ["Profitability", "Market Sizing", "Pricing"],
    availability: ["wed_evening", "fri_evening", "sat_morning", "sat_afternoon", "sun_morning", "sun_afternoon", "sun_evening"],
    level: "intermediate",
    language: "Both",
    bio: "交大金融本科+辅修数学。计算能力强，想多练qualitative的部分。周末时间很灵活，可以多练几轮。",
  },
];

for (const s of SEED_STUDENTS_DATA) {
  store.students.push({
    id: store._nextId.students++,
    ...s,
    avatar: "",
    active: 1,
    created_at: now(),
    updated_at: now(),
  });
}

// Seed posts
const SEED_POSTS_DATA: { title: string; content: string; category: string; tags: string[] }[] = [
  {
    title: "McKinsey一面面经分享",
    content:
      "上周刚面完McKinsey的第一轮，整体感觉还不错。面试官非常friendly，先是10分钟的fit interview，问了why consulting和一个leadership的例子。然后是一个market sizing的case，关于中国咖啡市场的规模估算。\n\n我的框架是从supply side切入的，先估算了门店数量，再乘以单店日均销量和客单价。面试官在中间challenge了我几个假设，但整体推进比较顺利。\n\n给大家的建议：\n1. Fit interview一定要准备好，故事要有细节\n2. Market sizing不要急，先把结构想清楚\n3. 计算过程要边算边说，让面试官跟上你的思路",
    category: "interview_exp",
    tags: ["McKinsey", "一面", "market sizing"],
  },
  {
    title: "Market Entry类Case怎么起框架？",
    content:
      "最近练Case遇到好几个market entry的题，感觉自己的框架总是不够有针对性。\n\n比如「一个美国零售商想进入中国市场，你怎么分析？」这种题，我一般会用：\n- Market attractiveness（市场规模、增速、竞争格局）\n- Company capability（核心能力、资源）\n- Entry strategy（方式、时间、区域）\n\n但感觉每次都是这三板斧，不够customized。大家有什么好的思路吗？特别是怎么根据具体行业和公司来调整框架？",
    category: "case_discussion",
    tags: ["Market Entry", "框架", "讨论"],
  },
  {
    title: "有没有人一起练MBB的Case？",
    content:
      "本人985商科在读，目标MBB暑期实习。目前已经练了大概20个case，但感觉还是缺少和真人对练的经验。\n\n希望找到：\n- 同样目标MBB的同学\n- 每周能练2-3次\n- 时间比较灵活，晚上或周末都可以\n- 最好是中英文都能练\n\n我可以当interviewer也可以当interviewee，有兴趣的同学可以联系我！",
    category: "help",
    tags: ["MBB", "练习", "找Partner"],
  },
  {
    title: "整理了30个高频Case框架模板",
    content:
      "花了两周时间整理了30个最常见的case类型的框架模板，覆盖了：\n\n1. Profitability（利润下降）- 5个变体\n2. Market Entry（市场进入）- 4个变体\n3. Growth Strategy（增长战略）- 4个变体\n4. Pricing（定价）- 3个变体\n5. M&A（并购）- 3个变体\n6. Market Sizing（市场规模估算）- 5个变体\n7. Operations（运营优化）- 3个变体\n8. New Product（新产品）- 3个变体\n\n每个模板都包含：核心框架、关键问题清单、常见陷阱提醒。\n\n大家如果觉得有用可以点赞收藏，后续我会持续更新！",
    category: "resource",
    tags: ["框架", "模板", "Case合集"],
  },
  {
    title: "大家都投了哪些公司？",
    content:
      "秋招季来了，想问问大家都投了哪些consulting firm？\n\n我目前投了：\n- MBB三家都投了\n- 还投了Roland Berger, LEK, OC&C\n- Strategy&也在考虑中\n\n感觉今年竞争特别激烈，身边很多人都在准备。大家有什么内推资源或者申请tips可以分享一下吗？\n\n另外想问下，Big4的strategy部门值得投吗？比如Deloitte Monitor和PwC Strategy&？",
    category: "general",
    tags: ["秋招", "投递", "讨论"],
  },
];

for (const p of SEED_POSTS_DATA) {
  store.posts.push({
    id: store._nextId.posts++,
    author_id: 1,
    title: p.title,
    content: p.content,
    category: p.category,
    tags: p.tags,
    likes: 0,
    views: 0,
    pinned: 0,
    created_at: now(),
    updated_at: now(),
  });
}

// ========== Helper Functions ==========

export function getStudents(filters?: { level?: string; firm?: string; caseType?: string }) {
  let result = store.students.filter((s) => s.active === 1);
  if (filters?.level) {
    result = result.filter((s) => s.level === filters.level);
  }
  if (filters?.firm) {
    result = result.filter((s) => s.target_firms.includes(filters.firm!));
  }
  if (filters?.caseType) {
    result = result.filter((s) => s.case_types.includes(filters.caseType!));
  }
  return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function addStudent(data: {
  name: string;
  wechat: string;
  school: string;
  target_firms?: string[];
  level?: string;
  case_types?: string[];
  availability?: string[];
  language?: string;
  bio?: string;
}): number {
  // Check unique wechat
  if (store.students.some((s) => s.wechat === data.wechat)) {
    throw new Error("UNIQUE constraint failed: students.wechat");
  }
  const id = store._nextId.students++;
  store.students.push({
    id,
    name: data.name,
    wechat: data.wechat,
    avatar: "",
    school: data.school,
    target_firms: data.target_firms || [],
    case_types: data.case_types || [],
    availability: data.availability || [],
    level: data.level || "beginner",
    language: data.language || "Both",
    bio: data.bio || "",
    active: 1,
    created_at: now(),
    updated_at: now(),
  });
  return id;
}

export function getStudent(id: number) {
  return store.students.find((s) => s.id === id && s.active === 1) || null;
}

export function getCases(filters?: { type?: string; difficulty?: string; industry?: string }) {
  let result = [...store.cases];
  if (filters?.type) result = result.filter((c) => c.type === filters.type);
  if (filters?.difficulty) result = result.filter((c) => c.difficulty === filters.difficulty);
  if (filters?.industry) result = result.filter((c) => c.industry === filters.industry);
  return result.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getCase(id: number) {
  return store.cases.find((c) => c.id === id) || null;
}

export function getPosts(filters?: { category?: string; sort?: string }) {
  let result = [...store.posts];
  if (filters?.category && filters.category !== "all") {
    result = result.filter((p) => p.category === filters.category);
  }

  // Enrich with author info and comment count
  const enriched = result.map((p) => {
    const author = store.students.find((s) => s.id === p.author_id);
    const comment_count = store.comments.filter((c) => c.post_id === p.id).length;
    return {
      ...p,
      author_name: author?.name || "",
      author_avatar: author?.avatar || "",
      comment_count,
    };
  });

  if (filters?.sort === "popular") {
    enriched.sort((a, b) => b.pinned - a.pinned || b.likes - a.likes || b.created_at.localeCompare(a.created_at));
  } else {
    enriched.sort((a, b) => b.pinned - a.pinned || b.created_at.localeCompare(a.created_at));
  }

  return enriched;
}

export function addPost(data: {
  author_id: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
}): number {
  const id = store._nextId.posts++;
  store.posts.push({
    id,
    author_id: data.author_id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [],
    likes: 0,
    views: 0,
    pinned: 0,
    created_at: now(),
    updated_at: now(),
  });
  return id;
}

export function getPost(id: number) {
  const post = store.posts.find((p) => p.id === id);
  if (!post) return null;

  // Increment views
  post.views++;

  const author = store.students.find((s) => s.id === post.author_id);
  const comments = store.comments
    .filter((c) => c.post_id === id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((c) => {
      const commentAuthor = store.students.find((s) => s.id === c.author_id);
      return {
        ...c,
        author_name: commentAuthor?.name || "",
        author_avatar: commentAuthor?.avatar || "",
      };
    });

  return {
    ...post,
    author_name: author?.name || "",
    author_avatar: author?.avatar || "",
    comments,
  };
}

export function addComment(postId: number, authorId: number, content: string) {
  const post = store.posts.find((p) => p.id === postId);
  if (!post) return null;

  const id = store._nextId.comments++;
  const comment: Comment = {
    id,
    post_id: postId,
    author_id: authorId,
    content,
    likes: 0,
    created_at: now(),
  };
  store.comments.push(comment);

  const author = store.students.find((s) => s.id === authorId);
  return {
    ...comment,
    author_name: author?.name || "",
    author_avatar: author?.avatar || "",
  };
}

export function toggleLike(postId: number, studentId: number): { liked: boolean } {
  const post = store.posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");

  const idx = store.postLikes.findIndex(
    (l) => l.post_id === postId && l.student_id === studentId
  );

  if (idx >= 0) {
    store.postLikes.splice(idx, 1);
    post.likes--;
    return { liked: false };
  } else {
    store.postLikes.push({ post_id: postId, student_id: studentId });
    post.likes++;
    return { liked: true };
  }
}

export function addMatchRequest(fromId: number, toId: number, message: string): number {
  // Check unique
  if (store.matchRequests.some((m) => m.from_id === fromId && m.to_id === toId)) {
    throw new Error("UNIQUE constraint failed");
  }
  const id = store._nextId.matchRequests++;
  store.matchRequests.push({
    id,
    from_id: fromId,
    to_id: toId,
    message: message || "",
    status: "pending",
    created_at: now(),
  });
  return id;
}

export function getMatches(studentId: number) {
  return store.matchRequests
    .filter((m) => m.from_id === studentId || m.to_id === studentId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((m) => {
      const fromStudent = store.students.find((s) => s.id === m.from_id);
      const toStudent = store.students.find((s) => s.id === m.to_id);
      return {
        ...m,
        from_name: fromStudent?.name || "",
        to_name: toStudent?.name || "",
      };
    });
}
