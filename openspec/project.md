# Project Context

## Purpose
本项目用于生成 WAC SkipToH5 接口请求的签名与脚本，支持手工表单提交验证与半自动 curl/Node 回放，方便排查与复现 SSO 登录相关问题。

## Tech Stack
- Vue 3 + TypeScript（Composition API、`<script setup>`）
- Vite 构建，`vue-tsc` 类型检查
- Tailwind CSS + PostCSS + Autoprefixer
- `blueimp-md5` 用于签名计算

## Project Conventions

### Code Style
- Vue SFC 单文件组件，`<script setup lang="ts">`
- 偏向 Composition API（`ref`/`reactive`/`computed`/`watch`）
- Tailwind Utility Class 负责主要样式
- TypeScript 开启严格模式（`strict`、`noUnusedLocals` 等）

### Architecture Patterns
- 单页前端工具，无后端代码；入口 `src/main.ts`
- 核心逻辑集中在 `src/App.vue`，组件层级简单
- 通过计算属性生成签名、curl、Node 脚本与最终 URL

### Testing Strategy
当前未配置自动化测试；以手工运行 `vite dev` / `vite build` 验证为主。
有必要可以引入vitest进行测试

### Git Workflow
暂无明确约定。

## Domain Context
- 目标是生成 `WAC SkipToH5` 请求
- 签名规则：`md5(json + appkey + signKey)`（json 为原始字符串）
- 可选择“原始 JSON”模式，影响签名结果
- 表单提交用于绕过 CORS 并打开新窗口验证跳转

## Important Constraints
- 禁止 CI/CD 自动化；构建、测试、发布必须人工操作
- 所有沟通、代码注释、文档统一使用中文
- 默认最小变更边界，不扩展需求、不做无关重构
- 不泄露密钥、Token、内部链接或敏感配置

## External Dependencies
- 外部接口：由用户填写的 WAC SkipToH5 HTTP 端点（默认 `http://localhost:3003`）
