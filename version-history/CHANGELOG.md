# 版本变更记录

## v0.0.31 (2024-08-03)

### 🎉 重大更新
- **更新到上游最新版本**: 从 v0.0.5 更新到 v0.0.31
- **新增功能**: 支持 MCP (Model Context Protocol) 服务器
- **数据库支持**: 新增 MySQL 数据库支持
- **依赖更新**: 升级到 React 19、pnpm 10.5.2 等最新版本

### 🔧 个人配置保持
- **Cloudflare D1 数据库**: 保持个人数据库ID `f5ed4f60-6284-4ba3-8c9c-105312a2278c`
- **GitHub Actions**: 删除不需要的 Docker CI/CD 工作流
- **配置备份**: 创建 `personal-config/` 文件夹用于未来更新

### 📦 新增依赖
- `@atlaskit/pragmatic-drag-and-drop`: 拖拽功能
- `@formkit/auto-animate`: 动画效果
- `@modelcontextprotocol/sdk`: MCP 协议支持
- `ahooks`: React Hooks 工具库
- `cmdk`: 命令面板组件
- `@napi-rs/pinyin`: 拼音处理

### 🛠️ 技术改进
- **构建系统**: 使用 Nitro 框架进行服务端渲染
- **类型安全**: 改进 TypeScript 配置
- **性能优化**: 更好的代码分割和缓存策略
- **开发体验**: 新增预处理脚本 `presource`

### 📝 文档更新
- 新增日语版本 README
- 更新部署说明
- 改进开发指南

### 🔄 迁移说明
1. 个人配置已自动恢复
2. 如需重新部署，请使用新的构建命令
3. 数据库配置无需更改
4. 环境变量配置保持不变

---

## v0.0.5 (之前版本)
- 基础功能实现
- Cloudflare Pages 部署支持
- GitHub OAuth 登录
- 基本新闻源聚合
