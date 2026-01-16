<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

全局底线约束
- 所有沟通、代码注释、文档**统一使用中文**；新文件使用 UTF-8（无 BOM）。
- **禁止一切 CI/CD 自动化**；构建、测试、发布必须人工操作。
- **默认最小变更边界**：  
  - 不主动扩展需求  
  - 不顺手重构无关代码  
  - 不清理“看起来可以顺便处理”的历史问题
- 禁止泄露密钥、Token、内部链接或敏感配置。
- 使用主流、活跃维护的库和官方 SDK。
- 构建与编译结果必须**零报错**。