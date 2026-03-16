# CasePrep - 咨询面试准备平台

## 定位
学生互用的咨询面试一站式平台：Case Partner匹配 + 题库 + 社区 + AI助手

## 技术栈
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- In-memory store (lib/db.ts)，Vercel兼容，冷启动重置数据
- 端口: 默认3000

## 三大模块
1. `/partner` - Case Partner: 注册/匹配/约时间/开会
2. `/community` - 社区: 面经/讨论/分享/发帖
3. `/ai` - AI区: 模拟面试/Case问答/小抄速查

## 注意
- 所有标签用中文
- API routes 在 /app/api/ 下
- Client components 需要 "use client" 指令
- 暂无真实AI后端，模拟面试用预设回复
