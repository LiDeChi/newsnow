# 配置参数说明

这个文件夹包含了项目的所有可调节参数和配置文件。

## 文件结构

```
config/
├── README.md           # 本文件，配置说明
├── environment.md      # 环境变量配置
├── deployment.md       # 部署相关配置
└── database.md         # 数据库配置
```

## 主要配置文件

### 1. 环境变量 (.env.server)
- GitHub OAuth 配置
- JWT 密钥
- 数据库初始化设置

### 2. Wrangler 配置 (wrangler.toml)
- Cloudflare Pages 部署配置
- D1 数据库绑定
- 兼容性日期设置

### 3. Nitro 配置 (nitro.config.ts)
- 服务端渲染配置
- 数据库连接器设置
- 不同平台的预设配置

### 4. Vite 配置 (vite.config.ts)
- 构建配置
- 插件设置
- 开发服务器配置

### 5. TypeScript 配置
- tsconfig.json (主配置)
- tsconfig.app.json (应用配置)
- tsconfig.node.json (Node.js 配置)

### 6. UnoCSS 配置 (uno.config.ts)
- CSS 框架配置
- 主题设置
- 自定义规则

## 配置优先级

1. **环境变量** (.env.server)
2. **命令行参数**
3. **配置文件默认值**

## 修改配置的注意事项

1. **备份原配置**: 修改前先备份
2. **测试验证**: 本地测试后再部署
3. **文档更新**: 重要修改需更新文档
4. **版本控制**: 不要提交敏感信息到 Git

## 获取帮助

如果配置有问题，请参考：
1. 项目 README.md
2. 官方文档
3. 示例配置文件 (example.*)
