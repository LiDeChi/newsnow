# 依赖管理

## 安装所有依赖

```bash
# 使用 pnpm 安装所有依赖
pnpm install
```

## 主要依赖版本

### 核心框架
- **React**: 19.1.0
- **React DOM**: 19.1.0
- **TypeScript**: 5.8.3
- **Vite**: 6.3.5
- **Node.js**: >= 20

### 包管理器
- **pnpm**: 10.5.2 (推荐)

### 服务端框架
- **Nitro**: 通过 vite-plugin-with-nitro 集成
- **H3**: 1.15.3 (HTTP 框架)

### 数据库
- **better-sqlite3**: 11.10.0 (本地开发)
- **db0**: 0.3.2 (数据库抽象层)

### UI 组件
- **Framer Motion**: 12.10.5 (动画)
- **@atlaskit/pragmatic-drag-and-drop**: 1.6.1 (拖拽)
- **cmdk**: 1.1.1 (命令面板)
- **overlayscrollbars**: 2.11.2 (滚动条)

### 工具库
- **dayjs**: 1.11.13 (日期处理)
- **cheerio**: 1.0.0 (HTML 解析)
- **zod**: 3.24.4 (数据验证)
- **ahooks**: 3.8.4 (React Hooks)
- **jotai**: 2.12.4 (状态管理)

### 开发工具
- **ESLint**: 9.26.0
- **Vitest**: 3.1.3 (测试)
- **UnoCSS**: 66.1.1 (CSS 框架)
- **Wrangler**: 4.14.1 (Cloudflare 部署)

## 安装说明

1. **确保 Node.js 版本 >= 20**
2. **启用 Corepack**: `corepack enable`
3. **安装依赖**: `pnpm install`
4. **运行预处理**: `pnpm run presource`
5. **开发模式**: `pnpm dev`
6. **构建生产**: `pnpm build`

## 注意事项

- 使用 pnpm 作为包管理器，确保版本一致性
- 某些依赖需要 Node.js 原生模块编译
- Cloudflare 部署时会自动处理依赖优化
