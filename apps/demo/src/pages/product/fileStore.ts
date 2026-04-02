import { SESSION_DATA } from "./sessionsData";

interface FileEntry {
  content: string;
  lastEditedBy: "human" | "agent";
  lastEditedAt: string;
}

type Listener = () => void;

const store = new Map<string, FileEntry>();
const listeners = new Set<Listener>();

function seedFromSessions() {
  for (const [, data] of Object.entries(SESSION_DATA)) {
    for (const op of data.fileOps) {
      if (op.preview && !store.has(op.path)) {
        store.set(op.path, {
          content: op.preview,
          lastEditedBy: "agent",
          lastEditedAt: op.time,
        });
      }
    }
  }
}

const MOCK_FILES: Record<string, string> = {
  "memory/preferences/tech-stack.md": `# Tech Stack Preferences

- **Auth**: OAuth 优先，减少表单
- **Frontend**: React + Tailwind
- **Backend**: NestJS + PostgreSQL
- **Database**: TypeORM, auto-sync dev
- **Deployment**: Vercel (frontend), Railway (backend)`,

  "memory/decisions/2026-02-21-auth-oauth.md": `# Auth Decision: OAuth 优先

**日期**: 2026-02-21
**类型**: 产品架构
**重要度**: 4

## 决策

采用 Google OAuth + 飞书扫码的双通道注册方案。

## 理由

1. 减少注册摩擦（零表单）
2. 竞品调研显示 OAuth 转化率 80%+
3. 飞书扫码覆盖国内企业用户

## Related

- [竞品注册流程对比](../../artifacts/research/竞品注册流程对比.md)
- [注册流程优化 PRD](../../artifacts/prds/注册流程优化.md)`,

  "knowledge/architecture.md": `# nexu Architecture

## Overview

nexu 采用 filesystem-first 架构，所有数据以结构化文件形式存储在分身的大脑中。

## Core Modules

### Chat (NestJS)
- WebSocket 实时通信
- 多渠道统一接入 (Web, Feishu, Slack)

### Memory
- 基于文件系统的持久化记忆
- 自动关联和检索

### Scheduler
- Cron-based automation
- Proactive agent triggers

## Tech Stack
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Tailwind 4
- LLM: litellm proxy → Claude Sonnet`,

  "contacts/王浩-前端.md": `# 王浩

**角色**: 前端工程师
**专长**: React, 飞书 SDK, Tailwind
**状态**: 活跃
**最近交互**: 2026-02-21 — 注册流程优化讨论

## 备注
- 有飞书扫码集成经验
- 负责 OAuth 回调页面开发

## 历史
- 2026-02-21: 参与注册方案技术评审
- 2026-02-18: 完成首页 Landing Page 开发`,
};

function seedMockFiles() {
  for (const [path, content] of Object.entries(MOCK_FILES)) {
    if (!store.has(path)) {
      store.set(path, {
        content,
        lastEditedBy: "agent",
        lastEditedAt: "18:30",
      });
    }
  }
}

seedFromSessions();
seedMockFiles();

function notify() {
  for (const fn of listeners) {
    fn();
  }
}

export function getFile(path: string): FileEntry | undefined {
  return store.get(path);
}

export function saveFile(path: string, content: string, editedBy: "human" | "agent" = "human") {
  store.set(path, {
    content,
    lastEditedBy: editedBy,
    lastEditedAt: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  });
  notify();
}
